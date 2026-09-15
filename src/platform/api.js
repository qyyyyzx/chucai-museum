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
import * as exhibitMock from './mock/exhibit.js';
import * as lbsMock from './mock/lbs.js';
import * as userMock from './mock/user.js';

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

/**
 * 展陈域接口
 */
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

  /**
   * 获取单个展品详情
   * @param {number} id - 展品 ID
   * @returns {Promise<Object|null>} 展品完整对象，找不到返回 null
   */
  getExhibitDetail(id) {
    if (isH5()) {
      return exhibitMock.getExhibitDetail(id);
    }
    cloudNotReady('getExhibitDetail');
  },
};

/**
 * LBS 地理位置域接口
 */
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

  /**
   * 获取当前用户位置
   *
   * H5 mock 下返回荆州市中心固定坐标，不调用浏览器 geolocation API。
   * 微信端（D2 接入后）调用 uni.getLocation() 获取真实位置。
   * 两端返回结构保持一致（铁律 1.5）。
   *
   * @returns {Promise<{ latitude: number, longitude: number }>} 当前位置坐标
   */
  getCurrentLocation() {
    if (isH5()) {
      return lbsMock.getCurrentLocation();
    }
    cloudNotReady('getCurrentLocation');
  },
};

/**
 * 用户域接口
 */
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
   * 删除 localStorage 中的登录态（H5），微信端由 D2 实现对应逻辑。
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
   * 从 localStorage 读取（H5），未登录或数据损坏时返回 null。
   * 微信端由 D2 实现对应逻辑。
   *
   * @returns {Promise<Object|null>} 当前用户对象，未登录时返回 null
   */
  getCurrentUser() {
    if (isH5()) {
      return userMock.getCurrentUser();
    }
    cloudNotReady('getCurrentUser');
  },
};
