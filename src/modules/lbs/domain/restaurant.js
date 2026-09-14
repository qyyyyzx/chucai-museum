/**
 * @file 餐厅数据模型
 * @module lbs/domain/restaurant
 */

/**
 * @typedef {Object} Coordinates
 * @property {number} latitude  - 纬度
 * @property {number} longitude - 经度
 */

/**
 * @typedef {Object} BusinessHours
 * @property {string} open     - 开业时间，格式 "HH:MM"
 * @property {string} close    - 打烊时间，格式 "HH:MM"
 * @property {string} [remark] - 备注（如"午休 13:00-14:00"）
 */

/**
 * @typedef {Object} Restaurant
 * @property {number}       id              - 餐厅唯一标识
 * @property {string}       name            - 餐厅名称（必填）
 * @property {string}       address         - 餐厅地址（必填）
 * @property {string}       [phone]         - 联系电话
 * @property {Coordinates}  coordinates     - 经纬度坐标（必填）
 * @property {BusinessHours} businessHours  - 营业时间（必填）
 * @property {string[]}     signatureDishes - 招牌菜品数组，存储菜品名称
 * @property {string}       timeSlot        - 对应荆州十二时辰的时段标识（必填）
 *                                            取值：zi/chou/yin/mao/chen/si/wu/wei/shen/you/xu/hai
 */

/**
 * 荆州十二时辰合法时段标识列表，顺序与时辰顺序一致
 */
export const VALID_TIME_SLOTS = [
  'zi',   // 子时 23:00-01:00
  'chou', // 丑时 01:00-03:00
  'yin',  // 寅时 03:00-05:00
  'mao',  // 卯时 05:00-07:00
  'chen', // 辰时 07:00-09:00
  'si',   // 巳时 09:00-11:00
  'wu',   // 午时 11:00-13:00
  'wei',  // 未时 13:00-15:00
  'shen', // 申时 15:00-17:00
  'you',  // 酉时 17:00-19:00
  'xu',   // 戌时 19:00-21:00
  'hai',  // 亥时 21:00-23:00
];

let _nextId = 1;

/**
 * 创建一个新的餐厅对象
 * @param {Object}        data                   - 餐厅数据
 * @param {string}        data.name              - 餐厅名称（必填）
 * @param {string}        data.address           - 餐厅地址（必填）
 * @param {string}        [data.phone]           - 联系电话
 * @param {Coordinates}   data.coordinates       - 经纬度坐标（必填）
 * @param {BusinessHours} data.businessHours     - 营业时间（必填）
 * @param {string[]}      [data.signatureDishes] - 招牌菜品数组
 * @param {string}        data.timeSlot          - 时辰时段标识（必填）
 * @returns {Restaurant} 餐厅对象
 */
export function createRestaurant(data) {
  return {
    id: data.id != null ? data.id : _nextId++,
    name: data.name || '',
    address: data.address || '',
    phone: data.phone || '',
    coordinates: data.coordinates
      ? { latitude: data.coordinates.latitude, longitude: data.coordinates.longitude }
      : { latitude: 0, longitude: 0 },
    businessHours: data.businessHours
      ? {
          open: data.businessHours.open || '',
          close: data.businessHours.close || '',
          remark: data.businessHours.remark || '',
        }
      : { open: '', close: '', remark: '' },
    signatureDishes: Array.isArray(data.signatureDishes) ? [...data.signatureDishes] : [],
    timeSlot: data.timeSlot || '',
  };
}

/**
 * 餐厅示例数据 - 楚味轩（午时）
 */
export const EXAMPLE_RESTAURANT = createRestaurant({
  id: 101,
  name: '楚味轩',
  address: '湖北省荆州市沙市区解放路88号',
  phone: '0716-12345678',
  coordinates: { latitude: 30.3308, longitude: 112.2404 },
  businessHours: { open: '11:00', close: '14:00', remark: '午市营业' },
  signatureDishes: ['清蒸武昌鱼', '排骨藕汤', '沔阳三蒸'],
  timeSlot: 'wu',
});
