/**
 * @file 社交打卡记录数据模型
 * @module social/domain/checkin-record
 */

/**
 * @typedef {Object} CheckinRecord
 * @property {number} id         - 打卡记录唯一标识
 * @property {string} note      - 打卡感想文本（可为空，但有照片时才允许为空）
 * @property {string[]} images  - 打卡照片数组，仅允许 base64 dataURL，禁止 blob URL
 * @property {string} location  - 打卡地点描述
 * @property {string} createdAt - 创建时间，ISO 8601 格式字符串
 */

/**
 * 自动生成记录 id
 * 以毫秒时间戳为基准、会话内单调递增：
 * - 跨页面刷新安全：新会话起点是当前时间戳，必然大于历史会话生成的所有 id，
 *   不会与 localStorage 中的旧记录撞 id（同 id 会触发覆盖保存）
 * - 同一毫秒内多次创建也保证唯一（时间戳相同则在前者基础上加一）
 */
let _lastAutoId = 0;
function nextAutoId() {
  const now = Date.now();
  _lastAutoId = now > _lastAutoId ? now : _lastAutoId + 1;
  return _lastAutoId;
}

/**
 * 创建一条打卡记录
 * @param {Object}   data          - 打卡数据
 * @param {number}   [data.id]     - 唯一标识，不传时自动生成
 * @param {string}   [data.note]   - 打卡感想
 * @param {string[]} [data.images] - 照片数组（base64 dataURL）
 * @param {string}   [data.location] - 打卡地点描述
 * @param {string}   [data.createdAt] - 创建时间，不传时取当前时间
 * @returns {CheckinRecord} 打卡记录对象
 */
export function createCheckinRecord(data) {
  const source = data || {};
  return {
    id: source.id != null ? source.id : nextAutoId(),
    note: typeof source.note === 'string' ? source.note.trim() : '',
    images: Array.isArray(source.images) ? [...source.images] : [],
    location: typeof source.location === 'string' ? source.location.trim() : '',
    createdAt:
      typeof source.createdAt === 'string' && source.createdAt
        ? source.createdAt
        : new Date().toISOString(),
  };
}

/**
 * 校验打卡记录是否合法
 * 校验规则：
 * - id 必须存在且为数字
 * - note、location 必须是字符串
 * - images 必须是字符串数组，且每项都不能是 blob: URL（blob URL 跨页面会失效）
 * - 感想和照片不能同时为空
 * - createdAt 必须是 ISO 8601 格式字符串
 * @param {CheckinRecord} record - 待校验的打卡记录
 * @returns {{ valid: boolean, errors: string[] }} 校验结果，不抛异常
 */
export function validateCheckinRecord(record) {
  const errors = [];

  if (!record || typeof record !== 'object') {
    return { valid: false, errors: ['打卡记录不能为空'] };
  }

  if (record.id == null) {
    errors.push('缺少 ID');
  } else if (typeof record.id !== 'number') {
    errors.push('ID 必须是数字');
  }

  if (typeof record.note !== 'string') {
    errors.push('打卡感想必须是字符串');
  }

  if (typeof record.location !== 'string') {
    errors.push('打卡地点必须是字符串');
  }

  if (!Array.isArray(record.images)) {
    errors.push('照片列表必须是数组');
  } else {
    record.images.forEach((image, index) => {
      if (typeof image !== 'string' || !image) {
        errors.push(`第 ${index + 1} 张照片必须是非空字符串`);
      } else if (image.startsWith('blob:')) {
        errors.push(
          `第 ${index + 1} 张照片是 blob URL，必须先用 blobToDataURL() 转换为 base64 dataURL 再保存`
        );
      }
    });
  }

  const noteEmpty = typeof record.note === 'string' ? record.note.trim() === '' : true;
  if (noteEmpty && (!Array.isArray(record.images) || record.images.length === 0)) {
    errors.push('打卡感想和照片不能同时为空');
  }

  if (
    typeof record.createdAt !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(record.createdAt)
  ) {
    errors.push('创建时间必须是 ISO 8601 格式字符串');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * 生成打卡记录的分享文案
 * 组装规则：
 * - 固定开头「我在楚菜文化数字博物馆打卡啦」
 * - 有地点时追加「@地点」
 * - 有感想时追加「感想」（用引号包裹）
 * - 记录为空或字段缺失时只返回固定开头，不抛异常
 * @param {CheckinRecord} [record] - 打卡记录
 * @returns {string} 分享文案文本
 */
export function buildShareText(record) {
  const parts = ['我在楚菜文化数字博物馆打卡啦'];
  if (record && typeof record.location === 'string' && record.location.trim()) {
    parts.push(`@${record.location.trim()}`);
  }
  if (record && typeof record.note === 'string' && record.note.trim()) {
    parts.push(`「${record.note.trim()}」`);
  }
  return parts.join(' ');
}
