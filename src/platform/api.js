/**
 * @file 平台接口统一入口
 * @module platform/api
 *
 * 根据运行环境（H5 / 微信小程序）将调用分发到对应实现：
 * - H5：`src/platform/mock/` 下的 mock 实现
 * - 微信小程序：云函数（D2 负责接入，当前抛出占位错误）
 *
 * 业务层（modules/*/services/）只 import 本文件，不直接依赖 mock/ 或 cloud/。
 */

import * as socialMock from './mock/social.js';
import * as exhibitMock from './mock/exhibit.js';
import * as lbsMock from './mock/lbs.js';
import * as userMock from './mock/user.js';

/**
 * 判断当前是否运行在 H5 环境
 * @returns {boolean}
 */
function isH5() {
  return typeof localStorage !== 'undefined';
}

/**
 * 非 H5 环境下的占位抛错，提示云函数尚未接入
 * @param {string} name - 接口名称
 * @throws {Error}
 */
function cloudNotReady(name) {
  throw new Error(`接口 ${name} 的微信云函数端尚未实现（D2 待接入），当前仅支持 H5 mock`);
}

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

  getCheckinRecords() {
    if (isH5()) {
      return socialMock.getCheckinRecords();
    }
    cloudNotReady('getCheckinRecords');
  },

  deleteCheckinRecord(id) {
    if (isH5()) {
      return socialMock.deleteCheckinRecord(id);
    }
    cloudNotReady('deleteCheckinRecord');
  },
};

export const exhibitApi = {
  /**
   * 获取展品列表（支持按类型筛选 + 分页）
   * @param {Object} params
   * @param {'dish'|'chef'} [params.type] - 展品类型，不传返回全部
   * @param {number} [params.page=1] - 页码，从 1 开始
   * @param {number} [params.pageSize=10] - 每页条数
   * @returns {Promise<{list: Array, total: number, hasMore: boolean}>}
   */
  getExhibitList(params) {
    if (isH5()) {
      return exhibitMock.getExhibitList(params);
    }
    cloudNotReady('getExhibitList');
  },

  getExhibitDetail(id) {
    if (isH5()) {
      return exhibitMock.getExhibitDetail(id);
    }
    cloudNotReady('getExhibitDetail');
  },
};

export const lbsApi = {
  /**
   * 按时辰时段查询餐厅列表
   * @param {string} [timeSlot] - 时辰时段标识（zi/chou/.../hai）；不传则返回全量数据
   * @returns {{ list: Restaurant[], total: number }} 查询结果
   */
  getRestaurantsByTimeSlot(timeSlot) {
    if (isH5()) {
      return lbsMock.getRestaurantsByTimeSlot(timeSlot);
    }
    cloudNotReady('getRestaurantsByTimeSlot');
  },

  getCurrentLocation() {
    if (isH5()) {
      return lbsMock.getCurrentLocation();
    }
    cloudNotReady('getCurrentLocation');
  },
};

export const userApi = {
  /**
   * 用户登录
   * H5 mock 场景下忽略 code，用 nickname/avatar 生成演示用户并写入 localStorage。
   * 微信端（D2 接入后）使用 code 换取 openid，忽略 nickname/avatar。
   *
   * @param {Object} [params]              - 登录参数
   * @param {string} [params.code]         - 微信登录 code，H5 mock 忽略此字段
   * @param {string} [params.nickname]     - 用户昵称，H5 不传时默认 '楚菜爱好者'
   * @param {string} [params.avatar]       - 头像 URL 或 base64 dataURL，H5 不传时默认为空字符串
   * @returns {Promise<Object>} 登录成功后的用户对象
   */
  login(params) {
    if (isH5()) {
      return userMock.login(params);
    }
    cloudNotReady('login');
  },

  /**
   * 用户登出
   * 清除当前登录态，登出后 getCurrentUser() 将返回 null。
   *
   * @returns {Promise<boolean>} 始终返回 true
   */
  logout() {
    if (isH5()) {
      return userMock.logout();
    }
    cloudNotReady('logout');
  },

  /**
   * 获取当前登录用户
   * 未登录或登录态数据损坏时返回 null。
   *
   * @returns {Promise<Object|null>} 当前用户对象，未登录时返回 null
   */
  getCurrentUser() {
    if (isH5()) {
      return userMock.getCurrentUser();
    }
    cloudNotReady('getCurrentUser');
  },

  /**
   * 更新当前登录用户的昵称和头像
   * 必须在已登录状态下调用；未登录时抛出错误。
   * 只允许修改 nickname 和 avatar，id / openid / createdAt 保持不变。
   *
   * @param {Object} fields            - 待更新的字段
   * @param {string} [fields.nickname] - 新昵称，传入有效字符串时 trim 后写入，否则保留原值
   * @param {string} [fields.avatar]   - 新头像 URL 或 base64 dataURL，传入字符串时写入，否则保留原值
   * @returns {Promise<Object>} 更新后的完整用户对象
   * @throws {Error} 未登录时抛出错误
   */
  updateUser(fields) {
    if (isH5()) {
      return userMock.updateUser(fields);
    }
    cloudNotReady('updateUser');
  },
};
