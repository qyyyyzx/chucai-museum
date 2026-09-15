# C2 展陈列表页面 - 任务拆分

> 负责人：武千惠 (wqh)
> 分支：`dev/wqh`
> 预计时间：5-7 天

---

## 前置依赖（需要先确认/完成）

- [x] **C1 展陈数据模型**是否已定义？（菜品、名厨的数据结构）
  - 若未完成，需先与 C1 负责人对齐数据结构，或自行定义临时结构
- [x] **D1 H5 Mock 数据**是否已就绪？
  - 若未完成，需自行准备 mock 数据或在页面内写死示例数据
- [x] `npm install` 是否能正常运行？

---

## 任务拆分

### Step 1：创建页面文件并注册路由

**文件**：`src/pages/exhibit/list.vue`、`src/pages.json`

**要做**：
1. 创建 `src/pages/exhibit/list.vue` 基础骨架
2. 在 `src/pages.json` 中注册页面路由 `/pages/exhibit/list`
3. 页面能通过 `npm run dev:h5` 访问到

**验收**：浏览器访问对应路由能看到空白页面（不报错）

---

### Step 2：定义列表数据结构 & 准备 mock 数据

**文件**：`src/modules/exhibit/domain/`（数据模型）、`src/platform/mock/`（mock 实现）

**要做**：
1. 定义展品列表项的数据结构（至少包含：id、名称、图片、简介、类型[菜品/名厨]）
2. 在 `src/platform/mock/` 中实现 `getExhibitList()` 接口，返回 mock 数据
3. mock 数据至少 10 条菜品 + 5 条名厨，内容需符合楚菜文化主题
4. 接口签名需与未来微信云函数保持一致（方法名、参数、返回值结构）

**验收**：在页面中调用 `getExhibitList()` 能拿到数据

---

### Step 3：实现列表展示 UI

**文件**：`src/pages/exhibit/list.vue`

**要做**：
1. 使用 `<uni-list>` 或 `<uni-card>` 组件渲染列表
2. 每项展示：图片缩略图、名称、简介摘要
3. 区分菜品和名厨两种展示样式（可用 tab 切换或分组展示）
4. 列表为空时显示空状态提示

**铁律检查**：
- 禁止使用 emoji 或装饰性 Unicode 符号
- 文本输入必须用 `<uni-easyinput>`，不能用原生 `<input>`
- 使用 `@dcloudio/uni-ui` 组件，不手写符号

**验收**：页面能正常显示 mock 数据列表，无 emoji

---

### Step 4：实现下拉刷新

**文件**：`src/pages/exhibit/list.vue`

**要做**：
1. 使用 uni-app 的 `onPullDownRefresh` 生命周期或 `<scroll-view>` 实现下拉刷新
2. 刷新时重新调用 `getExhibitList()` 获取数据
3. 刷新完成后停止loading动画

**验收**：下拉页面能看到刷新效果，数据重新加载

---

### Step 5：实现上拉加载更多（分页）

**文件**：`src/pages/exhibit/list.vue`

**要做**：
1. `getExhibitList()` 接口支持分页参数（page、pageSize）
2. 监听页面滚动到底部（`onReachBottom` 或 `<scroll-view>` 的 `@scrolltolower`）
3. 触底时加载下一页数据，追加到列表末尾
4. 加载中显示loading，无更多数据时显示"没有更多了"

**验收**：滚动到底部能自动加载更多数据

---

### Step 6：实现点击跳转到详情页

**文件**：`src/pages/exhibit/list.vue`、`src/pages.json`

**要做**：
1. 点击列表项跳转到 `src/pages/exhibit/detail.vue`（C3 负责人的页面）
2. 通过路由参数传递展品 id
3. 跳转使用 `uni.navigateTo({ url: '/pages/exhibit/detail?id=xxx' })`
4. 若详情页尚未创建，先创建一个占位页面

**验收**：点击列表项能跳转到详情页，详情页能收到 id 参数

---

## 自检清单（提交前必查）

- [ ] `npm test` 全绿
- [ ] `grep -rP '[●✓✗★☆→←↑↓▲▼◆◇■□◉◎♥♡⚠⚡]' src` 零匹配
- [ ] 页面中无裸的 `<input>` 或 `<textarea>`
- [ ] 使用 uni-ui 组件，未手写装饰符号
- [ ] mock 接口签名与云函数预期一致
- [ ] commit message 符合 `[feat][wqh] 展陈列表页：xxx` 格式

---

## 待确认问题

1. C1 的数据模型定义好了吗？具体字段是什么？
2. D1 的 mock 数据准备好了吗？还是要我自己写？
3. 详情页（C3）谁负责？需要提前对齐路由参数格式
