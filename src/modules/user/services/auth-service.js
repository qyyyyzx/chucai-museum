/**
 * @file 用户登录业务逻辑
 * @module user/services/auth-service
 *
 * 服务层只做转发和必要的业务判断，不重复实现 mock 或云函数的具体逻辑。
 * 底层实现由 platform/api.js 根据运行环境分发到 mock/ 或 cloud/。
 */

import { userApi } from '@/platform/api.js';

/**
 * 用户登录
 * H5 mock 场景下忽略 code，用 nickname/avatar 生成演示用户。
 * 微信端（D2 接入后）使用 code 换取 openid。
 *
 * @param {Object} [params]              - 登录参数
 * @param {string} [params.code]         - 微信登录 code，H5 mock 忽略此字段
 * @param {string} [params.nickname]     - 用户昵称，H5 不传时默认 '楚菜爱好者'
 * @param {string} [params.avatar]       - 头像 URL 或 base64 dataURL，H5 不传时默认为空字符串
 * @returns {Promise<Object>} 登录成功后的用户对象
 */
export async function login(params) {
  return userApi.login(params);
}

/**
 * 用户登出
 * 清除当前登录态，登出后 getCurrentUser() 将返回 null。
 *
 * @returns {Promise<boolean>} 始终返回 true
 */
export async function logout() {
  return userApi.logout();
}

/**
 * 获取当前登录用户
 * 未登录或登录态数据损坏时返回 null。
 *
 * @returns {Promise<Object|null>} 当前用户对象，未登录时返回 null
 */
export async function getCurrentUser() {
  return userApi.getCurrentUser();
}

/**
 * 判断当前是否已登录
 * 内部调用 getCurrentUser()，非 null 即视为已登录。
 *
 * @returns {Promise<boolean>} 已登录返回 true，未登录返回 false
 */
export async function isLoggedIn() {
  const user = await getCurrentUser();
  return user !== null;
}
