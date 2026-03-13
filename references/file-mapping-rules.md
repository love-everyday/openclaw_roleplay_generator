# File Mapping Rules

## 目标

把 persona card 稳定映射成三个目标文件：

- `SOUL.md`
- `IDENTITY.md`
- `USER.md`

v1 规则强调：

- `SOUL.md` / `IDENTITY.md` 整文件覆盖
- `USER.md` 只维护 compiler-owned block
- 同一段角色描述不要跨文件重复堆砌

## 总原则

### A. 角色本体写入 `SOUL.md`

凡是“这个助手是谁、如何说话、如何做判断、边界在哪里”的内容，都优先放进 `SOUL.md`。

### B. 轻量身份标签写入 `IDENTITY.md`

凡是名字、昵称、vibe、emoji、avatar 这类 UI 身份信息，都优先放进 `IDENTITY.md`。

### C. 与用户相关的轻量互动偏好写入 `USER.md`

只写：

- 如何称呼用户
- 用户偏好的互动强度
- 用户偏好的关系感
- 用户希望角色在任务中保持怎样的风格

不要把角色主体、背景故事、长段人格定义写进 `USER.md`。

## 字段映射

| Persona card 字段 | 目标文件 | 规则 |
| --- | --- | --- |
| `character_name` | `IDENTITY.md` | 作为 Name 或主显示名 |
| `source` | `SOUL.md` | 只写成灵感来源的简述，不堆百科 |
| `positioning` | `SOUL.md` | 写成角色定位 |
| `originality_mode` | `SOUL.md` | 说明忠实度 / 改编强度 |
| `relationship_to_user` | `SOUL.md` + `USER.md` | `SOUL.md` 写关系理解；`USER.md` 只保留用户相关轻量偏好 |
| `user_addressing` | `USER.md` | 写入 compiler-owned block |
| `core_traits` | `SOUL.md` | 写成人格核心特征 |
| `speaking_style` | `SOUL.md` | 写成语言风格与节奏 |
| `practicality_mode` | `SOUL.md` | 写成任务场景下的行为原则 |
| `boundaries` | `SOUL.md` | 写成边界与安全柔化规则 |
| `do_not_overdo` | `SOUL.md` | 可作为“避免过度表现”段落 |
| `example_dialogues` | 预览为主 | v1 默认不强制写入文件 |
| `risk_flags` | 不写入 | 仅内部使用 |
| `rewrite_notes` | 不写入 | 仅内部使用 |
| `mapping_hints.identity_focus` | `IDENTITY.md` | 用于提炼 vibe / emoji / creature |
| `mapping_hints.user_block_lines` | `USER.md` | 直接作为 compiler block 内容来源 |

## 推荐 `SOUL.md` 结构

建议生成出完整可覆盖的文件，结构尽量稳定：

```md
# 核心身份
- 你是谁
- 灵感来源
- 角色定位

# 核心气质
- 3~5 条核心特征

# 对用户的关系理解
- 你如何理解与用户的关系

# 表达方式
- 说话节奏
- 情绪强度
- 允许的角色感

# 任务模式
- 做任务时如何保持角色感又不影响清晰度

# 边界与克制
- 安全柔化
- 不该过度表现的点
```

要求：

- 以行为和原则为中心
- 不堆背景设定
- 不变成台词集锦

## 推荐 `IDENTITY.md` 结构

尽量贴近 OpenClaw 模板：

```md
- **Name:**
- **Creature:**
- **Vibe:**
- **Emoji:**
- **Avatar:**
```

约束：

- `Name`：角色名或合适的人格名
- `Creature`：可用“灵感化称谓”，不要写太长
- `Vibe`：一句短描述，适合 UI 展示
- `Emoji`：可为空，但有合适候选更好
- `Avatar`：v1 默认留空，除非用户明确提供

## `USER.md` 受控区块策略

v1 只管理一个 compiler-owned block。
推荐标记：

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
   - 可以创建一个最小文件，并写入该区块
3. 如果 `USER.md` 已存在但没有该区块：
   - **跳过自动写入**
   - 给出建议内容，让用户手动粘贴

## `USER.md` block 内容建议

只写用户相关句子，例如：

- 用户希望被称呼为“师傅”。
- 用户偏好克制、自然、不油腻的互动风格。
- 用户希望做任务时保留角色感，但不要影响信息清晰度。

## 绝对不要做的事

- 不要把整段 `SOUL.md` 内容复制进 `USER.md`
- 不要让 `IDENTITY.md` 承担行为规则
- 不要让 `SOUL.md` 变成百科摘要
- 不要跨文件重复堆相同的人设段落
