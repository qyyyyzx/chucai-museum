import { describe, it, expect } from 'vitest';
import { getCurrentTimeSlot, getTimeSlotInfo, TIME_SLOT_LIST } from '../../../src/modules/lbs/domain/time-slots.js';

// 辅助函数：构造指定小时的 Date 对象
function makeDate(hour, minute = 0) {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d;
}

describe('TIME_SLOT_LIST', () => {
  it('应包含 12 个时辰', () => {
    expect(TIME_SLOT_LIST).toHaveLength(12);
  });

  it('每个时辰都有 slot / name / alias / period / startHour 字段', () => {
    for (const item of TIME_SLOT_LIST) {
      expect(item).toHaveProperty('slot');
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('alias');
      expect(item).toHaveProperty('period');
      expect(item).toHaveProperty('startHour');
    }
  });

  it('slot 值不重复', () => {
    const slots = TIME_SLOT_LIST.map((item) => item.slot);
    expect(new Set(slots).size).toBe(12);
  });
});

describe('getCurrentTimeSlot', () => {
  it('23:00 应返回 zi（子时）', () => {
    expect(getCurrentTimeSlot(makeDate(23, 0))).toBe('zi');
  });

  it('23:59 应返回 zi（子时）', () => {
    expect(getCurrentTimeSlot(makeDate(23, 59))).toBe('zi');
  });

  it('00:00 应返回 zi（子时）', () => {
    expect(getCurrentTimeSlot(makeDate(0, 0))).toBe('zi');
  });

  it('00:59 应返回 zi（子时）', () => {
    expect(getCurrentTimeSlot(makeDate(0, 59))).toBe('zi');
  });

  it('01:00 应返回 chou（丑时）', () => {
    expect(getCurrentTimeSlot(makeDate(1, 0))).toBe('chou');
  });

  it('02:59 应返回 chou（丑时）', () => {
    expect(getCurrentTimeSlot(makeDate(2, 59))).toBe('chou');
  });

  it('07:00 应返回 chen（辰时）', () => {
    expect(getCurrentTimeSlot(makeDate(7, 0))).toBe('chen');
  });

  it('08:59 应返回 chen（辰时）', () => {
    expect(getCurrentTimeSlot(makeDate(8, 59))).toBe('chen');
  });

  it('11:00 应返回 wu（午时）', () => {
    expect(getCurrentTimeSlot(makeDate(11, 0))).toBe('wu');
  });

  it('12:30 应返回 wu（午时）', () => {
    expect(getCurrentTimeSlot(makeDate(12, 30))).toBe('wu');
  });

  it('17:00 应返回 you（酉时）', () => {
    expect(getCurrentTimeSlot(makeDate(17, 0))).toBe('you');
  });

  it('21:00 应返回 hai（亥时）', () => {
    expect(getCurrentTimeSlot(makeDate(21, 0))).toBe('hai');
  });

  it('22:59 应返回 hai（亥时）', () => {
    expect(getCurrentTimeSlot(makeDate(22, 59))).toBe('hai');
  });

  it('不传参数时不应抛出异常', () => {
    expect(() => getCurrentTimeSlot()).not.toThrow();
  });

  it('不传参数时返回值应在合法 slot 列表内', () => {
    const validSlots = TIME_SLOT_LIST.map((item) => item.slot);
    expect(validSlots).toContain(getCurrentTimeSlot());
  });
});

describe('getTimeSlotInfo', () => {
  it('传入 wu 应返回午时信息', () => {
    const info = getTimeSlotInfo('wu');
    expect(info).toBeDefined();
    expect(info.name).toBe('午时');
    expect(info.alias).toBe('日中');
    expect(info.period).toBe('11:00-13:00');
  });

  it('传入 zi 应返回子时信息', () => {
    const info = getTimeSlotInfo('zi');
    expect(info).toBeDefined();
    expect(info.name).toBe('子时');
    expect(info.startHour).toBe(23);
  });

  it('传入不存在的 slot 应返回 undefined', () => {
    expect(getTimeSlotInfo('invalid')).toBeUndefined();
  });

  it('传入空字符串应返回 undefined', () => {
    expect(getTimeSlotInfo('')).toBeUndefined();
  });
});
