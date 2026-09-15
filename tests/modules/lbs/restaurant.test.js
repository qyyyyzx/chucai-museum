import { describe, it, expect } from 'vitest';
import { createRestaurant, EXAMPLE_RESTAURANT, VALID_TIME_SLOTS } from '@/modules/lbs/domain/restaurant.js';
import { validateRestaurant } from '@/modules/lbs/domain/validators.js';
import { getRestaurantsByTimeSlot } from '@/platform/mock/lbs.js';

describe('createRestaurant', () => {
  it('使用全部字段创建餐厅', () => {
    const r = createRestaurant({
      id: 99,
      name: '楚菜试验馆',
      address: '湖北省荆州市测试路1号',
      phone: '0716-99999999',
      coordinates: { latitude: 30.33, longitude: 112.24 },
      businessHours: { open: '11:00', close: '14:00', remark: '午市' },
      signatureDishes: ['武昌鱼', '藕汤', '沔阳三蒸'],
      timeSlot: 'wu',
    });

    expect(r.id).toBe(99);
    expect(r.name).toBe('楚菜试验馆');
    expect(r.address).toBe('湖北省荆州市测试路1号');
    expect(r.phone).toBe('0716-99999999');
    expect(r.coordinates.latitude).toBe(30.33);
    expect(r.coordinates.longitude).toBe(112.24);
    expect(r.businessHours.open).toBe('11:00');
    expect(r.businessHours.close).toBe('14:00');
    expect(r.businessHours.remark).toBe('午市');
    expect(r.signatureDishes).toHaveLength(3);
    expect(r.timeSlot).toBe('wu');
  });

  it('不传 id 时自动生成递增数字 ID', () => {
    const a = createRestaurant({ name: '餐厅A', address: '荆州路1', coordinates: { latitude: 30, longitude: 112 }, businessHours: { open: '09:00', close: '21:00' }, timeSlot: 'wu' });
    const b = createRestaurant({ name: '餐厅B', address: '荆州路2', coordinates: { latitude: 30, longitude: 112 }, businessHours: { open: '09:00', close: '21:00' }, timeSlot: 'wu' });

    expect(typeof a.id).toBe('number');
    expect(typeof b.id).toBe('number');
    expect(a.id).not.toBe(b.id);
  });

  it('省略可选字段时使用默认值', () => {
    const r = createRestaurant({
      name: '最小餐厅',
      address: '荆州测试路',
      coordinates: { latitude: 30.0, longitude: 112.0 },
      businessHours: { open: '09:00', close: '21:00' },
      timeSlot: 'chen',
    });

    expect(r.phone).toBe('');
    expect(r.signatureDishes).toEqual([]);
    expect(r.businessHours.remark).toBe('');
  });

  it('EXAMPLE_RESTAURANT 包含完整信息', () => {
    expect(EXAMPLE_RESTAURANT.name).toBe('楚味轩');
    expect(EXAMPLE_RESTAURANT.timeSlot).toBe('wu');
    expect(EXAMPLE_RESTAURANT.signatureDishes.length).toBeGreaterThanOrEqual(3);
    expect(typeof EXAMPLE_RESTAURANT.coordinates.latitude).toBe('number');
  });

  it('VALID_TIME_SLOTS 包含完整十二时辰', () => {
    expect(VALID_TIME_SLOTS).toHaveLength(12);
    expect(VALID_TIME_SLOTS[0]).toBe('zi');
    expect(VALID_TIME_SLOTS[11]).toBe('hai');
  });
});

describe('validateRestaurant', () => {
  it('有效餐厅验证通过', () => {
    const result = validateRestaurant(EXAMPLE_RESTAURANT);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('null 对象验证失败且不抛异常', () => {
    const result = validateRestaurant(null);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('不能为空');
  });

  it('空名称验证失败', () => {
    const result = validateRestaurant({
      name: '',
      address: '荆州路1号',
      coordinates: { latitude: 30.0, longitude: 112.0 },
      businessHours: { open: '09:00', close: '21:00' },
      timeSlot: 'wu',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('名称'))).toBe(true);
  });

  it('空地址验证失败', () => {
    const result = validateRestaurant({
      name: '测试餐厅',
      address: '',
      coordinates: { latitude: 30.0, longitude: 112.0 },
      businessHours: { open: '09:00', close: '21:00' },
      timeSlot: 'wu',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('地址'))).toBe(true);
  });

  it('无效时辰标识验证失败', () => {
    const result = validateRestaurant({
      name: '测试餐厅',
      address: '荆州路1号',
      coordinates: { latitude: 30.0, longitude: 112.0 },
      businessHours: { open: '09:00', close: '21:00' },
      timeSlot: 'invalid_slot',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('时辰'))).toBe(true);
  });

  it('缺少坐标验证失败', () => {
    const result = validateRestaurant({
      name: '测试餐厅',
      address: '荆州路1号',
      coordinates: null,
      businessHours: { open: '09:00', close: '21:00' },
      timeSlot: 'wu',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('坐标'))).toBe(true);
  });

  it('招牌菜品为非数组时验证失败', () => {
    const result = validateRestaurant({
      name: '测试餐厅',
      address: '荆州路1号',
      coordinates: { latitude: 30.0, longitude: 112.0 },
      businessHours: { open: '09:00', close: '21:00' },
      timeSlot: 'wu',
      signatureDishes: '不是数组',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('招牌菜品'))).toBe(true);
  });
});

describe('getRestaurantsByTimeSlot', () => {
  it('全量查询返回12家餐厅', () => {
    const result = getRestaurantsByTimeSlot();
    expect(result.total).toBe(12);
    expect(result.list).toHaveLength(12);
  });

  it('传入 null 时执行全量查询', () => {
    const result = getRestaurantsByTimeSlot(null);
    expect(result.total).toBe(12);
  });

  it('按时段筛选返回正确结果', () => {
    const result = getRestaurantsByTimeSlot('wu');
    expect(result.total).toBeGreaterThanOrEqual(1);
    expect(result.list.every((r) => r.timeSlot === 'wu')).toBe(true);
  });

  it('不存在的时段返回空结果', () => {
    const result = getRestaurantsByTimeSlot('not_exist');
    expect(result.total).toBe(0);
    expect(result.list).toHaveLength(0);
  });

  it('mock 数据覆盖全部12个时辰', () => {
    const { list } = getRestaurantsByTimeSlot();
    const slots = list.map((r) => r.timeSlot);
    for (const slot of VALID_TIME_SLOTS) {
      expect(slots).toContain(slot);
    }
  });

  it('每家餐厅至少有3道招牌菜品', () => {
    const { list } = getRestaurantsByTimeSlot();
    for (const r of list) {
      expect(r.signatureDishes.length).toBeGreaterThanOrEqual(3);
    }
  });
});
