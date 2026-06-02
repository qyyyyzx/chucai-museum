/**
 * @file 展陈数据模型验证函数
 * @module exhibit/domain/validators
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean}  valid  - 验证是否通过
 * @property {string[]} errors - 错误信息列表，验证通过时为空数组
 */

// ─── 菜品验证 ────────────────────────────────────────────────

/**
 * 验证菜品对象
 * 必填字段：name（非空字符串）
 * @param {Object} dish - 菜品对象
 * @returns {ValidationResult} 验证结果
 */
export function validateDish(dish) {
  const errors = [];

  if (!dish) {
    return { valid: false, errors: ['菜品对象不能为空'] };
  }

  if (!dish.name || typeof dish.name !== 'string' || dish.name.trim() === '') {
    errors.push('菜品名称不能为空');
  }

  if (dish.id !== undefined && dish.id !== null && typeof dish.id !== 'number') {
    errors.push('菜品 ID 必须是数字类型');
  }

  if (dish.image !== undefined && dish.image !== null && typeof dish.image !== 'string') {
    errors.push('菜品图片必须是字符串类型');
  }

  if (dish.history !== undefined && dish.history !== null && typeof dish.history !== 'string') {
    errors.push('菜品历史必须是字符串类型');
  }

  if (dish.method !== undefined && dish.method !== null && typeof dish.method !== 'string') {
    errors.push('菜品做法必须是字符串类型');
  }

  if (dish.ingredients !== undefined && dish.ingredients !== null && !Array.isArray(dish.ingredients)) {
    errors.push('食材列表必须是数组类型');
  }

  return { valid: errors.length === 0, errors };
}

// ─── 名厨验证 ────────────────────────────────────────────────

/**
 * 验证名厨对象
 * 必填字段：name（非空字符串）
 * @param {Object} chef - 名厨对象
 * @returns {ValidationResult} 验证结果
 */
export function validateChef(chef) {
  const errors = [];

  if (!chef) {
    return { valid: false, errors: ['名厨对象不能为空'] };
  }

  if (!chef.name || typeof chef.name !== 'string' || chef.name.trim() === '') {
    errors.push('名厨姓名不能为空');
  }

  if (chef.id !== undefined && chef.id !== null && typeof chef.id !== 'number') {
    errors.push('名厨 ID 必须是数字类型');
  }

  if (chef.photo !== undefined && chef.photo !== null && typeof chef.photo !== 'string') {
    errors.push('名厨照片必须是字符串类型');
  }

  if (chef.bio !== undefined && chef.bio !== null && typeof chef.bio !== 'string') {
    errors.push('名厨简介必须是字符串类型');
  }

  if (chef.signatureDishes !== undefined && chef.signatureDishes !== null && !Array.isArray(chef.signatureDishes)) {
    errors.push('代表菜品必须是数组类型');
  }

  return { valid: errors.length === 0, errors };
}

// ─── 历史时期验证 ────────────────────────────────────────────

/**
 * 验证历史时期对象
 * 必填字段：dynasty（非空字符串）
 * @param {Object} period - 历史时期对象
 * @returns {ValidationResult} 验证结果
 */
export function validateHistoricalPeriod(period) {
  const errors = [];

  if (!period) {
    return { valid: false, errors: ['历史时期对象不能为空'] };
  }

  if (
    !period.dynasty ||
    typeof period.dynasty !== 'string' ||
    period.dynasty.trim() === ''
  ) {
    errors.push('朝代名称不能为空');
  }

  if (period.id !== undefined && period.id !== null && typeof period.id !== 'number') {
    errors.push('时期 ID 必须是数字类型');
  }

  if (
    period.characteristics !== undefined &&
    period.characteristics !== null &&
    typeof period.characteristics !== 'string'
  ) {
    errors.push('时期特点必须是字符串类型');
  }

  if (
    period.representativeDishes !== undefined &&
    period.representativeDishes !== null &&
    !Array.isArray(period.representativeDishes)
  ) {
    errors.push('代表菜品必须是数组类型');
  }

  return { valid: errors.length === 0, errors };
}
