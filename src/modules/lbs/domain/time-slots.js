/**
 * @file 荆州十二时辰数据与工具函数
 * @module lbs/domain/time-slots
 *
 * 纯数据与纯函数，无任何副作用，可安全在 domain 层使用。
 */

/**
 * @typedef {Object} TimeSlotInfo
 * @property {string} slot   - 时辰标识，与 VALID_TIME_SLOTS 对应
 * @property {string} name   - 时辰名称，如"子时"
 * @property {string} alias  - 时辰别名，如"夜半"
 * @property {string} period - 时段范围，如"23:00-01:00"
 * @property {number} startHour - 起始小时（24 小时制，用于时间匹配）
 */

/**
 * 十二时辰完整信息列表，顺序与 VALID_TIME_SLOTS 一致
 * @type {TimeSlotInfo[]}
 */
export const TIME_SLOT_LIST = [
  { slot: 'zi',   name: '子时', alias: '夜半', period: '23:00-01:00', startHour: 23 },
  { slot: 'chou', name: '丑时', alias: '鸡鸣', period: '01:00-03:00', startHour: 1  },
  { slot: 'yin',  name: '寅时', alias: '平旦', period: '03:00-05:00', startHour: 3  },
  { slot: 'mao',  name: '卯时', alias: '日出', period: '05:00-07:00', startHour: 5  },
  { slot: 'chen', name: '辰时', alias: '食时', period: '07:00-09:00', startHour: 7  },
  { slot: 'si',   name: '巳时', alias: '隅中', period: '09:00-11:00', startHour: 9  },
  { slot: 'wu',   name: '午时', alias: '日中', period: '11:00-13:00', startHour: 11 },
  { slot: 'wei',  name: '未时', alias: '日昳', period: '13:00-15:00', startHour: 13 },
  { slot: 'shen', name: '申时', alias: '晡时', period: '15:00-17:00', startHour: 15 },
  { slot: 'you',  name: '酉时', alias: '日入', period: '17:00-19:00', startHour: 17 },
  { slot: 'xu',   name: '戌时', alias: '黄昏', period: '19:00-21:00', startHour: 19 },
  { slot: 'hai',  name: '亥时', alias: '人定', period: '21:00-23:00', startHour: 21 },
];

/**
 * 根据当前时间返回对应的时辰标识
 *
 * 时辰映射规则（每个时辰跨 2 小时）：
 * - 子时：23:00-00:59
 * - 丑时：01:00-02:59
 * - 寅时：03:00-04:59
 * - 卯时：05:00-06:59
 * - 辰时：07:00-08:59
 * - 巳时：09:00-10:59
 * - 午时：11:00-12:59
 * - 未时：13:00-14:59
 * - 申时：15:00-16:59
 * - 酉时：17:00-18:59
 * - 戌时：19:00-20:59
 * - 亥时：21:00-22:59
 *
 * @param {Date} [date] - 时间对象，不传则使用当前时间
 * @returns {string} 时辰标识，如 'wu'
 */
export function getCurrentTimeSlot(date) {
  const d = date instanceof Date ? date : new Date();
  const hour = d.getHours();

  // 子时特殊处理：23:00-00:59（跨午夜）
  if (hour === 23) {
    return 'zi';
  }

  // 其余时辰：每 2 小时一个时辰，从 01:00 开始
  // hour 0（即 00:00-00:59）也属于子时
  if (hour === 0) {
    return 'zi';
  }

  // 找到 startHour <= hour < startHour + 2 的时辰
  // TIME_SLOT_LIST 中 zi 的 startHour 是 23，已在上方处理，跳过
  for (let i = 1; i < TIME_SLOT_LIST.length; i++) {
    const info = TIME_SLOT_LIST[i];
    if (hour >= info.startHour && hour < info.startHour + 2) {
      return info.slot;
    }
  }

  // 兜底：返回子时（理论上不会走到这里）
  return 'zi';
}

/**
 * 根据时辰标识查找对应的时辰信息
 * @param {string} slot - 时辰标识
 * @returns {TimeSlotInfo|undefined} 时辰信息，找不到返回 undefined
 */
export function getTimeSlotInfo(slot) {
  return TIME_SLOT_LIST.find((item) => item.slot === slot);
}
