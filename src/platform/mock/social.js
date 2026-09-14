/**
 * @file 社交打卡模块 H5 mock 实现
 * @module platform/mock/social
 *
 * 使用 localStorage 持久化打卡记录，刷新页面后数据不丢失。
 * 注意：微信小程序端对应的云函数实现由 D2 负责接入，接入时必须保证
 * 与本文件的方法签名和返回 payload 同形（铁律 1.5 两端同步）。
 */

const STORAGE_KEY = 'chucai_social_checkins';

/**
 * 从 localStorage 读取全部打卡记录
 * @returns {Array<import('../../modules/social/domain/checkin-record.js').CheckinRecord>}
 */
function loadAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    // 数据损坏时按空处理，不让页面崩掉
    return [];
  }
}

/**
 * 将打卡记录列表写回 localStorage
 * @param {Array} list - 打卡记录数组
 */
function saveAll(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (error) {
    // 存储写入失败（如超出容量）时静默降级，保住页面可用；本次改动会丢失
  }
}

/**
 * 保存一条打卡记录（同 id 覆盖，否则追加）
 * @param {Object} record - 打卡记录
 * @returns {Object} 保存后的记录
 */
export function saveCheckinRecord(record) {
  const list = loadAll();
  const index = list.findIndex((item) => item.id === record.id);
  if (index >= 0) {
    list[index] = record;
  } else {
    list.push(record);
  }
  saveAll(list);
  return record;
}

/**
 * 获取全部打卡记录，按创建时间倒序（最新在前）
 * @returns {Array} 打卡记录数组
 */
export function getCheckinRecords() {
  return loadAll()
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * 删除一条打卡记录
 * @param {number} id - 记录 ID
 * @returns {boolean} 是否删除成功（ID 不存在时返回 false）
 */
export function deleteCheckinRecord(id) {
  const list = loadAll();
  const next = list.filter((item) => item.id !== id);
  saveAll(next);
  return next.length !== list.length;
}
