/**
 * Period - 历史时期数据结构（最小版本）
 *
 * 描述某一历史朝代或时期与楚菜相关的特点和代表菜。
 * 只包含当前需要的最小字段，后续有需求再扩展。
 *
 * @typedef {Object} Period
 * @property {number} id - 历史时期唯一标识
 * @property {string} name - 朝代或时期名称（如"秦汉"、"唐宋"）
 * @property {string} characteristics - 该时期楚菜的主要特点
 * @property {string[]} representativeDishes - 该时期代表菜名称列表
 */

/**
 * 验证 Period 数据是否合法
 *
 * @param {Period} period - 待验证的历史时期对象
 * @returns {{ valid: boolean, errors: string[] }} 验证结果，errors 为错误信息数组
 */
export function validatePeriod(period) {
  const errors = []

  if (!period || typeof period !== 'object') {
    return { valid: false, errors: ['period 必须是一个对象'] }
  }

  if (period.id === undefined || period.id === null) {
    errors.push('id 为必填字段')
  }

  if (!period.name || typeof period.name !== 'string' || period.name.trim() === '') {
    errors.push('name 为必填字段')
  }

  if (period.representativeDishes !== undefined && !Array.isArray(period.representativeDishes)) {
    errors.push('representativeDishes 必须是数组')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
