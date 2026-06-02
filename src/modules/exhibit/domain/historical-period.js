/**
 * @file 楚菜历史时期数据模型
 * @module exhibit/domain/historical-period
 */

/**
 * @typedef {Object} HistoricalPeriod
 * @property {number} id                     - 历史时期唯一标识
 * @property {string} dynasty                - 朝代名称（必填）
 * @property {string} [characteristics]      - 该时期楚菜的特点
 * @property {string[]} [representativeDishes] - 该时期代表菜品列表
 */

let _nextId = 3000;

/**
 * 创建一个新的历史时期对象
 * @param {Object}  data                     - 历史时期数据
 * @param {string}  data.dynasty             - 朝代名称（必填）
 * @param {string}  [data.characteristics]   - 时期特点
 * @param {string[]} [data.representativeDishes] - 代表菜品列表
 * @returns {HistoricalPeriod} 历史时期对象
 */
export function createHistoricalPeriod(data) {
  return {
    id: data.id != null ? data.id : _nextId++,
    dynasty: data.dynasty || '',
    characteristics: data.characteristics || '',
    representativeDishes: Array.isArray(data.representativeDishes)
      ? [...data.representativeDishes]
      : [],
  };
}

/**
 * 楚菜历史时期示例 - 春秋战国
 */
export const EXAMPLE_PERIOD = createHistoricalPeriod({
  id: 1,
  dynasty: '春秋战国',
  characteristics:
    '楚地物产丰富，《楚辞》中已有大量饮食记载。楚人"饭稻羹鱼"，以稻米为主食，鱼类为副食。烹饪技法以炙、蒸、煮为主，调味善用香草。此时期奠定了楚菜"鲜、香、辣"的味型基础。',
  representativeDishes: ['炙鱼', '楚羹', '稻米饭', '香草蒸鱼'],
});
