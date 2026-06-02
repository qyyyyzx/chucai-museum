/**
 * @file 楚菜名厨数据模型
 * @module exhibit/domain/chef
 */

/**
 * @typedef {Object} Chef
 * @property {number} id               - 名厨唯一标识
 * @property {string} name             - 名厨姓名（必填）
 * @property {string} [photo]          - 名厨照片路径
 * @property {string} [bio]            - 名厨简介
 * @property {string[]} [signatureDishes] - 代表菜品列表
 */

let _nextId = 2000;

/**
 * 创建一个新的名厨对象
 * @param {Object}  data              - 名厨数据
 * @param {string}  data.name         - 名厨姓名（必填）
 * @param {string}  [data.photo]      - 照片
 * @param {string}  [data.bio]        - 简介
 * @param {string[]} [data.signatureDishes] - 代表菜品列表
 * @returns {Chef} 名厨对象
 */
export function createChef(data) {
  return {
    id: data.id != null ? data.id : _nextId++,
    name: data.name || '',
    photo: data.photo || '',
    bio: data.bio || '',
    signatureDishes: Array.isArray(data.signatureDishes) ? [...data.signatureDishes] : [],
  };
}

/**
 * 将名厨转换为展品列表项格式（供 platform 层使用）
 * @param {Chef} chef - 名厨对象
 * @returns {import('./exhibit-item.js').ExhibitItem} 展品列表项
 */
export function toExhibitItem(chef) {
  return {
    id: chef.id,
    name: chef.name,
    summary: chef.bio ? chef.bio.slice(0, 80) : '',
    image: chef.photo,
    type: 'chef',
  };
}

/**
 * 楚菜名厨示例 - 卢永良
 */
export const EXAMPLE_CHEF = createChef({
  id: 101,
  name: '卢永良',
  photo: '/static/exhibit/chef-lu.jpg',
  bio:
    '中国烹饪大师，楚菜非遗传承人。师从鄂菜泰斗黄昌祥，从事烹饪工作四十余年。擅长将传统楚菜与现代烹饪技艺结合，对楚菜传承与发展做出重要贡献。',
  signatureDishes: ['清蒸武昌鱼', '排骨藕汤', '沔阳三蒸', '红菜薹炒腊肉'],
});
