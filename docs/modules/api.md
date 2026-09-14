# api.js（platform）

平台适配层业务统一入口。业务代码只 import 本文件，不感知 mock / cloud 底层实现。

## 导出

- `socialApi.saveCheckinRecord(record)` — 保存打卡记录
- `socialApi.getCheckinRecords()` — 获取打卡记录列表
- `socialApi.deleteCheckinRecord(id)` — 删除打卡记录

## 分发规则

- H5 环境（存在 localStorage）：分发到 `./mock/social.js`
- mp-weixin 环境：云函数端尚未接入（D2 待实现），当前抛出明确错误提示

## 扩展规则（D1 / D2 必读）

新增模块接口时：

1. 在本文件按域分组导出（如 `socialApi`、`exhibitApi`）
2. 在 `mock/` 下实现 H5 版本
3. 在 `cloud/` 下实现微信版本（D2）
4. 更新 `src/platform/llm.md` 的 Contracts 表格并登记到本文件
