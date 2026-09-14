/**
 * @file 平台适配层业务统一入口
 * @module platform/api
 *
 * 业务代码通过本文件调用数据接口，不感知底层实现：
 * - H5 模式：分发到 mock/（localStorage 持久化）
 * - mp-weixin 模式：分发到 cloud/（微信云函数，待 D2 接入后启用）
 *
 * 铁律 1.5（两端同步）：mock/ 与 cloud/ 的方法签名和返回 payload 必须同形。
 * D1 / D2 后续在各自任务中扩展本文件时，请保持既有结构不变、按下表登记。
 */

import * as socialMock from './mock/social.js';

/**
 * 判断当前是否 H5 环境（有 localStorage）
 * @returns {boolean}
 */
function isH5() {
  return typeof localStorage !== 'undefined';
}

/**
 * 微信云函数端尚未接入时的占位实现
 * @param {string} name - 接口名
 */
function cloudNotReady(name) {
  throw new Error(`接口 ${name} 的微信云函数端尚未实现（D2 待接入），当前仅支持 H5 mock`);
}

/**
 * 社交打卡域接口
 */
export const socialApi = {
  /**
   * 保存一条打卡记录（同 id 覆盖）
   * @param {Object} record - 打卡记录
   * @returns {Object} 保存后的记录
   */
  saveCheckinRecord(record) {
    if (isH5()) {
      return socialMock.saveCheckinRecord(record);
    }
    cloudNotReady('saveCheckinRecord');
  },

  /**
   * 获取全部打卡记录（按创建时间倒序）
   * @returns {Array} 打卡记录数组
   */
  getCheckinRecords() {
    if (isH5()) {
      return socialMock.getCheckinRecords();
    }
    cloudNotReady('getCheckinRecords');
  },

  /**
   * 删除一条打卡记录
   * @param {number} id - 记录 ID
   * @returns {boolean} 是否删除成功
   */
  deleteCheckinRecord(id) {
    if (isH5()) {
      return socialMock.deleteCheckinRecord(id);
    }
    cloudNotReady('deleteCheckinRecord');
  },
};
