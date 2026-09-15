/**
 * @file 用户数据模型
 * @module user/domain/user
 */

/**
 * @typedef {Object} User
 * @property {number} id          - 用户唯一标识
 * @property {string} nickname    - 用户昵称
 * @property {string} avatar      - 头像 URL 或 base64 dataURL
 * @property {string} openid      - 微信 openid（H5 mock 时为固定占位值）
 * @property {string} createdAt   - 注册时间，ISO 8601 格式字符串
 */

/**
 * 自动生成用户 id
 * 与 checkin-record 保持相同策略：以毫秒时间戳为基准、会话内单调递增。
 * - 跨页面刷新安全：新会话起点是当前时间戳，不会与 localStorage 中的旧记录撞 id
 * - 同一毫秒内多次创建也保证唯一
 */
let _lastAutoId = 0;
function nextAutoId() {
  const now = Date.now();
  _lastAutoId = now > _lastAutoId ? now : _lastAutoId + 1;
  return _lastAutoId;
}

/**
 * 创建一个用户对象
 * @param {Object}  data              - 用户数据
 * @param {number}  [data.id]         - 唯一标识，不传时自动生成
 * @param {string}  [data.nickname]   - 用户昵称，不传时使用默认值"游客"
 * @param {string}  [data.avatar]     - 头像 URL 或 base64 dataURL，不传时为空字符串
 * @param {string}  [data.openid]     - 微信 openid，H5 mock 时传入占位值
 * @param {string}  [data.createdAt]  - 注册时间 ISO 8601 字符串，不传时取当前时间
 * @returns {User} 用户对象
 */
export function createUser(data) {
  const source = data || {};
  return {
    id: source.id != null ? source.id : nextAutoId(),
    nickname: typeof source.nickname === 'string' && source.nickname.trim()
      ? source.nickname.trim()
      : '游客',
    avatar: typeof source.avatar === 'string' ? source.avatar : '',
    openid: typeof source.openid === 'string' ? source.openid : '',
    createdAt:
      typeof source.createdAt === 'string' && source.createdAt
        ? source.createdAt
        : new Date().toISOString(),
  };
}

/**
 * 校验用户对象是否合法
 * 校验规则：
 * - id 必须存在且为数字
 * - nickname 必须是非空字符串
 * - avatar 必须是字符串（允许为空）
 * - openid 必须是字符串（允许为空，H5 mock 场景下可为占位值）
 * - createdAt 必须是 ISO 8601 格式字符串
 * @param {User} user - 待校验的用户对象
 * @returns {{ valid: boolean, errors: string[] }} 校验结果，不抛异常
 */
export function validateUser(user) {
  if (!user || typeof user !== 'object') {
    return { valid: false, errors: ['用户对象不能为空'] };
  }

  const errors = [];

  if (user.id == null) {
    errors.push('缺少用户 ID');
  } else if (typeof user.id !== 'number') {
    errors.push('用户 ID 必须是数字');
  }

  if (typeof user.nickname !== 'string' || user.nickname.trim() === '') {
    errors.push('用户昵称不能为空');
  }

  if (typeof user.avatar !== 'string') {
    errors.push('头像必须是字符串');
  }

  if (typeof user.openid !== 'string') {
    errors.push('openid 必须是字符串');
  }

  if (
    typeof user.createdAt !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(user.createdAt)
  ) {
    errors.push('注册时间必须是 ISO 8601 格式字符串');
  }

  return { valid: errors.length === 0, errors };
}
