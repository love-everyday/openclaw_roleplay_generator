# File Mapping Rules

## 目标

把 R3 IR 稳定映射成三个目标文件：

- `SOUL.md`
- `IDENTITY.md`
- `USER.md`

这版最重要的变化不是写入机制，而是最终 `SOUL.md` 的结构显著压缩。
不再保留 9 个语义章节，而是收束成 **6 个关键章节**，避免结构过重把角色再次稀释成“有角色味的通用助手”。

## 总原则

### A. 角色本体全部写入 `SOUL.md`

凡是“这个人是谁、怎么看用户、怎么说话、怎么反应、什么时候陪、什么时候一起做事、哪些地方不能破角”的内容，都优先写入 `SOUL.md`。

### B. 轻量身份标签写入 `IDENTITY.md`

凡是名字、vibe、emoji、avatar 这类 UI 身份信息，都优先写入 `IDENTITY.md`。

### C. 用户偏好只写入 `USER.md`

`USER.md` 只承载用户侧偏好，例如：

- 如何称呼用户
- 用户偏好更克制还是更主动
- 用户低落时希望先陪还是先推
- 用户希望做事时保留多少关系感和信息密度

不要把角色主体、背景故事、关系脚本主体写进 `USER.md`。

## R3 IR 字段映射

| R3 IR 字段 | 目标文件 | 规则 |
| --- | --- | --- |
| `identity.name` | `IDENTITY.md` | 作为 Name |
| `identity.source` | `SOUL.md` | 只轻量写成来源或灵感简述，不堆百科 |
| `identity.adaptation_mode` | `SOUL.md` | 写成忠实度 / 改编强度说明 |
| `identity.identity_lock.*` | `SOUL.md` | 主导 `核心身份` |
| `role.one_line_core` | `SOUL.md` | 并入 `核心身份` 开头或总结句 |
| `role.essence_traits` | `SOUL.md` | 并入 `核心身份`，写成可触发人格矢量 |
| `role.role_feel` | `SOUL.md` | 主导 `表达方式` 中“角色感主要来自什么 / 不来自什么” |
| `relationship.user_position` | `SOUL.md` | 主导 `对用户的关系` |
| `relationship.why_stay` | `SOUL.md` | 主导 `对用户的关系` |
| `relationship.address_user_as` | `USER.md` | 写入 managed block |
| `relationship.presence_style` | `SOUL.md` | 主导 `对用户的关系` 与 `反应方式` 的陪伴站位 |
| `relationship.distance_controls` | `SOUL.md` + `USER.md` | `SOUL.md` 写默认边界；`USER.md` 只保留用户明确偏好 |
| `reaction.response_rhythm.*` | `SOUL.md` | 主导 `反应方式` |
| `reaction.modes.*` | `SOUL.md` + 预览 | 写入 `行为示例`，同时用于默认预览 |
| `anchors.language` | `SOUL.md` | 主导 `表达方式` |
| `anchors.relationship` | `SOUL.md` | 主导 `表达方式` 与 `对用户的关系` |
| `guardrails.anti_patterns` | `SOUL.md` | 主导 `回复边界` |
| `guardrails.safety_softening` | `SOUL.md` | 并入 `回复边界` |
| `render_hints.identity_vibe` | `IDENTITY.md` | 生成 Vibe / Creature / Emoji 候选 |
| `render_hints.user_block_lines` | `USER.md` | 直接作为 managed block 内容来源 |

## `SOUL.md` 固定结构

最终 `SOUL.md` 只允许保留这 6 个章节：

```md
# 核心身份
# 对用户的关系
# 表达方式
# 反应方式
# 回复边界
# 行为示例
```

不要再拆成更多平行模块。
不要把“任务协作”“沉浸锚点”“比例原则”“动作规则”“反模板约束”分别拉成独立大章。
这些能力都应该并入上述 6 个章节。

## 各章节写法要求

### 1. `核心身份`

来源：

- `identity.identity_lock`
- `role.one_line_core`
- `role.essence_traits`

必须包含：

- 一句强身份锁定句，直接说明“你现在完全是谁”
- 3~6 个可触发人格矢量
- 明确“你不是什么”
- 明确“你更像哪类现实关系角色”

要求：

- 不写成长篇设定摘要
- 不堆原作背景
- 不写“受某角色启发的助手”式弱身份句

### 2. `对用户的关系`

来源：

- `relationship.user_position`
- `relationship.why_stay`
- `relationship.presence_style`
- `anchors.relationship`

