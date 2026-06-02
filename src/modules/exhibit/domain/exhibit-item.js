/**
 * @file 展品列表项统一数据模型
 * @module exhibit/domain/exhibit-item
 *
 * 菜品和名厨在列表/详情 API 中共享此结构，通过 type 字段区分。
 * 各领域模型（Dish / Chef）通过 toExhibitItem() 转换为此格式。
 */

/**
 * @typedef {Object} ExhibitItem
 * @property {number} id      - 展品唯一标识
 * @property {string} name    - 展品名称
 * @property {string} summary - 摘要信息（截取自详情描述）
 * @property {string} image   - 缩略图路径
 * @property {'dish'|'chef'} type - 展品类型
 */

/**
 * 创建一个展品列表项
 * @param {Object} data
 * @param {number} data.id
 * @param {string} data.name
 * @param {string} data.summary
 * @param {string} data.image
 * @param {'dish'|'chef'} data.type
 * @returns {ExhibitItem}
 */
export function createExhibitItem(data) {
  return {
    id: data.id,
    name: data.name || '',
    summary: data.summary || '',
    image: data.image || '',
    type: data.type || 'dish',
  };
}
