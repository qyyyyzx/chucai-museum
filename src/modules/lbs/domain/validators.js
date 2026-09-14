/**
 * @file 餐厅数据模型验证函数
 * @module lbs/domain/validators
 */

import { VALID_TIME_SLOTS } from './restaurant.js';

/**
 * @typedef {Object} ValidationResult
 * @property {boolean}  valid  - 验证是否通过
 * @property {string[]} errors - 错误信息列表，验证通过时为空数组
 */

/**
 * 判断值是否为非空字符串
 * @param {*} val
 * @returns {boolean} true 表示值缺失或为空（应报错）
 */
function isBlankString(val) {
  return !val || typeof val !== 'string' || val.trim() === '';
}

/**
 * 验证餐厅对象
 * 必填字段：name、address、coordinates（含 latitude/longitude）、businessHours（含 open/close）、timeSlot
 * 选填字段：phone（填则必须是字符串）、signatureDishes（填则必须是数组）
 * @param {Object} restaurant - 餐厅对象
 * @returns {ValidationResult} 验证结果
 */
export function validateRestaurant(restaurant) {
  if (!restaurant) {
    return { valid: false, errors: ['餐厅对象不能为空'] };
  }

  const errors = [];

  if (restaurant.id !== undefined && restaurant.id !== null && typeof restaurant.id !== 'number') {
    errors.push('餐厅 ID 必须是数字类型');
  }

  if (isBlankString(restaurant.name)) {
    errors.push('餐厅名称不能为空');
  }

  if (isBlankString(restaurant.address)) {
    errors.push('餐厅地址不能为空');
  }

  if (restaurant.phone !== undefined && restaurant.phone !== null && typeof restaurant.phone !== 'string') {
    errors.push('联系电话必须是字符串类型');
  }

  if (!restaurant.coordinates || typeof restaurant.coordinates !== 'object') {
    errors.push('餐厅坐标不能为空');
  } else {
    if (typeof restaurant.coordinates.latitude !== 'number') {
      errors.push('坐标纬度必须是数字类型');
    }
    if (typeof restaurant.coordinates.longitude !== 'number') {
      errors.push('坐标经度必须是数字类型');
    }
  }

  if (!restaurant.businessHours || typeof restaurant.businessHours !== 'object') {
    errors.push('营业时间不能为空');
  } else {
    if (isBlankString(restaurant.businessHours.open)) {
      errors.push('营业开始时间不能为空');
    }
    if (isBlankString(restaurant.businessHours.close)) {
      errors.push('营业结束时间不能为空');
    }
  }

  if (restaurant.signatureDishes !== undefined && restaurant.signatureDishes !== null && !Array.isArray(restaurant.signatureDishes)) {
    errors.push('招牌菜品必须是数组类型');
  }

  if (isBlankString(restaurant.timeSlot)) {
    errors.push('时辰时段标识不能为空');
  } else if (!VALID_TIME_SLOTS.includes(restaurant.timeSlot)) {
    errors.push('时辰时段标识无效，必须是以下之一：' + VALID_TIME_SLOTS.join('/'));
  }

  return { valid: errors.length === 0, errors };
}
