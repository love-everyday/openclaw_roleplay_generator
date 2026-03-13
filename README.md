# openclaw_roleplay_generator

一个面向 OpenClaw 的角色生成人格 skill。

它的目标不是陪用户即兴角色扮演，而是把“帮我生成一份新的角色”“做一个像某角色的助手”“给这个助手换一种人设/气质”这类自然语言需求，整理成一个**可预览、可微调、可安全应用**到 OpenClaw workspace 的角色人格包。

## 核心能力

- **从自然语言生成角色设定**：把角色原型、气质、关系感、称呼偏好、还原强度等需求编译成内部 persona card
- **先预览再决定**：默认先输出角色摘要、关键设定和三段行为预览
- **最终保留短示例**：明确确认 apply 后，最终 `SOUL.md` 会稳定保留 3~5 个短行为示例，增强长期角色稳定性
- **支持自然语言微调**：例如“再克制一点”“不要太油”“叫我师傅”“少一点原作台词感”
- **安全 apply 到 OpenClaw**：只有在用户明确确认后，才写入 `SOUL.md`、`IDENTITY.md`、`USER.md`
- **带备份与回滚信息**：写入前自动备份，完成后返回备份路径和回滚方式

## 默认工作流

1. **抽取意图**
   - 提取角色名 / 角色原型
   - 提取来源或灵感来源
   - 提取核心气质、关系感、称呼偏好、还原强度、实用性要求、安全柔化要求
   - 只有关键信息缺失时，才补问 1~3 个问题

2. **编译内部 persona card**
   - 使用 `references/persona-card-schema.md` 中定义的 schema
   - 先自检，再给用户看预览，不直接甩结构化草稿

3. **输出可判断的预览**
   - 角色摘要
   - 关键设定
   - 行为预览
     - 日常问候
     - 请求帮助
     - 情绪低落时的回应
   - 这 3 段固定场景同时也是最终 `SOUL.md` 示例集的核心骨架，便于用户对比微调前后差异

4. **接受自然语言微调**
   - 用户可以继续口语化修改
   - skill 会更新 persona card 并重新输出预览

5. **明确确认后 apply**
   - 只有用户明确表达“应用 / 写入 / 直接生效 / 开始 apply”时才执行

## 项目结构

```text
openclaw_roleplay_generator/
├── README.md
├── SKILL.md
├── references/
│   ├── apply-safety-and-rollback.md
│   ├── file-mapping-rules.md
│   └── persona-card-schema.md
└── scripts/
    └── apply-persona-package.mjs
```

## 关键文件说明

- `SKILL.md`：skill 主定义与工作流说明
- `references/persona-card-schema.md`：内部 persona card 的 schema 与质量要求
- `references/file-mapping-rules.md`：persona card 到 `SOUL.md` / `IDENTITY.md` / `USER.md` 的映射规则，其中 `example_dialogues` 会映射为最终 `SOUL.md` 的短示例章节
- `references/apply-safety-and-rollback.md`：apply 阶段的安全说明、package schema、回滚要求
- `scripts/apply-persona-package.mjs`：实际执行备份、写入、回滚提示的脚本
