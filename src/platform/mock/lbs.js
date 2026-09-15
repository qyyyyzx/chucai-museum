/**
 * @file 餐厅 H5 Mock 数据与接口实现
 * @module platform/mock/lbs
 *
 * 实现餐厅查询接口，支持按时辰时段筛选和全量查询两种模式。
 * 数据覆盖荆州十二时辰，每家餐厅对应一个时辰，包含至少3道招牌菜品。
 */

import { createRestaurant, VALID_TIME_SLOTS } from '../../modules/lbs/domain/restaurant.js';

// 荆州十二时辰餐厅 mock 数据，顺序与 VALID_TIME_SLOTS 对应
const MOCK_RESTAURANTS = [
  createRestaurant({
    id: 1,
    name: '夜宵楚府',
    address: '湖北省荆州市沙市区江津路168号',
    phone: '0716-88880001',
    coordinates: { latitude: 30.3156, longitude: 112.2301 },
    businessHours: { open: '23:00', close: '01:00', remark: '次日凌晨结束营业' },
    signatureDishes: ['宵夜藕汤', '夜市烤鱼', '荆州酱鸭', '糯米鸡'],
    timeSlot: VALID_TIME_SLOTS[0],
  }),
  createRestaurant({
    id: 2,
    name: '丑时面馆',
    address: '湖北省荆州市荆州区荆中路22号',
    phone: '0716-88880002',
    coordinates: { latitude: 30.3502, longitude: 112.1887 },
    businessHours: { open: '01:00', close: '03:00', remark: '深夜营业' },
    signatureDishes: ['牛肉热干面', '荆州锅盔', '豆皮', '绿豆汤'],
    timeSlot: VALID_TIME_SLOTS[1],
  }),
  createRestaurant({
    id: 3,
    name: '寅时早茶坊',
    address: '湖北省荆州市沙市区北京路56号',
    phone: '0716-88880003',
    coordinates: { latitude: 30.3289, longitude: 112.2563 },
    businessHours: { open: '03:00', close: '05:00', remark: '专供早市配送客' },
    signatureDishes: ['荆州早茶拼盘', '虾饺', '叉烧包', '糯米烧麦'],
    timeSlot: VALID_TIME_SLOTS[2],
  }),
  createRestaurant({
    id: 4,
    name: '卯时粥铺',
    address: '湖北省荆州市荆州区东门路9号',
    phone: '0716-88880004',
    coordinates: { latitude: 30.3601, longitude: 112.1994 },
    businessHours: { open: '05:00', close: '07:00', remark: '早市专供' },
    signatureDishes: ['皮蛋瘦肉粥', '荆州米粉', '油条豆浆', '千张肉'],
    timeSlot: VALID_TIME_SLOTS[3],
  }),
  createRestaurant({
    id: 5,
    name: '辰时楚菜馆',
    address: '湖北省荆州市沙市区解放路88号',
    phone: '0716-88880005',
    coordinates: { latitude: 30.3308, longitude: 112.2404 },
    businessHours: { open: '07:00', close: '09:00', remark: '早餐时段' },
    signatureDishes: ['清蒸武昌鱼', '排骨藕汤', '沔阳三蒸'],
    timeSlot: VALID_TIME_SLOTS[4],
  }),
  createRestaurant({
    id: 6,
    name: '巳时鲜鱼坊',
    address: '湖北省荆州市沙市区工农兵路33号',
    phone: '0716-88880006',
    coordinates: { latitude: 30.3198, longitude: 112.2489 },
    businessHours: { open: '09:00', close: '11:00', remark: '上午营业' },
    signatureDishes: ['红烧鮰鱼', '荆沙鱼糕', '藕带炒肉', '剁椒鱼头'],
    timeSlot: VALID_TIME_SLOTS[5],
  }),
  createRestaurant({
    id: 7,
    name: '楚味轩',
    address: '湖北省荆州市沙市区胜利街101号',
    phone: '0716-88880007',
    coordinates: { latitude: 30.3345, longitude: 112.2511 },
    businessHours: { open: '11:00', close: '13:00', remark: '午市营业' },
    signatureDishes: ['荆州鱼糕', '红菜薹炒腊肉', '千张肉', '荆沙甲鱼'],
    timeSlot: VALID_TIME_SLOTS[6],
  }),
  createRestaurant({
    id: 8,
    name: '未时老灶火锅',
    address: '湖北省荆州市开发区园林路77号',
    phone: '0716-88880008',
    coordinates: { latitude: 30.3052, longitude: 112.2198 },
    businessHours: { open: '13:00', close: '15:00', remark: '下午茶时段' },
    signatureDishes: ['荆州牛杂锅', '毛肚火锅', '脑花豆腐', '藕片'],
    timeSlot: VALID_TIME_SLOTS[7],
  }),
  createRestaurant({
    id: 9,
    name: '申时茶点居',
    address: '湖北省荆州市荆州区荆南路45号',
    phone: '0716-88880009',
    coordinates: { latitude: 30.3478, longitude: 112.1823 },
    businessHours: { open: '15:00', close: '17:00', remark: '下午茶' },
    signatureDishes: ['荆州绿豆糕', '米发糕', '糯米藕', '麻糖'],
    timeSlot: VALID_TIME_SLOTS[8],
  }),
  createRestaurant({
    id: 10,
    name: '酉时江边烤鱼',
    address: '湖北省荆州市沙市区沿江大道158号',
    phone: '0716-88880010',
    coordinates: { latitude: 30.3124, longitude: 112.2356 },
    businessHours: { open: '17:00', close: '19:00', remark: '傍晚营业' },
    signatureDishes: ['荆州烤鱼', '麻辣小龙虾', '炭烤玉米', '烤藕片'],
    timeSlot: VALID_TIME_SLOTS[9],
  }),
  createRestaurant({
    id: 11,
    name: '戌时楚宴酒楼',
    address: '湖北省荆州市荆州区古城路188号',
    phone: '0716-88880011',
    coordinates: { latitude: 30.3554, longitude: 112.1765 },
    businessHours: { open: '19:00', close: '21:00', remark: '晚市营业' },
    signatureDishes: ['荆州全鱼宴', '荆沙甲鱼', '莲藕排骨汤', '蒸肉圆'],
    timeSlot: VALID_TIME_SLOTS[10],
  }),
  createRestaurant({
    id: 12,
    name: '亥时串串香',
    address: '湖北省荆州市沙市区红门路99号',
    phone: '0716-88880012',
    coordinates: { latitude: 30.3267, longitude: 112.2642 },
    businessHours: { open: '21:00', close: '23:00', remark: '夜市营业' },
    signatureDishes: ['楚式串串', '荆州卤味拼盘', '臭豆腐', '冰粉'],
    timeSlot: VALID_TIME_SLOTS[11],
  }),
];

