/**
 * @file 用户模块 H5 mock 实现
 * @module platform/mock/user
 *
 * 使用 localStorage 持久化登录态，刷新页面后登录状态不丢失。
 * 注意：微信小程序端对应的云函数实现由 D2 负责接入，接入时必须保证
 * 与本文件的方法签名和返回 payload 同形（铁律 1.5 两端同步）。
 *
 * 分层说明：platform 层不依赖 modules 层，用户对象在本文件内直接构造，
 * 不 import src/modules/user/domain/user.js。
 */

const STORAGE_KEY = 'chucai_user_current';

/**
 * 生成单调递增的用户 id（与 checkin-record 策略一致）
 * @returns {number}
 */
let _lastAutoId = 0;
function nextAutoId() {
  const now = Date.now();
  _lastAutoId = now > _lastAutoId ? now : _lastAutoId + 1;
  return _lastAutoId;
}

/**
 * 将用户对象写入 localStorage
 * @param {Object} user - 用户对象
 */
function saveToStorage(user) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    // 存储写入失败（如超出容量）时静默降级，保住页面可用
  }
}

/**
 * 从 localStorage 读取当前登录用户
 * @returns {Object|null} 用户对象，未登录时返回 null
 */
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch (error) {
    // 数据损坏时按未登录处理，不让页面崩掉
    return null;
  }
}

/**
 * 模拟用户登录
 * H5 mock 场景下忽略 code，直接用 nickname/avatar 生成固定演示用户。
 * openid 固定为占位值 'mock_openid_001'，id 用时间戳自动生成。
 * 生成的用户对象写入 localStorage，刷新页面后登录态保持。
 *
 * @param {Object} [params]              - 登录参数
 * @param {string} [params.code]         - 微信登录 code，H5 mock 忽略此字段
 * @param {string} [params.nickname]     - 用户昵称，不传时默认 '楚菜爱好者'
 * @param {string} [params.avatar]       - 头像 URL 或 base64 dataURL，不传时默认为空字符串
 * @returns {Promise<Object>} 登录成功后的用户对象
 */
export async function login({ code: _code, nickname, avatar } = {}) {
  const user = {
    id: nextAutoId(),
    nickname: typeof nickname === 'string' && nickname.trim() ? nickname.trim() : '楚菜爱好者',
    avatar: typeof avatar === 'string' ? avatar : '',
    openid: 'mock_openid_001',
    createdAt: new Date().toISOString(),
  };
  saveToStorage(user);
  return user;
}

/**
 * 模拟用户登出
 * 删除 localStorage 中的登录态，返回后 getCurrentUser() 将返回 null。
 *
 * @returns {Promise<boolean>} 始终返回 true
 */
export async function logout() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    // 删除失败时静默降级
  }
  return true;
}

/**
 * 获取当前登录用户
 * 从 localStorage 读取，未登录或数据损坏时返回 null。
 *
 * @returns {Promise<Object|null>} 当前用户对象，未登录时返回 null
 */
export async function getCurrentUser() {
  return loadFromStorage();
}
