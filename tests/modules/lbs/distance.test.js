import { describe, it, expect } from 'vitest';
import {
  calcDistanceKm,
  formatDistance,
  sortRestaurantsByDistance,
} from '../../../src/modules/lbs/domain/distance.js';

describe('calcDistanceKm', () => {
  it('同一点距离为 0', () => {
    const dist = calcDistanceKm(30.3322, 112.2384, 30.3322, 112.2384);
    expect(dist).toBe(0);
  });

  it('荆州市中心到江津路，结果在合理范围内（1~5 km）', () => {
    // 荆州市中心 -> 沙市区江津路168号
    const dist = calcDistanceKm(30.3322, 112.2384, 30.3156, 112.2301);
    expect(dist).toBeGreaterThan(1);
    expect(dist).toBeLessThan(5);
  });

  it('北京到武汉约 1050~1100 km', () => {
    const dist = calcDistanceKm(39.9042, 116.4074, 30.5928, 114.3055);
    expect(dist).toBeGreaterThan(1000);
    expect(dist).toBeLessThan(1200);
  });

  it('返回值为数字且保留两位小数精度', () => {
    const dist = calcDistanceKm(30.3322, 112.2384, 30.3502, 112.1887);
    expect(typeof dist).toBe('number');
    // 保留两位小数：乘以 100 后应为整数
    expect(dist * 100).toBe(Math.round(dist * 100));
  });

  it('赤道上经度相差 1 度约 111 km', () => {
    const dist = calcDistanceKm(0, 0, 0, 1);
    expect(dist).toBeGreaterThan(110);
    expect(dist).toBeLessThan(113);
  });

  it('极端坐标不报错（南北极点）', () => {
    expect(() => calcDistanceKm(90, 0, -90, 0)).not.toThrow();
  });
});

describe('formatDistance', () => {
  it('0 km 显示为 0 m', () => {
    expect(formatDistance(0)).toBe('0 m');
  });

  it('小于 1 km 显示为米', () => {
    expect(formatDistance(0.5)).toBe('500 m');
  });

  it('小于 1 km 的小数米数四舍五入', () => {
    expect(formatDistance(0.8506)).toBe('851 m');
  });

  it('恰好 1 km 显示为千米', () => {
    expect(formatDistance(1)).toBe('1.00 km');
  });

  it('大于 1 km 显示千米，保留两位小数', () => {
    expect(formatDistance(2.5)).toBe('2.50 km');
    expect(formatDistance(12.34)).toBe('12.34 km');
  });
});

describe('sortRestaurantsByDistance', () => {
  const userLat = 30.3322;
  const userLon = 112.2384;

  const mockRestaurants = [
    {
      id: 1,
      name: '远处餐厅',
      coordinates: { latitude: 30.3601, longitude: 112.1994 },
    },
    {
      id: 2,
      name: '近处餐厅',
      coordinates: { latitude: 30.3308, longitude: 112.2404 },
    },
    {
      id: 3,
      name: '中距餐厅',
      coordinates: { latitude: 30.3478, longitude: 112.1823 },
    },
  ];

  it('按距离升序排列', () => {
    const sorted = sortRestaurantsByDistance(mockRestaurants, userLat, userLon);
    expect(sorted[0].id).toBe(2); // 最近
    expect(sorted[2].id).toBe(3); // 最远
  });

  it('结果包含 distanceKm 字段且为数字', () => {
    const sorted = sortRestaurantsByDistance(mockRestaurants, userLat, userLon);
    sorted.forEach((r) => {
      expect(typeof r.distanceKm).toBe('number');
    });
  });

  it('结果包含 distanceText 字段且为非空字符串', () => {
    const sorted = sortRestaurantsByDistance(mockRestaurants, userLat, userLon);
    sorted.forEach((r) => {
      expect(typeof r.distanceText).toBe('string');
      expect(r.distanceText.length).toBeGreaterThan(0);
    });
  });

  it('不修改原始列表顺序', () => {
    const originalIds = mockRestaurants.map((r) => r.id);
    sortRestaurantsByDistance(mockRestaurants, userLat, userLon);
    expect(mockRestaurants.map((r) => r.id)).toEqual(originalIds);
  });

  it('空列表返回空数组', () => {
    const result = sortRestaurantsByDistance([], userLat, userLon);
    expect(result).toEqual([]);
  });

  it('保留原始餐厅的其他字段', () => {
    const sorted = sortRestaurantsByDistance(mockRestaurants, userLat, userLon);
    const near = sorted.find((r) => r.id === 2);
    expect(near.name).toBe('近处餐厅');
  });

  it('用户坐标与某餐厅完全重合时距离为 0', () => {
    const atUserLocation = [
      {
        id: 99,
        name: '原地餐厅',
        coordinates: { latitude: userLat, longitude: userLon },
      },
    ];
    const sorted = sortRestaurantsByDistance(atUserLocation, userLat, userLon);
    expect(sorted[0].distanceKm).toBe(0);
    expect(sorted[0].distanceText).toBe('0 m');
  });
});
