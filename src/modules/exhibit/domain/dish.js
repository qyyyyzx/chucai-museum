/**
 * @file 楚菜菜品数据模型
 * @module exhibit/domain/dish
 */

/**
 * @typedef {Object} Dish
 * @property {number} id           - 菜品唯一标识
 * @property {string} name         - 菜品名称（必填）
 * @property {string} [image]      - 菜品图片路径
 * @property {string} [history]    - 菜品历史渊源
 * @property {string} [method]     - 烹饪做法
 * @property {string[]} [ingredients] - 食材列表
 */

let _nextId = 1000;

/**
 * 创建一个新的菜品对象
 * @param {Object}  data            - 菜品数据
 * @param {string}  data.name       - 菜品名称（必填）
 * @param {string}  [data.image]    - 菜品图片
 * @param {string}  [data.history]  - 历史渊源
 * @param {string}  [data.method]   - 烹饪做法
 * @param {string[]} [data.ingredients] - 食材列表
 * @returns {Dish} 菜品对象
 */
export function createDish(data) {
  return {
    id: data.id != null ? data.id : _nextId++,
    name: data.name || '',
    image: data.image || '',
    history: data.history || '',
    method: data.method || '',
    ingredients: Array.isArray(data.ingredients) ? [...data.ingredients] : [],
  };
}

/**
 * 将菜品转换为展品列表项格式（供 platform 层使用）
 * @param {Dish} dish - 菜品对象
 * @returns {import('./exhibit-item.js').ExhibitItem} 展品列表项
 */
export function toExhibitItem(dish) {
  return {
    id: dish.id,
    name: dish.name,
    summary: dish.history ? dish.history.slice(0, 80) : '',
    image: dish.image,
    type: 'dish',
  };
}

/**
 * 楚菜示例 - 清蒸武昌鱼
 */
export const EXAMPLE_DISH = createDish({
  id: 1,
  name: '清蒸武昌鱼',
  image: '/static/exhibit/wuchangyu.jpg',
  history:
    '武昌鱼学名团头鲂，原产于湖北鄂州梁子湖。三国时期吴主孙皓欲迁都武昌，民间有"宁饮建业水，不食武昌鱼"的民谣。毛泽东"才饮长沙水，又食武昌鱼"名句使其名扬天下。',
  method:
    '选用鲜活武昌鱼，去鳞去内脏洗净，两面剞花刀，抹盐腌制片刻。鱼身铺姜片、葱段，大火蒸8-10分钟，滗去汤汁，淋上热油和蒸鱼豉油即可。',
  ingredients: ['武昌鱼', '姜', '葱', '蒸鱼豉油', '料酒', '盐'],
});