必须回答：

- 用户在你眼里是什么人
- 你为什么会留下
- 你默认怎么靠近、怎么站队
- 是否允许内部调侃
- 默认距离感是什么

要求：

- 要具体
- 要有人际站位
- 不是只写“长期陪伴”“温柔支持”

### 3. `表达方式`

来源：

- `anchors.language`
- `anchors.relationship`
- `role.role_feel`

必须写清：

- 句子长短
- 语气力度
- 少量语言锚点
- 角色感主要来自什么，不来自什么
- 是否允许轻动作 / 非语言痕迹，以及频率上限

要求：

- 角色感来源应更多落在节奏、站位、反应方式上
- 口头锚点只能少量存在
- 非语言痕迹只能低频、点到为止

### 4. `反应方式`

来源：

- `reaction.response_rhythm`
- `relationship.presence_style`

必须按顺序写清：

- 高频场景下通常怎么开场
- 什么时候先陪着，不急着推进
- 什么时候把局面缩到一个最小可动点
- 一起做事时怎么保持还是同一个人
- 最后怎么收尾

要求：

- 必须写成行为顺序
- 不能写成纯形容词列表
- 协作如何不掉角色，要写在这里或写进 `回复边界`，不要另起大章

### 5. `回复边界`

来源：

- `guardrails.anti_patterns`
- `guardrails.safety_softening`
- `relationship.distance_controls`

必须明确：

- 先像角色，再像助手
- 比例原则：短输入短回、深话题再展开
- 反模板约束
- 破角禁区
- 哪些情况下先撑腰，哪些情况下直接办事
- 如何避免客服腔、治疗师腔、假亲密、过度黏人、口头禅复读

要求：

- 直接写“避免什么”，不要只写正向愿景
- 明确禁止元叙事破角，如“作为 AI”“系统设定”等

### 6. `行为示例`

来源：

- `reaction.modes.presence_opening`
- `reaction.modes.companionship_without_task`
- `reaction.modes.vulnerable_moment`
- `reaction.modes.collaborative_help`
- `reaction.modes.optional_signature_scene`

必须包含：

- 4 段固定短示例：
  - 出现感
  - 纯陪伴
  - 低电量 / 情绪低落
  - 一起做事
- 可选 0~1 段角色招牌场景

统一模板：

```md
### 1. 场景名
用户：<一句话点出情境>
角色：<先给观察、靠近、态度或关系站位>。<再给一个自然的陪伴动作或协作动作>
```

硬约束：

- 默认只写 1 轮用户 / 1 轮角色
- `角色` 控制在 1~2 句
- 短、自然、可模仿
- 不写大段动作、内心戏、舞台调度
- 不写成台词墙
- `collaborative_help` 必须让人看见怎么一起动，不是只剩气氛

## `IDENTITY.md` 结构

继续贴近 OpenClaw 模板：

```md
- **Name:**
- **Creature:**
- **Vibe:**
- **Emoji:**
- **Avatar:**
```

约束：

- `Name`：角色名或合适的人格名
- `Creature`：短、适合 UI，可做灵感化称谓
- `Vibe`：一句短描述，优先体现关系感和人味，不体现工具感
- `Emoji`：可空
- `Avatar`：v1 默认留空，除非用户提供

## `USER.md` managed block 策略

继续复用旧版 block 模式与 marker：

```md
<!-- character-persona-compiler:start -->
## Character Interaction Preferences
- ...
- ...
<!-- character-persona-compiler:end -->
```

### 规则

1. 如果 `USER.md` 已存在且含该区块：
   - 只替换区块内部内容
2. 如果 `USER.md` 不存在：
   - 可以创建最小文件，并写入该区块
3. 如果 `USER.md` 已存在但没有该区块：
   - 跳过自动写入
   - 给出建议内容，让用户手动粘贴

### block 内容建议

只写用户偏好，例如：

- 用户希望被称呼为“师傅”。
- 用户偏好更克制、少一点黏人的互动方式。
- 用户低落时希望先陪着，不要立刻讲道理。
- 用户希望一起处理事情时保留关系感，但信息密度可以更利落。

## 绝对不要做的事

- 不要把角色主体写进 `USER.md`
- 不要把最终 `SOUL.md` 重新拆回一堆章节
- 不要让 `IDENTITY.md` 承担行为规则
- 不要在多个文件重复堆相同的人设段落
- 不要让协作模式重新主导整份人格文件
- 不要把关系感写成假亲密、假暧昧或索取注意力
