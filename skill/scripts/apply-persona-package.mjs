#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import process from "node:process";

const USER_BLOCK_START = "<!-- character-persona-compiler:start -->";
const USER_BLOCK_END = "<!-- character-persona-compiler:end -->";

function fail(message, details) {
  const error = new Error(message);
  if (details) {
    error.details = details;
  }
  throw error;
}

function expandHome(input) {
  if (!input) return input;
  if (input === "~") return os.homedir();
  if (input.startsWith("~/")) return path.join(os.homedir(), input.slice(2));
  return input;
}

function resolveAbsolute(input) {
  return path.resolve(expandHome(input));
}

function usage() {
  console.log(`Usage:
  node apply-persona-package.mjs --package /absolute/path/to/persona-package.json [--workspace ~/.openclaw/workspace]

Options:
  --package <path>    Persona package JSON file
  --workspace <path>  Target workspace, default ~/.openclaw/workspace
  --help              Show this message`);
}

function parseArgs(argv) {
  const args = { workspace: path.join(os.homedir(), ".openclaw", "workspace") };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--help" || token === "-h") {
      args.help = true;
      continue;
    }
    if (token === "--package") {
      args.packagePath = argv[i + 1];
      i += 1;
      continue;
    }
    if (token === "--workspace") {
      args.workspace = argv[i + 1];
      i += 1;
      continue;
    }
    fail(`Unknown argument: ${token}`);
  }

  return args;
}

function sanitizeTimestamp(date = new Date()) {
  return date.toISOString().replace(/[:.]/g, "-");
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readFileIfExists(filePath) {
  try {
    const [content, stat] = await Promise.all([fs.readFile(filePath, "utf8"), fs.stat(filePath)]);
    return { exists: true, content, mode: stat.mode & 0o777 };
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return { exists: false, content: "", mode: 0o644 };
    }
    throw error;
  }
}

async function writeTextAtomic(filePath, content, mode = 0o644) {
  const dir = path.dirname(filePath);
  const tmpPath = path.join(
    dir,
    `.${path.basename(filePath)}.${process.pid}.${Date.now().toString(36)}.tmp`,
  );
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(tmpPath, content, { encoding: "utf8", mode });
  await fs.chmod(tmpPath, mode);
  await fs.rename(tmpPath, filePath);
}

function ensureNonEmptyString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    fail(`${label} must be a non-empty string.`);
  }
  return value;
}

function ensureStringArray(value, label) {
  if (!Array.isArray(value) || value.length === 0) {
    fail(`${label} must be a non-empty array.`);
  }
  const cleaned = value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
  if (cleaned.length === 0) {
    fail(`${label} must contain at least one non-empty string.`);
  }
  return cleaned;
}

function renderUserBlock(sectionTitle, blockLines) {
  const bullets = blockLines.map((line) => `- ${line}`).join("\n");
  return `${USER_BLOCK_START}\n## ${sectionTitle}\n${bullets}\n${USER_BLOCK_END}`;
}

function replaceManagedUserBlock(existingContent, nextBlock) {
  const startIndex = existingContent.indexOf(USER_BLOCK_START);
  const endIndex = existingContent.indexOf(USER_BLOCK_END);

  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    return null;
  }

  const before = existingContent.slice(0, startIndex).replace(/[ \t]*$/g, "").replace(/\n*$/g, "");
  const after = existingContent.slice(endIndex + USER_BLOCK_END.length).replace(/^\n*/g, "");

  const parts = [];
  if (before) parts.push(before);
  parts.push(nextBlock);
  if (after) parts.push(after);

  return `${parts.join("\n\n").replace(/\n{3,}/g, "\n\n")}\n`;
}

function createUserFileWithManagedBlock(nextBlock) {
  return `# USER.md\n\n${nextBlock}\n`;
}

function buildRollbackInstructions(backups) {
  if (backups.length === 0) {
    return ["No backup files were needed because no previous target files existed."];
  }
  return backups.map((entry) => `cp \"${entry.backupPath}\" \"${entry.originalPath}\"`);
}

