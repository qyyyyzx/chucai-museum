/**
 * ExhibitItem - 展品列表项（精简结构）
 *
 * 用于列表页展示，只包含列表所需的少量字段。
 * 详情页所需的完整字段请使用 Dish 或 Chef。
 *
 * @typedef {Object} ExhibitItem
 * @property {number} id - 展品唯一标识
 * @property {string} name - 展品名称
 * @property {string} summary - 简介摘要
 * @property {string} image - 封面图片 URL
 * @property {'dish'|'chef'} type - 展品类型：菜品或名厨
 */

/**
 * 合法的展品类型列表
 */
const VALID_TYPES = ['dish', 'chef']

/**
 * 验证 ExhibitItem 数据是否合法
 *
 * @param {ExhibitItem} item - 待验证的展品列表项
 * @returns {{ valid: boolean, errors: string[] }} 验证结果，errors 为错误信息数组
 */
export function validateExhibitItem(item) {
  const errors = []

  if (!item || typeof item !== 'object') {
    return { valid: false, errors: ['item 必须是一个对象'] }
  }

  if (item.id === undefined || item.id === null) {
    errors.push('id 为必填字段')
  }

  if (!item.name || typeof item.name !== 'string' || item.name.trim() === '') {
    errors.push('name 为必填字段')
  }

  if (!item.type) {
    errors.push('type 为必填字段')
  } else if (!VALID_TYPES.includes(item.type)) {
    errors.push(`type 只能是 ${VALID_TYPES.join(' 或 ')}，当前值为 "${item.type}"`)
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
