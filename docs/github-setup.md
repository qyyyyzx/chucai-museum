# GitHub 仓库配置指南

> 本文档说明如何配置GitHub仓库以支持项目的PR流程。

---

## 1. Branch Protection Rules

### 1.1 进入设置页面

1. 访问仓库页面：`https://github.com/qyyyyzx/chucai-museum`
2. 点击 **Settings** 选项卡
3. 在左侧菜单中点击 **Branches**
4. 点击 **Add rule** 按钮

### 1.2 配置main分支保护规则

在 **Branch name pattern** 中输入：`main`

勾选以下选项：

#### Pull Request设置
- ✅ **Require a pull request before merging**
  - ✅ **Require approvals**：设置为 `1`（至少1人批准）
  - ✅ **Dismiss stale PR approvals when new commits are pushed**：启用
  - ❌ **Require review from Code Owners**：根据团队需求决定

#### Status Checks设置
- ✅ **Require status checks to pass before merging**
  - 搜索并选择以下checks：
    - `check-docs-syntax`
    - `test`
    - `build-h5`
    - `build-mp-weixin`
  - ✅ **Require branches to be up to date before merging**

#### 其他设置
- ✅ **Require conversation resolution before merging**
- ❌ **Require signed commits**：根据团队需求决定
- ❌ **Require linear history**：根据团队需求决定
- ❌ **Include administrators**：根据团队需求决定
- ❌ **Restrict who can push to matching branches**：根据团队需求决定
- ❌ **Allow force pushes**：不启用
- ❌ **Allow deletions**：不启用

### 1.3 保存规则

点击 **Create** 或 **Save changes** 按钮保存规则。

---

## 2. 配置自动标签（可选）

### 2.1 创建标签

1. 在仓库页面点击 **Issues** 选项卡
2. 点击 **Labels** 选项卡
3. 创建以下标签：

| 标签名 | 颜色 | 说明 |
|--------|------|------|
| `feat` | `#0075ca` | 新增功能 |
| `fix` | `#d73a4a` | Bug修复 |
| `hotfix` | `#e4e669` | 紧急修复 |
| `refactor` | `#008672` | 重构 |
| `docs` | `#0075ca` | 文档更新 |
| `test` | `#d4c5f9` | 测试补充 |
| `chore` | `#c5def5` | 杂项 |
| `breaking-change` | `#b60205` | Breaking Changes |

### 2.2 配置自动标签（使用GitHub Actions）

创建文件 `.github/workflows/auto-label.yml`：

```yaml
name: Auto Label

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  auto-label:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/github-script@v7
        with:
          script: |
            const pr = context.payload.pull_request;
            const title = pr.title;
            const body = pr.body || '';
            const labels = [];

            // 根据PR标题自动添加标签
            if (title.startsWith('[feat]')) labels.push('feat');
            else if (title.startsWith('[fix]')) labels.push('fix');
            else if (title.startsWith('[hotfix]')) labels.push('hotfix');
            else if (title.startsWith('[refactor]')) labels.push('refactor');
            else if (title.startsWith('[docs]')) labels.push('docs');
            else if (title.startsWith('[test]')) labels.push('test');
            else if (title.startsWith('[chore]')) labels.push('chore');

            // 检查是否有Breaking Changes
            // 检查模板中的checkbox："[x] 本次改动有Breaking Changes"
            const hasBreakingChanges = body.includes('[x] 本次改动有Breaking Changes');
            // 检查是否没有选择"无Breaking Changes"
            const noBreakingChanges = body.includes('[x] 本次改动无Breaking Changes');

            if (hasBreakingChanges && !noBreakingChanges) {
              labels.push('breaking-change');
            }

            // 添加标签
            if (labels.length > 0) {
              await github.rest.issues.addLabels({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: pr.number,
                labels: labels
              });
            }
```

---

## 3. 配置自动分配Reviewer（可选）

创建文件 `.github/workflows/auto-assign.yml`：

```yaml
name: Auto Assign Reviewer

on:
  pull_request:
    types: [opened, ready_for_review]

jobs:
  auto-assign:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/github-script@v7
        with:
          script: |
            const pr = context.payload.pull_request;

            // 如果是草稿PR，不分配Reviewer
            if (pr.draft) return;

            // 获取所有具有写权限的团队成员
            const { data: collaborators } = await github.rest.repos.listCollaborators({
              owner: context.repo.owner,
              repo: context.repo.repo,
              permission: 'write'
            });

            // 随机选择一个Reviewer（排除PR作者）
            const reviewers = collaborators
              .filter(c => c.login !== pr.user.login)
              .map(c => c.login);

            if (reviewers.length > 0) {
              const randomReviewer = reviewers[Math.floor(Math.random() * reviewers.length)];

              await github.rest.pulls.requestReviewers({
                owner: context.repo.owner,
                repo: context.repo.repo,
                pull_number: pr.number,
                reviewers: [randomReviewer]
              });
            }
```