function validatePackage(pkg) {
  if (!pkg || typeof pkg !== "object") {
    fail("Persona package must be a JSON object.");
  }
  if (pkg.version !== 1) {
    fail(`Unsupported persona package version: ${pkg.version ?? "unknown"}.`);
  }
  if (!pkg.files || typeof pkg.files !== "object") {
    fail("Persona package is missing files.");
  }

  const soulContent = ensureNonEmptyString(pkg.files["SOUL.md"], "files.SOUL.md");
  const identityContent = ensureNonEmptyString(pkg.files["IDENTITY.md"], "files.IDENTITY.md");

  const userSpec = pkg.files["USER.md"];
  if (!userSpec || typeof userSpec !== "object") {
    fail("files.USER.md must be an object.");
  }
  if (userSpec.mode !== "block") {
    fail(`Unsupported files.USER.md.mode: ${userSpec.mode ?? "unknown"}.`);
  }

  const sectionTitle = typeof userSpec.sectionTitle === "string" && userSpec.sectionTitle.trim()
    ? userSpec.sectionTitle.trim()
    : "Character Interaction Preferences";
  const blockLines = ensureStringArray(userSpec.blockLines, "files.USER.md.blockLines");

  return {
    soulContent: soulContent.endsWith("\n") ? soulContent : `${soulContent}\n`,
    identityContent: identityContent.endsWith("\n") ? identityContent : `${identityContent}\n`,
    userSpec: { mode: "block", sectionTitle, blockLines },
    persona: pkg.persona && typeof pkg.persona === "object" ? pkg.persona : {},
    target: pkg.target && typeof pkg.target === "object" ? pkg.target : {},
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    usage();
    return;
  }
  if (!args.packagePath) {
    usage();
    process.exitCode = 1;
    return;
  }

  const packagePath = resolveAbsolute(args.packagePath);
  const workspaceDir = resolveAbsolute(args.workspace);

  const workspaceStat = await fs.stat(workspaceDir).catch(() => null);
  if (!workspaceStat || !workspaceStat.isDirectory()) {
    fail(`Workspace does not exist or is not a directory: ${workspaceDir}`);
  }

  const packageRaw = await fs.readFile(packagePath, "utf8");
  const packageJson = JSON.parse(packageRaw);
  const validated = validatePackage(packageJson);

  const soulPath = path.join(workspaceDir, "SOUL.md");
  const identityPath = path.join(workspaceDir, "IDENTITY.md");
  const userPath = path.join(workspaceDir, "USER.md");

  const [soulExisting, identityExisting, userExisting] = await Promise.all([
    readFileIfExists(soulPath),
    readFileIfExists(identityPath),
    readFileIfExists(userPath),
  ]);

  const nextUserBlock = renderUserBlock(
    validated.userSpec.sectionTitle,
    validated.userSpec.blockLines,
  );

  let userAction = "skipped-no-block";
  let nextUserContent = null;
  if (!userExisting.exists) {
    userAction = "created-file";
    nextUserContent = createUserFileWithManagedBlock(nextUserBlock);
  } else {
    const replaced = replaceManagedUserBlock(userExisting.content, nextUserBlock);
    if (replaced !== null) {
      userAction = "updated-block";
      nextUserContent = replaced;
    }
  }

  const plan = [
    {
      fileName: "SOUL.md",
      filePath: soulPath,
      action: soulExisting.exists ? "overwritten" : "created-file",
      content: validated.soulContent,
      mode: soulExisting.mode || 0o644,
      snapshot: soulExisting,
    },
    {
      fileName: "IDENTITY.md",
      filePath: identityPath,
      action: identityExisting.exists ? "overwritten" : "created-file",
      content: validated.identityContent,
      mode: identityExisting.mode || 0o644,
      snapshot: identityExisting,
    },
  ];

  if (nextUserContent !== null) {
    plan.push({
      fileName: "USER.md",
      filePath: userPath,
      action: userAction,
      content: nextUserContent,
      mode: userExisting.mode || 0o644,
      snapshot: userExisting,
    });
  }

  const backupStamp = sanitizeTimestamp();
  const backups = [];
  for (const entry of plan) {
    if (!entry.snapshot.exists) continue;
    const backupPath = `${entry.filePath}.bak.${backupStamp}`;
    await fs.copyFile(entry.filePath, backupPath);
    backups.push({
      fileName: entry.fileName,
      originalPath: entry.filePath,
      backupPath,
    });
  }

  const appliedWrites = [];
  try {
    for (const entry of plan) {
      await writeTextAtomic(entry.filePath, entry.content, entry.mode || 0o644);
      appliedWrites.push(entry);
    }
  } catch (error) {
    for (const entry of appliedWrites.reverse()) {
      if (entry.snapshot.exists) {
        await writeTextAtomic(entry.filePath, entry.snapshot.content, entry.snapshot.mode || entry.mode || 0o644);
      } else if (await exists(entry.filePath)) {
        await fs.unlink(entry.filePath).catch(() => {});
      }
    }
    fail(`Apply failed and prior writes were reverted: ${error.message}`);
  }

  const updatedFiles = plan.map((entry) => ({ file: entry.fileName, action: entry.action }));
  const result = {
    ok: true,
    workspace: workspaceDir,
    packagePath,
    persona: {
      name: typeof validated.persona.name === "string" ? validated.persona.name : null,
      source: typeof validated.persona.source === "string" ? validated.persona.source : null,
      summary: typeof validated.persona.summary === "string" ? validated.persona.summary : null,
    },
    backups,
    updatedFiles,
    userMd: {
      action: userAction,
      suggestionBlock: userAction === "skipped-no-block" ? nextUserBlock : null,
    },
    rollback: buildRollbackInstructions(backups),
    reminder: "人格文件通常在新的 session 中会更稳定地生效，建议开启一个新 session 验证最终效果。",
  };

  console.log(`Applied persona package to workspace: ${workspaceDir}`);
  console.log("");
  console.log("Updated files:");
  for (const entry of updatedFiles) {
    console.log(`- ${entry.file}: ${entry.action}`);
  }
  console.log("");
  console.log("Backup files:");
  if (backups.length === 0) {
    console.log("- none");
  } else {
    for (const entry of backups) {
      console.log(`- ${entry.backupPath}`);
    }
  }
  console.log("");
  console.log("Rollback:");
  for (const line of result.rollback) {
    console.log(`- ${line}`);
  }
  console.log("");
  if (result.userMd.action === "skipped-no-block") {
    console.log("USER.md was not modified because it does not contain the managed block markers.");
    console.log("Suggested block to paste manually:");
    console.log(result.userMd.suggestionBlock);
    console.log("");
  }
  console.log(result.reminder);
  console.log("");
  console.log("RESULT_JSON");
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  if (error.details) {
    console.error(JSON.stringify(error.details, null, 2));
  }
  process.exitCode = 1;
});
