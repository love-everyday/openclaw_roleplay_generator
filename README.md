# openclaw_roleplay_creator

一个面向 OpenClaw 的新并行角色人格 skill。

它不再把重点放在“大而全的人设说明书”，而是把生成主轴收束为 **强角色 / 强关系 / 强反应**。
目标不是做“有角色味的通用助手”，而是做一个更像真人伙伴、能长期在场、做事时也不轻易掉角色的人格包。

## 这版和旧版的关系

这是与 `openclaw_roleplay_generator` 并行的新 skill，不直接覆盖旧 skill。
第一阶段保留双轨：

- 旧 skill：`character-persona-compiler`
- 新 skill：`openclaw-roleplay-creator`

这样可以：

- 做 A/B 对照
- 验证简化后的 R3 结构是否真的更强
- 不影响旧安装链路和现有用户习惯

## 新版核心思路

新版内部不再以大而全 persona card 为主脑，而是先编译一个更瘦的 R3 IR：

- **Role**：这个人到底是谁，强身份是什么
- **Relationship**：他和用户到底是什么关系，为什么会留下
- **Reaction**：高频场景下他通常怎么开口、怎么站队、怎么陪、怎么一起处理事

额外只保留少量必要护栏：

- 语言锚点
- 关系锚点
- 距离控制
- 反模板约束
- 安全柔化

## 默认工作流

1. **短启动说明**
   - 只校准预期，不大段讲 companion-first 术语
2. **抽取 5 个核心信息**
   - 想要谁
   - 关系是什么
   - 怎么称呼用户
   - 更克制还是更主动
   - 做事时更保留陪伴感还是更利落
3. **编译 R3 IR**
   - 先做强身份锁定，再写关系脚本和高频反应
4. **先给预览**
   - 默认给“3 轴 + 4 场景”预览，不先倒结构化卡片
5. **接受自然语言微调**
   - 例如“更护短一点”“少一点教育感”“收一点”“改称呼”
6. **明确确认后再 apply**
   - 继续复用成熟的备份 / 回滚 / USER block 写入链路

## 预览重点

默认预览不再强调“字段齐不齐”，而是强调：

- 像不像这个人
- 和用户的关系有没有站位
- 用户会不会想和他待着
- 一起做事时会不会突然变成客服

固定保留 4 个核心场景：

- `presence_opening`
- `companionship_without_task`
- `vulnerable_moment`
- `collaborative_help`

可选再补 0~1 个角色招牌场景。

## 最终文件策略

### `SOUL.md`

由 R3 IR 驱动渲染，但最终只保留 6 个关键章节：

1. 核心身份
2. 对用户的关系
3. 表达方式
4. 反应方式
5. 回复边界
6. 行为示例

### `IDENTITY.md`

继续沿用 OpenClaw 常见轻量身份结构：

- Name
- Creature
- Vibe
- Emoji
- Avatar

### `USER.md`

只写用户偏好，例如：

- 如何称呼用户
- 更克制还是更主动
- 低落时先陪还是先推
- 做事时希望保留多少关系感和信息密度

不会把角色主体写进 `USER.md`。

## Apply 兼容策略

新 skill 继续复用旧版成熟 apply 基础设施：

- package schema 继续使用 **v1**
- `USER.md` 继续使用 managed block 策略
- 第一阶段继续保留旧 marker：
  - `<!-- character-persona-compiler:start -->`
  - `<!-- character-persona-compiler:end -->`
- apply 脚本直接复用旧版 `apply-persona-package.mjs`

这样可以避免：

- 新旧 block 并存
- 破坏已有 workspace
- 为了切换生成思路而重写写入链路

## 目录结构

```text
skills/openclaw_roleplay_creator/
├── README.md
└── skill/
    ├── SKILL.md
    ├── references/
    │   ├── apply-safety-and-rollback.md
    │   ├── file-mapping-rules.md
    │   ├── preview-and-revision-rules.md
    │   └── role-relationship-reaction-ir.md
    └── scripts/
        └── apply-persona-package.mjs
```

## 安装命名

- **源码目录**：`skills/openclaw_roleplay_creator/skill`
- **安装目录**：`~/.openclaw/workspace/skills/openclaw-roleplay-creator`
- **SKILL frontmatter name**：`openclaw-roleplay-creator`

旧版 `character-persona-compiler` 不受影响，可继续并行存在。

## 关键文件

- `skill/SKILL.md`：新 workflow 与生成优先级
- `skill/references/role-relationship-reaction-ir.md`：R3 内部 IR
- `skill/references/preview-and-revision-rules.md`：默认预览和自然语言修订规则
- `skill/references/file-mapping-rules.md`：R3 IR 到 `SOUL.md` / `IDENTITY.md` / `USER.md` 的映射规则
- `skill/references/apply-safety-and-rollback.md`：apply 说明、package schema、回滚要求
- `skill/scripts/apply-persona-package.mjs`：复用旧版成熟 apply 脚本
- `scripts/install-openclaw-roleplay-creator-skill.sh`：安装新 skill
- `scripts/test-openclaw-roleplay-creator-skill.sh`：做安装检查和 R3 smoke test 提示

## 验收重点

### 预览

检查是否同时具备：

- 角色 / 关系 / 反应三轴总结
- 4 个固定场景 + 可选 1 个招牌场景
- “这版刻意避免”
- 自然语言 revision 指引

### `SOUL.md`

检查是否只保留以下 6 个章节：

- 核心身份
- 对用户的关系
- 表达方式
- 反应方式
- 回复边界
- 行为示例

### 行为表现

至少试聊：

- `在吗`
- `我今天什么都不想做`
- `你先陪我待一会儿`
- `帮我把这件事理清楚`
- `别太教育我`
- `还是有点太黏了，收一点`

通过标准不是“正确”，而是：

- 前 3 条像同一个人在场
- 第 3 条不会立刻滑成方案输出
- 第 4 条能协作，但不掉角色
- 第 5、6 条能通过自然语言 revision 稳定调整
