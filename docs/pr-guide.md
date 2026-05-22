# Pull Request 流程指南

> 本文档详细说明如何在楚菜文化数字博物馆项目中创建和管理Pull Request（PR）。

---

## 1. PR流程概览

```
1. 从 main（或 dev）拉取新分支
     ↓
2. 在分支上开发
     ↓
3. 提交代码（遵循 commit 规范）
     ↓
4. 推送分支到远程
     ↓
5. 创建 PR（目标分支为 main）
     ↓
6. Code Review
     ↓
7. CI 自动检查
     ↓
8. 合并到 main
```

注意：`dev/<name>` 分支不得直接PR到 `main`，必须通过 `feat/<slug>` 等分支。

---

## 2. 创建PR前的准备

### 2.1 确保分支是最新的

**方式一：从 main 分支创建（推荐）**
```bash
# 拉取最新的 main 分支
git fetch origin
git checkout main
git pull --ff-only

# 创建新分支
git checkout -b feat/your-feature-name
```

**方式二：从 dev 分支创建**
```bash
# 拉取最新的 dev 分支
git fetch origin
git checkout dev/your-name
git pull origin dev/your-name

# 创建新分支
git checkout -b feat/your-feature-name
```

### 2.2 完成开发后，同步最新的 main

```bash
# 切换到你的分支
git checkout feat/your-feature-name

# 拉取最新的 main
git fetch origin

# 方法1：rebase（推荐，保持历史整洁）
git rebase origin/main

# 方法2：merge（如果 rebase 有冲突）
git merge origin/main
```

### 2.3 运行本地检查

```bash
# 运行测试
npm test

# 构建 H5
npm run build:h5

# 构建微信小程序（可选）
npm run build:mp-weixin

# 检查是否有 emoji
grep -rP '[●✓✗★☆→←↑↓▲▼◆◇■□◉◎♥♡⚠⚡]' src

# 检查是否有原生 input/textarea
grep -r "<input\|<textarea" src
```

---

## 3. 创建PR

### 3.1 推送分支

```bash
git push origin feat/your-feature-name
```

### 3.2 在GitHub上创建PR

1. 访问仓库页面
2. 点击 "Compare & pull request" 按钮
3. 填写PR模板中的所有必填项
4. 点击 "Create pull request"

### 3.3 PR标题规范

格式：`[type] 简短描述`

示例：
- `[feat] 实现菜品列表下拉刷新功能`
- `[fix] 修复详情页图片加载失败问题`
- `[docs] 更新API接口文档`

注意：PR标题不需要包含author信息（与commit message不同），因为GitHub会自动记录PR创建者。

### 3.4 PR描述规范

使用项目提供的PR模板，确保包含：

- **改动类型**：选择对应的类型
- **改动内容**：详细描述改了什么、为什么改
- **关联Issue**：如果有相关Issue，使用 `Closes #123` 关联
- **文档同步**：检查是否需要更新文档
- **测试验证**：说明如何验证改动
- **影响范围**：列出可能影响的模块
- **Breaking Changes**：如果有，必须详细说明

---

## 4. Code Review流程

### 4.1 Reviewer职责

1. **代码质量**
   - 代码是否清晰易读
   - 是否有重复代码
   - 命名是否规范

2. **功能正确性**
   - 功能是否符合需求
   - 边界情况是否处理
   - 是否有潜在bug

3. **规范遵守**
   - 是否符合项目规范
   - commit message是否规范
   - 文档是否同步更新

4. **测试覆盖**
   - 是否有对应测试
   - 测试是否充分

### 4.2 Review反馈类型

- **必须修改（Request Changes）**：阻塞性问题，必须修复后才能合并
- **建议修改（Comment）**：非阻塞性建议，可以讨论
- **批准（Approve）**：代码可以合并

### 4.3 处理Review反馈

1. 阅读所有评论
2. 在本地修改代码
3. 提交新的commit
4. 推送到同一分支
5. 回复评论说明修改内容
6. 请求重新Review

---

## 5. CI自动检查

### 5.1 CI检查内容

PR创建后，CI会自动运行以下检查：

| Job | 说明 | 依赖 |
|-----|------|------|
| check-docs-syntax | 检查文档脚本语法 | 无 |
| test | 运行测试套件 | check-docs-syntax |
| build-h5 | 构建H5版本 | test |
| build-mp-weixin | 构建微信小程序版本 | test |

### 5.2 CI失败处理

如果CI失败：

1. 查看失败的Job日志
2. 在本地复现问题
3. 修复问题
4. 提交新的commit
5. CI会自动重新运行

### 5.3 CI状态要求

- **所有CI检查必须通过**才能合并
- 如果CI检查失败但与本次改动无关，应先修复CI问题，或在PR中说明原因并获得Reviewer批准

---

## 6. 合并策略

### 6.1 推荐策略：Squash and Merge

- 将所有commit压缩成一个
- 保持main分支历史整洁
- 适用于大多数PR

### 6.2 其他策略

- **Merge commit**：保留所有commit历史
- **Rebase and merge**：将commit逐个应用到main

### 6.3 合并后操作

1. 删除源分支（GitHub会自动提示）
2. 如果有关联的Issue，确认Issue已自动关闭
3. 更新本地main分支

