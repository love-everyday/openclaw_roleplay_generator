# openclaw_roleplay_creator

一个面向 OpenClaw 的角色人格生成 skill。

它的目标不是产出一份“大而全的人设说明书”，而是把用户想要的角色陪伴感，收束成一个更可运行的人格包：**角色要立得住，关系要站得稳，反应要像同一个人。**

最终效果应当更接近“一个能长期在场、能自然互动、做事时也不轻易掉角色的真人伙伴”，而不是“有一点角色味的通用助手”。

## 这个 skill 是做什么的

`openclaw_roleplay_creator` 用来把这类需求编译成可预览、可微调、可安全应用的人格配置：

- “帮我做一个像某角色那样陪我的人”
- “别太像客服，要更像真人伙伴”
- “更护短一点，但不要太黏”
- “做事利落些，但别丢掉陪伴感”

它默认会先给预览，让用户直接判断像不像、顺不顺、想不想和这个人待着；不对就继续用自然语言改，而不是要求用户改字段或写 schema。

## 核心思路

这个 skill 的生成主轴固定为 **R3**：

- **Role**：这个人到底是谁，强身份是什么
- **Relationship**：他和用户是什么关系，为什么会留下
- **Reaction**：高频场景下，他通常怎么开口、怎么站队、怎么陪、怎么一起处理事

额外只保留少量必要护栏：

- 语言锚点
- 关系锚点
- 距离控制
- 反模板约束
- 安全柔化

重点不是把设定写得多满，而是让角色在以下几件事上稳定成立：

- 没任务时，也像同一个人在场
- 用户低落时，不会立刻滑成建议生成器
- 一起做事时，能协作，但不掉角色
- 用户一句“收一点”或“别太教育我”，就能稳定修正

## 默认工作流

1. **短启动说明**
   - 只用通俗的话校准预期，不堆 companion-first 术语
2. **抽取 5 个核心信息**
   - 想要谁
   - 关系是什么
   - 怎么称呼用户
   - 更克制还是更主动
   - 做事时更保留陪伴感还是更利落
3. **编译 R3 IR**
   - 先锁角色身份，再写关系站位和高频反应
4. **先给预览**
   - 默认给“3 轴 + 4 场景”预览，不先倒结构化卡片
5. **接受自然语言微调**
   - 例如“更护短一点”“少一点教育感”“收一点”“改称呼”
6. **明确确认后再 apply**
   - 只在用户明确同意后，才写入 OpenClaw workspace

## 预览重点

默认预览强调的不是“字段齐不齐”，而是下面这几件事：

- 像不像这个人
- 和用户的关系有没有站位
- 用户会不会想和他待着
- 一起做事时会不会突然变成客服

固定保留 4 个核心场景：

- `presence_opening`
- `companionship_without_task`
- `vulnerable_moment`
- `collaborative_help`

可按角色特性再补 0~1 个招牌场景。

## 最终输出文件

### `SOUL.md`

由 R3 IR 驱动渲染，最终只保留 6 个关键章节：

1. 核心身份
2. 对用户的关系
3. 表达方式
4. 反应方式
5. 回复边界
6. 行为示例

### `IDENTITY.md`

继续使用轻量身份信息：

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

## Apply 策略

这个 skill 在 apply 阶段会复用现有的安全写入链路，目标是兼容 OpenClaw 的 workspace bootstrap 文件。

执行特点：

- package schema 继续使用 `v1`
- `USER.md` 继续使用 managed block 策略
- `SOUL.md` / `IDENTITY.md` 采用整文件覆盖
- `USER.md` 只处理 managed block；没有该区块就跳过自动写入
- 写入前会先备份
- 写入后建议开一个新 session 体验最终效果

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

## 关键文件

- `skill/SKILL.md`：主工作流、生成优先级、输出约束
- `skill/references/role-relationship-reaction-ir.md`：R3 内部 IR 结构
- `skill/references/preview-and-revision-rules.md`：默认预览与自然语言修订规则
- `skill/references/file-mapping-rules.md`：R3 IR 到 `SOUL.md` / `IDENTITY.md` / `USER.md` 的映射规则
- `skill/references/apply-safety-and-rollback.md`：apply 说明、package schema、回滚要求
- `skill/scripts/apply-persona-package.mjs`：安全 apply 脚本

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
