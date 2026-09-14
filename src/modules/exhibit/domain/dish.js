/**
 * Dish - 菜品完整数据结构（用于详情页）
 *
 * 包含菜品的全部详情字段。
 * 列表页请使用精简的 ExhibitItem。
 *
 * @typedef {Object} Dish
 * @property {number} id - 菜品唯一标识
 * @property {string} name - 菜品名称
 * @property {string} image - 菜品图片 URL
 * @property {string} history - 历史背景介绍
 * @property {string} technique - 烹饪做法描述
 * @property {string[]} ingredients - 食材列表
 */

/**
 * 验证 Dish 数据是否合法
 *
 * @param {Dish} dish - 待验证的菜品对象
 * @returns {{ valid: boolean, errors: string[] }} 验证结果，errors 为错误信息数组
 */
export function validateDish(dish) {
  const errors = []

  if (!dish || typeof dish !== 'object') {
    return { valid: false, errors: ['dish 必须是一个对象'] }
  }

  if (dish.id === undefined || dish.id === null) {
    errors.push('id 为必填字段')
  }

  if (!dish.name || typeof dish.name !== 'string' || dish.name.trim() === '') {
    errors.push('name 为必填字段')
  }

  if (dish.ingredients !== undefined && !Array.isArray(dish.ingredients)) {
    errors.push('ingredients 必须是数组')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
