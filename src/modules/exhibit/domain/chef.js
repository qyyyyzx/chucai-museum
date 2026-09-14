/**
 * Chef - 名厨完整数据结构（用于详情页）
 *
 * 包含名厨的全部详情字段。
 * 列表页请使用精简的 ExhibitItem。
 *
 * @typedef {Object} Chef
 * @property {number} id - 名厨唯一标识
 * @property {string} name - 名厨姓名
 * @property {string} photo - 名厨照片 URL
 * @property {string} bio - 个人简介
 * @property {string[]} signatureDishes - 代表菜名称列表
 */

/**
 * 验证 Chef 数据是否合法
 *
 * @param {Chef} chef - 待验证的名厨对象
 * @returns {{ valid: boolean, errors: string[] }} 验证结果，errors 为错误信息数组
 */
export function validateChef(chef) {
  const errors = []

  if (!chef || typeof chef !== 'object') {
    return { valid: false, errors: ['chef 必须是一个对象'] }
  }

  if (chef.id === undefined || chef.id === null) {
    errors.push('id 为必填字段')
  }

  if (!chef.name || typeof chef.name !== 'string' || chef.name.trim() === '') {
    errors.push('name 为必填字段')
  }

  if (chef.signatureDishes !== undefined && !Array.isArray(chef.signatureDishes)) {
    errors.push('signatureDishes 必须是数组')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
