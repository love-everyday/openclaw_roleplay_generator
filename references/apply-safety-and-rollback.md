# Apply Safety and Rollback

## 目标

半自动 apply 版的关键不是“写文件”，而是：

- 先说明影响范围
- 再确认
- 再备份
- 再写入
- 最后给回滚路径与生效提示

## Apply 前必须告诉用户

在真正执行 apply 前，必须明确说明：

- 目标 workspace：默认 `main assistant` 对应的 `~/.openclaw/workspace`
- 会处理哪些文件：`SOUL.md`、`IDENTITY.md`、`USER.md`
- 处理方式：
  - `SOUL.md`：备份后整文件覆盖
  - `IDENTITY.md`：备份后整文件覆盖
  - `USER.md`：只更新 compiler-owned block；没有区块则跳过自动写入
- 会先自动备份旧文件
- 当前对话不一定立即完全切换，建议新开 session 验证

## Apply 触发条件

只有在用户明确确认时才执行，例如：

- 应用这版
- 直接写入
- 开始 apply
- 就按这个生效

如果用户还在比较、微调、犹豫，就不要执行脚本。

## 生成给脚本的 package schema

apply 脚本消费一个 JSON 文件。生成时使用下列结构：

```json
{
  "version": 1,
  "target": {
    "workspace": "/Users/you/.openclaw/workspace",
    "agent": "main"
  },
  "persona": {
    "name": "孙悟空",
    "source": "受《西游记》孙悟空启发",
    "summary": "一个机灵、护短、嘴上不饶人但做事可靠的角色助手。"
  },
  "files": {
    "SOUL.md": "...完整文件内容...",
    "IDENTITY.md": "...完整文件内容...",
    "USER.md": {
      "mode": "block",
      "sectionTitle": "Character Interaction Preferences",
      "blockLines": [
        "用户希望被称呼为“师傅”。",
        "用户偏好克制、自然、不油腻的互动风格。"
      ]
    }
  }
}
```

## 字段约束

### `files.SOUL.md`

- 必须是完整文件内容
- apply 时直接覆盖目标文件

### `files.IDENTITY.md`

- 必须是完整文件内容
- apply 时直接覆盖目标文件

### `files.USER.md`

v1 只支持：

```json
{
  "mode": "block",
  "sectionTitle": "Character Interaction Preferences",
  "blockLines": ["..."]
}
```

含义：

- 只维护 compiler-owned block
- 不允许整文件覆盖 `USER.md`

## 备份规则

脚本应在写入前对已存在文件生成时间戳备份。
命名建议：

- `SOUL.md.bak.2026-03-12T21-30-00`
- `IDENTITY.md.bak.2026-03-12T21-30-00`
- `USER.md.bak.2026-03-12T21-30-00`

要求：

1. 先准备全部最终内容
2. 再一次性备份所有已存在目标文件
3. 备份全部成功后才开始写入
4. 任一步失败就中止

## 失败处理

如果 apply 失败，结果里必须能让用户看懂：

- 哪些文件已经备份
- 哪些文件已经写入
- 哪些文件未写入
- 如何手动回滚

## 成功后必须提示

成功后必须明确告诉用户：

- 文件已写入成功
- 备份文件在哪里
- `USER.md` 是更新 / 创建 / 跳过中的哪一种
- 若要恢复旧人格，可把 `.bak.*` 内容恢复回原文件
- 若要体验最终角色效果，建议新开一个 session

## 推荐成功话术

```md
已完成应用。

本次修改：
- 已更新 SOUL.md
- 已更新 IDENTITY.md
- USER.md：已更新角色互动偏好区块 / 已跳过自动写入

备份文件：
- ...
- ...
- ...

如果你想体验最终角色效果，建议开启一个新的 session。
如果你想撤销本次修改，可以把这些备份文件的内容恢复回原文件。
```

## 推荐失败话术

```md
这次 apply 没有完成，我已停止后续写入。

原因：...

当前状态：
- 已备份：...
- 已写入：...
- 未写入：...

如果你想恢复旧人格，可以把对应备份文件的内容恢复回原文件。
```
