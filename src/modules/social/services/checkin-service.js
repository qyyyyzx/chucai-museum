/**
 * @file 社交打卡业务逻辑
 * @module social/services/checkin-service
 */
import { createCheckinRecord, validateCheckinRecord } from '../domain/checkin-record.js';
import { blobToDataURL } from '@/shared/utils/image-encode.js';
import { socialApi } from '@/platform/api.js';

/**
 * 将照片数组中的 blob URL 统一转换为 base64 dataURL
 * H5 模式下 uni.chooseImage 返回的 blob URL 是 page-scoped 的，
 * 直接持久化会导致记录列表跨页显示时图片失效（已知坑 4）
 * @param {string[]} images - 原始照片 URL 数组
 * @returns {Promise<string[]>} 转换后的 base64 dataURL 数组
 */
async function convertImages(images) {
  const converted = [];
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    if (typeof image === 'string' && image.startsWith('blob:')) {
      converted.push(await blobToDataURL(image));
    } else {
      converted.push(image);
    }
  }
  return converted;
}

/**
 * 创建一条打卡记录并保存
 * @param {Object}   input            - 打卡内容
 * @param {string}   [input.note]    - 打卡感想
 * @param {string[]} [input.images]  - 照片数组（可含 blob URL，落库前自动转 base64）
 * @param {string}   [input.location] - 打卡地点描述
 * @returns {Promise<CheckinRecord>} 已保存的打卡记录
 * @throws {Error} 校验失败时抛出，message 中含具体原因
 */
export async function createCheckin(input) {
  const source = input || {};
  const images = await convertImages(Array.isArray(source.images) ? source.images : []);

  const record = createCheckinRecord({
    note: source.note,
    images,
    location: source.location,
    createdAt: source.createdAt,
  });

  const check = validateCheckinRecord(record);
  if (!check.valid) {
    throw new Error(`打卡记录不合法：${check.errors.join('；')}`);
  }

  return socialApi.saveCheckinRecord(record);
}

/**
 * 获取全部打卡记录（按创建时间倒序，最新在前）
 * @returns {CheckinRecord[]}
 */
export function getCheckinRecords() {
  return socialApi.getCheckinRecords();
}

/**
 * 删除一条打卡记录
 * @param {number} id - 记录 ID
 * @returns {boolean} 是否删除成功
 */
export function deleteCheckinRecord(id) {
  return socialApi.deleteCheckinRecord(id);
}
