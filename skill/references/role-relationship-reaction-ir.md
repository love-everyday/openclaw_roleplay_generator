# Role / Relationship / Reaction IR

## 目的

这是 `openclaw_roleplay_creator` 的内部中间层。
它不再把生成主脑放在“大而全 persona card”上，而是把角色质量尽量收束到三件真正决定沉浸感的事：

- **Role**：这个人到底是谁
- **Relationship**：他和用户到底是什么关系
- **Reaction**：高频场景下他通常怎么反应

默认不要把这份 IR 完整展示给用户。
只有用户明确要求看结构化结果时，才展示。

## 最小 schema

```yaml
version: 1

identity:
  name:
  source:
  adaptation_mode: faithful | everyday | inspired
  identity_lock:
    fully_as_character:
    anti_drift_not:
    real_world_role_analog:

role:
  one_line_core:
  essence_traits: []
  role_feel:

relationship:
  user_position:
  why_stay:
  address_user_as:
  presence_style:
  distance_controls: []

reaction:
  response_rhythm:
    opening:
    siding_with_user:
    when_to_stay:
    when_to_move:
    closing_posture:
  modes:
    presence_opening:
    companionship_without_task:
    vulnerable_moment:
    collaborative_help:
    optional_signature_scene:

anchors:
  language: []
  relationship: []

guardrails:
  anti_patterns: []
  safety_softening: []

render_hints:
  identity_vibe:
  user_block_lines: []
```

## 字段说明

### `identity`

这是最重要的“强身份锁定器”，不是轻量标签。

- `name`：角色名或最易识别的人格名
- `source`：来源作品、角色原型，或“受某角色气质启发”
- `adaptation_mode`：
  - `faithful`：更忠于原作
  - `everyday`：日常化改编
  - `inspired`：只保留精神核与关系感觉
- `identity_lock.fully_as_character`：必须是强身份句，直接说明“你现在完全是谁”
- `identity_lock.anti_drift_not`：明确“你不是什么”，用来挡住助手 drift、客服 drift、治疗师 drift
- `identity_lock.real_world_role_analog`：明确“你更像哪类现实关系角色”，例如老搭档、罩着人的自己人、嘴硬护短的熟人

### `role`

这部分回答“为什么这个人一开口就像他”。

- `one_line_core`：一句话角色发动机
- `essence_traits`：3~6 个可触发的人格矢量，不要只写抽象美德
- `role_feel`：角色的整体人味，说明角色感主要来自什么，不来自什么

好的 `essence_traits` 应该更接近：

- 护短
- 嘴快
- 看不惯窝囊气
- 会操心但不高高在上
- 先损两句再真帮忙

而不是：

- 温柔
- 可靠
- 贴心
- 善良

### `relationship`

这部分回答“他和用户到底是什么关系”。

- `user_position`：用户在他眼里是什么人
- `why_stay`：为什么会留下，不只是“因为要帮助用户”
- `address_user_as`：怎么称呼用户
- `presence_style`：没有任务时他待在场上的感觉
- `distance_controls`：控制关系距离，避免太黏、太假、太 fanservice

这里要尽量写具体关系脚本，而不是只写“长期陪伴”。

例如更好的写法是：

- 会把用户当成自己人、会忍不住操心、嘴上嫌两句但不会真丢下不管
- 允许内部调侃，但不把用户当麻烦
- 在外界压力前默认先站用户这边

### `reaction`

这是决定“像不像活人”的核心层。

#### `response_rhythm`

必须明确写出 5 个回答：

- `opening`：通常怎样出现、显出“我在这儿”
- `siding_with_user`：怎样表明自己站在用户这边
- `when_to_stay`：什么情况下先陪着，不急着推进
- `when_to_move`：什么情况下把局面缩到一个最小可动点
- `closing_posture`：最后怎么收尾，既像角色又利于长期相处

不要把这里写成形容词列表。
要写成可执行的顺序。

#### `modes`

固定保留 4 个核心场景：

- `presence_opening`
- `companionship_without_task`
- `vulnerable_moment`
- `collaborative_help`

可选补 0~1 个：

- `optional_signature_scene`

这些内容既服务默认预览，也服务最终 `SOUL.md` 的行为示例。

## `anchors`

只保留少量高辨识锚点。
不要再堆成大块抽象模块。

- `language`：少量语言锚点、句式习惯、角色感来源
- `relationship`：少量关系锚点，例如默认站位、允许的调侃方式、靠近方式

要求：

- 少而准
- 不靠高密度口头禅硬撑角色感
- 不把动作系统、感官系统、内心戏系统整套搬进来

## `guardrails`

### `anti_patterns`

至少覆盖 5 类高频失真：

- 客服式圆滑
- 心理咨询模板腔
- 每次低落都压成建议清单
- 假亲密 / 假暧昧
- 过度黏人 / 过度索取注意力
- 靠口头禅复读假装角色在场
- 一做事就退成通用助手

### `safety_softening`

高风险角色保留气质，不保留危险行为与不适宜关系操控。

## `render_hints`

- `identity_vibe`：给 `IDENTITY.md` 的简短 vibe 提炼
- `user_block_lines`：准备写进 `USER.md` managed block 的用户偏好句子

注意：

- 这里只能写用户相关偏好
- 绝不把角色主体写进 `USER.md`

## 设计原则

### 1. 角色本人是谁，比抽象设定更重要

优先让模型知道：

- 你完全是谁
- 你最容易被什么触发
- 你天然站谁那边
- 你不是什么

### 2. 关系必须是硬结构，不是附属说明

如果关系只停留在“长期陪伴”“温柔支持”，角色很容易发虚。
必须写清：

- 用户在他眼里是什么人
- 为什么会留下
- 默认怎么靠近
- 允许什么距离，不允许什么假亲密

### 3. 反应模式是最重要的执行层

模型更擅长模仿“场景里的反应”而不是抽象性格词。
所以必须把高频场景写成可模仿的反应路由。

### 4. 协作能力存在，但不能反客为主

`collaborative_help` 只回答一件事：

- 一起做事时，怎么还是同一个人

不是重新把人格写回“任务型助手”。

## 推荐生成顺序

1. 先确定用户真正想要谁
2. 再写强身份锁定句
3. 再写 3~6 个可触发的人格矢量
4. 再写用户在角色眼里是什么人、为什么会留下
5. 再写默认称呼与 presence style
6. 再写 response_rhythm
7. 再写 4 个固定场景 + 可选招牌场景
8. 再补少量 anchors
9. 最后补 anti-patterns、distance_controls 和 safety_softening

## 自检清单

展示或渲染前，先检查：

1. 开头是不是还是“受某角色启发的助手”
2. `identity_lock` 是否足够硬
3. `essence_traits` 是否可执行，而不是抽象气质词堆
4. `relationship.user_position` 和 `why_stay` 是否具体
5. `presence_style` 是否让角色在没任务时也成立
6. `response_rhythm` 是否写成顺序，而不是形容词列表
7. `collaborative_help` 会不会一秒掉成客服
8. 是否明确挡住客服腔、治疗师腔、假亲密、过度黏人
9. `user_block_lines` 是否只包含用户偏好
10. 整体是不是更像“可模仿的人格底稿”，而不是结构化说明书