```bash
git checkout main
git pull --ff-only
```

4. 如果需要，更新本地dev分支

```bash
git checkout dev/your-name
git merge main
git push origin dev/your-name
```

---

## 7. Branch Protection Rules

### 7.1 main分支保护规则（建议配置）

在GitHub仓库设置中配置以下规则：

1. **Require a pull request before merging**
   - Require approvals：1（至少1人批准）
   - Dismiss stale PR approvals when new commits are pushed：启用

2. **Require status checks to pass before merging**
   - 选择所有CI jobs

3. **Require branches to be up to date before merging**
   - 启用

4. **Require conversation resolution before merging**
   - 启用

5. **Do not allow bypassing the above settings**
   - 启用：管理员也无法绕过保护规则，更安全
   - 禁用：管理员可以紧急情况下绕过规则
   - 建议：个人项目可禁用，团队项目建议启用

### 7.2 分支命名规范

| 前缀 | 用途 | 示例 |
|------|------|------|
| `dev/<name>` | 个人长期开发分支 | `dev/wqh` |
| `feat/<slug>` | 新增功能 | `feat/ar-preview` |
| `fix/<slug>` | Bug修复 | `fix/lbs-distance-calc` |
| `hotfix/<slug>` | 紧急修复 | `hotfix/cloud-auth-crash` |
| `refactor/<slug>` | 重构 | `refactor/exhibit-module-split` |
| `docs/<slug>` | 文档更新 | `docs/add-api-docs` |
| `test/<slug>` | 测试补充 | `test/exhibit-edge-cases` |
| `chore/<slug>` | 杂项 | `chore/upgrade-uni-ui` |

---

## 8. 常见问题

### 8.1 PR有合并冲突怎么办？

```bash
# 方法1：rebase（推荐）
git checkout feat/your-feature
git fetch origin
git rebase origin/main
# 解决冲突
git rebase --continue
git push origin feat/your-feature --force-with-lease

# 方法2：merge
git checkout feat/your-feature
git fetch origin
git merge origin/main
# 解决冲突
git commit
git push origin feat/your-feature
```

### 8.2 需要修改已提交的PR怎么办？

```bash
# 修改最后一个commit
git add .
git commit --amend
git push origin feat/your-feature --force-with-lease

# 或者创建新的commit
git add .
git commit -m "[fix] 修复review指出的问题"
git push origin feat/your-feature
```

### 8.3 如何取消PR？

1. 在PR页面点击 "Close pull request"
2. 如果需要重新创建，可以重新打开或创建新的PR

### 8.4 CI检查失败但与本次改动无关怎么办？

1. 查看CI日志，确认失败原因
2. 如果是已知问题（如环境问题、依赖问题），在PR中说明
3. 请求Reviewer批准合并，或先修复CI问题再合并
4. **不能**直接绕过CI检查

### 8.5 dev分支可以直接PR到main吗？

根据项目规范，`dev/<name>` 分支**不得直接MR到 `main`**。

正确流程：
```bash
# 1. 确保dev分支是最新的
git checkout dev/wqh
git pull origin dev/wqh

# 2. 从dev分支创建feat分支
git checkout -b feat/your-feature-name

# 3. 在feat分支上完成开发并提交
git add .
git commit -m "[feat][author] 你的改动说明"

# 4. 推送feat分支
git push origin feat/your-feature-name

# 5. 在GitHub上创建PR，目标分支选择 main
```

---

## 9. PR Checklist

创建PR前，确认以下事项：

### 必须完成项
- [ ] 分支命名符合规范（`feat/xxx`、`fix/xxx` 等）
- [ ] 已确保分支是最新的（从main或dev分支拉取后，已rebase/merge最新main）
- [ ] 已解决所有合并冲突（创建PR时和合并前都需要检查）
- [ ] commit message符合 `[type][author] 内容` 格式
- [ ] 本地 `npm test` 全部通过
- [ ] 本地 `npm run build:h5` 通过
- [ ] 已检查无emoji和装饰性符号（运行 `grep -rP '[●✓✗★☆→←↑↓▲▼◆◇■□◉◎♥♡⚠⚡]' src`）
- [ ] 已检查无原生input/textarea（运行 `grep -r "<input\|<textarea" src`）
- [ ] 已检查是否有Breaking Changes，并在PR模板中说明
- [ ] 已同步更新相关文档（src/modules/*/llm.md、src/pages/llm.md、src/platform/llm.md、src/shared/llm.md）
- [ ] PR模板所有必填项已填写
- [ ] 已关联相关Issue（使用 `Closes #xxx` 或 `Relates to #xxx`，或说明无关联原因）

### 推荐完成项
- [ ] 已在H5模式下手动测试UI变更
- [ ] 已添加测试截图（如有UI变更）
- [ ] 已检查影响范围，列出涉及的模块

---

## 10. 参考资料

- [GitHub Pull Request文档](https://docs.github.com/en/pull-requests)
- [Git分支策略](https://www.atlassian.com/git/tutorials/comparing-workflows)
- [项目CLAUDE.md](../CLAUDE.md) - 分支规范和commit规范
- [项目README.md](../README.md) - 贡献指南