---

## 4. 配置PR大小检查（可选）

创建文件 `.github/workflows/pr-size-check.yml`：

```yaml
name: PR Size Check

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  size-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/github-script@v7
        with:
          script: |
            const pr = context.payload.pull_request;
            const { data: files } = await github.rest.pulls.listFiles({
              owner: context.repo.owner,
              repo: context.repo.repo,
              pull_number: pr.number
            });

            const additions = files.reduce((sum, file) => sum + file.additions, 0);
            const deletions = files.reduce((sum, file) => sum + file.deletions, 0);
            const total = additions + deletions;

            let sizeLabel = '';
            if (total < 10) sizeLabel = 'size/XS';
            else if (total < 50) sizeLabel = 'size/S';
            else if (total < 200) sizeLabel = 'size/M';
            else if (total < 500) sizeLabel = 'size/L';
            else sizeLabel = 'size/XL';

            // 移除旧的size标签
            const currentLabels = pr.labels || [];
            const sizeLabels = currentLabels
              .map(l => l.name)
              .filter(l => l.startsWith('size/'));

            for (const label of sizeLabels) {
              try {
                await github.rest.issues.removeLabel({
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                  issue_number: pr.number,
                  name: label
                });
              } catch (error) {
                // 标签不存在时忽略错误
                console.log(`Label ${label} not found, skipping removal`);
              }
            }

            // 添加新的size标签
            await github.rest.issues.addLabels({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: pr.number,
              labels: [sizeLabel]
            });
```

---

## 5. 配置Issue模板（可选）

### 5.1 创建Issue模板目录

```bash
mkdir -p .github/ISSUE_TEMPLATE
```

### 5.2 创建Bug报告模板

创建文件 `.github/ISSUE_TEMPLATE/bug_report.md`：

```markdown
---
name: Bug报告
about: 报告一个bug
title: '[Bug] '
labels: bug
assignees: ''
---

## Bug描述
<!-- 请清晰简洁地描述这个bug -->

## 复现步骤
1. 进入 '...'
2. 点击 '...'
3. 滚动到 '...'
4. 看到错误

## 期望行为
<!-- 请描述你期望发生的行为 -->

## 实际行为
<!-- 请描述实际发生的行为 -->

## 截图
<!-- 如果可以，请添加截图帮助解释问题 -->

## 环境信息
- 操作系统：[例如 iOS, Android, Windows]
- 浏览器：[例如 Chrome, Safari, 微信开发者工具]
- 版本：[例如 1.0.0]

## 其他信息
<!-- 添加任何其他有关问题的信息 -->
```

### 5.3 创建功能请求模板

创建文件 `.github/ISSUE_TEMPLATE/feature_request.md`：

```markdown
---
name: 功能请求
about: 建议一个新功能
title: '[Feature] '
labels: enhancement
assignees: ''
---

## 功能描述
<!-- 请清晰简洁地描述你想要的功能 -->

## 使用场景
<!-- 请描述这个功能的使用场景 -->

## 期望行为
<!-- 请描述你期望的功能行为 -->

## 替代方案
<!-- 请描述你考虑过的替代方案 -->

## 其他信息
<!-- 添加任何其他有关功能请求的信息 -->
```

---

## 6. 验证配置

### 6.1 验证Branch Protection Rules

1. 尝试直接push到main分支，应该被拒绝
2. 创建一个PR，验证CI检查是否运行
3. 验证是否需要至少1个批准才能合并

### 6.2 验证CI流水线

1. 创建一个PR
2. 查看 **Checks** 选项卡
3. 确认所有jobs都在运行：
   - `check-docs-syntax`
   - `test`
   - `build-h5`
   - `build-mp-weixin`

### 6.3 验证PR模板

1. 创建一个新PR
2. 确认PR模板已自动填充
3. 确认所有必填项都有

---

## 7. 常见问题

### 7.1 CI检查失败但本地测试通过

可能原因：
- CI环境与本地环境不同
- 依赖版本不一致
- 环境变量缺失

解决方案：
- 查看CI日志，找到具体失败原因
- 在本地复现CI环境（使用`npm ci`而非`npm install`）
- 检查是否需要配置环境变量

### 7.2 无法合并PR（需要批准）

解决方案：
- 请求团队成员进行Code Review
- 如果是个人项目，可以临时关闭"Require approvals"选项

### 7.3 CI检查超时

可能原因：
- 测试运行时间过长
- 构建过程卡住

解决方案：
- 优化测试性能
- 增加CI超时时间
- 检查是否有无限循环或阻塞操作

---

## 8. 参考资料

- [GitHub Branch Protection](https://docs.github.com/en/github/administering-a-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)
- [GitHub Actions](https://docs.github.com/en/actions)
- [GitHub Issue Templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository)