# Apply Safety and Rollback

## 目标

新 skill 的 apply 链路继续复用旧版成熟基础设施。
这次的重点不是重写写入机制，而是：

- 继续保留预览 → revision → 明确确认 → apply 的产品链路
- 继续复用 package schema v1
- 继续复用 `USER.md` managed block 策略
- 继续复用备份、失败回滚和结果回显逻辑

## Apply 前必须告诉用户

在真正执行 apply 前，必须明确说明：

- 目标 workspace：默认 `main assistant` 对应的 `~/.openclaw/workspace`
- 这次不是只换语气皮肤，而是把主助手替换成一个强角色人格
- 会处理哪些文件：`SOUL.md`、`IDENTITY.md`、`USER.md`
- 处理方式：
  - `SOUL.md`：备份后整文件覆盖
  - `IDENTITY.md`：备份后整文件覆盖
  - `USER.md`：只更新 managed block；没有区块则跳过自动写入
- 会先自动备份旧文件
- 当前对话不一定立即完全切换，建议新开 session 验证

## Apply 触发条件

只有在用户明确确认时才执行，例如：

- 应用这版
- 直接写入
- 开始 apply
- 就按这个生效

如果用户还在比较、试聊、微调、犹豫，就不要执行脚本。

## Persona package schema

继续使用旧版 schema v1：

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
    "summary": "一个强角色、强关系、强反应的人格包。"
  },
  "files": {
    "SOUL.md": "...完整文件内容...",
    "IDENTITY.md": "...完整文件内容...",
    "USER.md": {
      "mode": "block",
      "sectionTitle": "Character Interaction Preferences",
      "blockLines": [
        "用户希望被称呼为“师傅”。",
        "用户偏好低落时先陪着，不要一上来就推进。"
      ]
    }
  }
}
```

## 字段约束

### `files.SOUL.md`

- 必须是完整文件内容
- apply 时直接覆盖目标文件
- 最终结构必须只保留 6 个关键章节：
  - `核心身份`
  - `对用户的关系`
  - `表达方式`
  - `反应方式`
  - `回复边界`
  - `行为示例`

### `files.IDENTITY.md`

- 必须是完整文件内容
- apply 时直接覆盖目标文件

### `files.USER.md`

v1 仍只支持 block 模式：

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

## marker 兼容策略

第一阶段继续使用旧 marker：

```md
<!-- character-persona-compiler:start -->
...
<!-- character-persona-compiler:end -->
```

原因：

- 避免新旧 block 并存
- 避免破坏现有 workspace
- 避免为了更换生成逻辑而重写 apply 脚本

## 备份规则

写入前对已存在文件生成时间戳备份。
命名形式保持兼容，例如：

- `SOUL.md.bak.2026-03-16T10-30-00-000Z`
- `IDENTITY.md.bak.2026-03-16T10-30-00-000Z`
- `USER.md.bak.2026-03-16T10-30-00-000Z`

要求：

1. 先准备全部最终内容
2. 再一次性备份所有已存在目标文件
3. 备份全部成功后才开始写入
4. 任一步失败就中止

## 失败处理

如果 apply 失败，返回结果必须让用户看懂：

- 哪些文件已经备份
- 哪些文件已经写入
- 哪些文件未写入
- 如何手动回滚

脚本本身会尽量回滚已完成的写入。

## 成功后必须提示

成功后必须明确告诉用户：

- 文件已写入成功
- 备份文件在哪里
- `USER.md` 是更新 / 创建 / 跳过中的哪一种
- 若要恢复旧人格，可把 `.bak.*` 内容恢复回原文件
- 若要体验最终角色效果，建议新开一个 session
- 现在生效的是一个强角色人格，而不只是换了说话语气

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

## 额外检查点

在把 R3 IR 渲染为 package 前，额外确认：

1. `SOUL.md` 真的只剩 6 个章节
2. `USER.md` block 里只有用户偏好，没有角色主体
3. `behavior examples` 仍保留 4 个固定场景，且短、自然、可模仿
4. 一起做事如何不瞬间变客服，已写进 `反应方式` 或 `回复边界`