/**
 * 按时辰时段查询餐厅列表
 * @param {string} [timeSlot] - 时辰时段标识（见 VALID_TIME_SLOTS）；不传则返回全量数据
 * @returns {{ list: Restaurant[], total: number }} 查询结果
 */
export function getRestaurantsByTimeSlot(timeSlot) {
  if (timeSlot == null) {
    return { list: MOCK_RESTAURANTS, total: MOCK_RESTAURANTS.length };
  }
  const list = MOCK_RESTAURANTS.filter((r) => r.timeSlot === timeSlot);
  return { list, total: list.length };
}

/**
 * 获取当前用户位置（H5 mock 实现）
 *
 * H5 环境下不调用浏览器 geolocation API，直接返回荆州市中心固定坐标。
 * 原因：浏览器 geolocation 在 localhost 下需要授权且非 HTTPS 环境可能失败，
 * 而验收标准只要求"H5 模式下能模拟获取位置"，固定坐标完全满足。
 *
 * 返回结构与微信端 uni.getLocation() 对齐（铁律 1.5），
 * 未来微信端实现时只需保持 { latitude, longitude } 结构不变。
 *
 * @returns {Promise<{ latitude: number, longitude: number }>} 当前位置坐标
 */
export function getCurrentLocation() {
  return Promise.resolve({ latitude: 30.3322, longitude: 112.2384 });
}
