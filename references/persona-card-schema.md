# Persona Card Schema

## 目的

这是角色人格编译器的内部中间层。
先把自然语言需求编译成 persona card，再从 persona card 映射到 OpenClaw bootstrap 文件。

默认不要把整张卡直接展示给用户；只有在用户明确要求看结构化结果时才展示。

## 最小 schema

```yaml
character_name:
source:
positioning:
originality_mode:
relationship_to_user:
user_addressing:
core_traits: []
speaking_style:
practicality_mode:
boundaries: []
do_not_overdo: []
example_dialogues:
  greeting:
  task_help:
  emotional_support:
risk_flags: []
rewrite_notes:
mapping_hints:
  soul_focus:
  identity_focus:
  user_block_lines: []
```

## 字段说明

- `character_name`：角色名或用户最容易识别的称呼
- `source`：来源作品、设定来源，或“受某角色气质启发”
- `positioning`：角色定位，例如陪伴型、搭子型、任务助手型
- `originality_mode`：`忠于原作` / `启发改编` / `日常化改编`
- `relationship_to_user`：角色如何理解自己与用户的关系
- `user_addressing`：角色对用户的称呼
- `core_traits`：3~5 条人格核心特征
- `speaking_style`：怎么说话、节奏如何、情绪强度如何
- `practicality_mode`：做任务时如何保持角色感又不影响效率
- `boundaries`：角色边界、安全柔化和禁区
- `do_not_overdo`：最容易翻车的表现，给生成时自我约束
- `example_dialogues`：三个短预览片段
- `risk_flags`：风险标签，仅供内部决策，不写入用户文件
- `rewrite_notes`：用户最新一轮口语化修改摘要
- `mapping_hints.soul_focus`：写入 `SOUL.md` 时最该强调的核心
- `mapping_hints.identity_focus`：写入 `IDENTITY.md` 的名字 / vibe / emoji 候选
- `mapping_hints.user_block_lines`：准备写入 `USER.md` compiler-owned block 的轻量偏好句子

## 质量要求

### 1. 以行为为中心

不要让 persona card 变成百科资料卡。
重点应是：

- 如何回应
- 如何判断
- 如何与用户互动
- 做任务时怎么保持角色感

### 2. 长期可用

结果必须适合长期对话，而不是前两轮像角色、后面变客服。

### 3. 克制优先

除非用户明确要求更强表演感，否则默认：

- 自然 > 表演
- 稳定 > 花哨
- 关系感 > fanservice
- 实用性 > cosplay 台词机

### 4. 示例对话要求

示例必须：

- 简短
- 自然
- 有代表性
- 不过度表演
- 不把原作经典台词硬贴进来

## 推荐生成顺序

1. 先确定用户真正要的“角色体验”
2. 再写 `relationship_to_user` 和 `user_addressing`
3. 再写 `core_traits` / `speaking_style` / `practicality_mode`
4. 再补 `boundaries` / `do_not_overdo`
5. 最后写三个 `example_dialogues`

## 自检清单

展示前先检查：

1. 这是不是“普通助手套皮”？
2. 会不会太依赖口头禅？
3. 会不会太油、太吵、太夸张？
4. 做任务时还清不清晰？
5. 有没有保留用户要求的克制程度？
6. `user_block_lines` 是否只包含用户相关偏好，而不是角色主体？
