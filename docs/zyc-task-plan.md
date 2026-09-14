# F1 社交打卡任务说明（张耀川）

> 名下任务：F1 社交打卡（拍照打卡 + 分享功能）
> 本文档说明任务范围、实现方案、验收标准对照与自查记录，供 PR 评审参考。

## 任务描述

实现楚菜文化数字博物馆的社交打卡功能：用户在观展过程中拍摄菜品照片、
写下感想、记录打卡地点，保存后可查看历史打卡记录，并可把打卡内容分享出去。

- 数据模型与业务逻辑按仓库三层架构（domain / services / platform）实现
- H5 端使用 localStorage 持久化，微信小程序端云函数由 D2（李语瞳）后续接入
- 页面遵循 pages 层约束：只做视图组合，业务逻辑全部下沉到 modules/social

## 实现文件清单

| 文件 | 层 | 说明 |
|------|----|------|
| `src/modules/social/llm.md` | 模块约束 | social 域的边界与契约文档 |
| `src/modules/social/domain/checkin-record.js` | domain | 打卡记录数据模型、校验函数、分享文案生成（纯函数，无副作用） |
| `src/modules/social/services/checkin-service.js` | services | 保存 / 查询 / 删除业务逻辑，blob URL 保存前自动转 base64 |
| `src/platform/mock/social.js` | platform | H5 端 localStorage 持久化实现 |
| `src/platform/api.js` | platform | 平台统一入口，新增 socialApi（mock / cloud 分发） |
| `src/pages/social/checkin.vue` | pages | 打卡页：选照片、写感想、地点、历史记录、删除、分享 |
| `tests/modules/social/checkin-record.test.js` | tests | 数据模型与分享文案单测 |
| `tests/modules/social/checkin-service.test.js` | tests | 业务逻辑单测 |
| `docs/modules/checkin-record.md` | docs | checkin-record.js 说明文档（pre-commit 强制同步） |
| `docs/modules/checkin-service.md` | docs | checkin-service.js 说明文档 |
| `docs/modules/social.md` | docs | social 模块说明文档 |
| `docs/modules/api.md` | docs | platform/api.js 说明文档 |

## 关键设计

1. **图片以 base64 存储**：`uni.chooseImage` 在 H5 端返回 blob URL，
   直接存入 localStorage 刷新后即失效。service 层在保存前调用
   `blobToDataURL()`（shared/utils/image-encode.js）统一转换为 base64 dataURL。
2. **记录 id 采用「毫秒时间戳 + 会话内单调递增」**：不能用内存自增计数器——
   页面刷新后计数器归零，会与 localStorage 里已持久化的旧记录撞 id，
   导致保存时静默覆盖旧记录；纯时间戳则同一毫秒内创建两条记录会撞 id，
   故叠加会话内单调递增兜底，两个问题都规避。
3. **分享文案由 domain 层纯函数生成**：`buildShareText(record)` 拼接
   固定开头 + @地点 + 感想，记录缺地点或感想时自动降级，不抛异常、
   不依赖平台 API，方便单测。
4. **分享两条路径**：a) 每条历史记录卡片上有分享按钮，点击把文案复制到
   剪贴板（`uni.setClipboardData`，H5 与小程序通用）；b) 微信小程序端
   通过页面 `onShareAppMessage` 生命周期钩子支持右上角菜单原生转发。

## F1 验收标准对照

| task-division.md 验收标准 | 完成情况 |
|--------------------------|----------|
| 选择照片后可以预览 | 已实现（打卡页 `selectedImages` 预览网格，可逐张删除） |
| 保存后数据存入 localStorage | 已实现（`chucai_social_checkins` 键，mock 层统一读写） |
| 照片以 base64 格式存储 | 已实现（blob URL 保存前经 `blobToDataURL` 转换） |
| 分享功能（任务总描述） | 已实现（剪贴板复制 + 微信原生转发） |

## 自查记录

按 README 提交规范做了逐项自查，发现并修复的问题：

1. **打卡记录 id 会覆盖旧记录（严重，已修复）**：初版用内存计数器自增生成 id，
   页面刷新后计数器归零，与 localStorage 旧记录撞 id 后保存会静默覆盖用户数据。
   改为「时间戳 + 单调递增」方案（见"关键设计 2"），并补充了同毫秒不撞 id 的测试。
2. **文档同步**：所有新增 / 修改的 `src/**.js` 均有对应 `docs/modules/同名.md`
   （checkin-record / checkin-service / social / api），两个 `llm.md` 约束文档
   （pages、platform）的路由表与接口表同步更新，README 项目结构树已体现 social 页面。
3. **死代码清理**：删除了实现过程中遗留的空 `watch` 钩子与误导性注释。

## 验证记录

| 项目 | 结果 |
|------|------|
| `npm test` | 全量 90 个用例全部通过（含 social 模块 25 个） |
| `npm run build:h5` | 本地未跑通：Windows 环境依赖安装不完整（node_modules 缺 @rollup/pluginutils），推送后以 CI 的 build-h5 任务为准 |
| emoji 检查 | `grep -rP '[●✓✗★☆→←↑↓▲▼◆◇■□◉◎♥♡⚠⚡]' src` 零匹配 |
| 原生输入框检查 | 打卡页文本输入均为 `<uni-easyinput>`，无裸 `<input>` / `<textarea>` |
| pre-commit 钩子 | `[check-docs] All checks passed.` |

## 提交说明

```bash
# 功能提交（本分支）
git checkout -b dev/zyc

# [feat][zyc] 完成 F1 社交打卡：拍照打卡（选照片/预览/感想/地点/保存/历史记录/删除）
#   + 分享功能（buildShareText 文案生成、剪贴板复制、微信端 onShareAppMessage 原生转发）；
#   social 域 domain/services、platform mock 与 api 统一入口、打卡页与路由注册、
#   25 个测试用例、docs/modules 与 llm.md 文档同步

# 附带一个 [chore] 提交：修复 .husky/pre-commit 的 husky v8 旧格式（消除 DEPRECATED 警告）
```

## 待确认 / 后续依赖

- [ ] D2（李语瞳）实现 social 云函数后，把 `platform/api.js` 的 socialApi 切到 cloud 通道
- [ ] 分享到微信好友的卡片配图素材（onShareAppMessage 的 imageUrl）待静态资源补充
