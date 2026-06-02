import { describe, it, expect } from 'vitest';
import {
  createHistoricalPeriod,
  EXAMPLE_PERIOD,
} from '@/modules/exhibit/domain/historical-period.js';
import { validateHistoricalPeriod } from '@/modules/exhibit/domain/validators.js';

describe('createHistoricalPeriod', () => {
  it('使用全部字段创建历史时期', () => {
    const period = createHistoricalPeriod({
      id: 1,
      dynasty: '明清',
      characteristics: '楚菜体系成熟，汉口成为"九省通衢"，南北风味交融',
      representativeDishes: ['沔阳三蒸', '黄陂三合', '红烧鮰鱼'],
    });

    expect(period.id).toBe(1);
    expect(period.dynasty).toBe('明清');
    expect(period.characteristics).toContain('九省通衢');
    expect(period.representativeDishes).toHaveLength(3);
  });

  it('省略可选字段时使用默认值', () => {
    const period = createHistoricalPeriod({ dynasty: '宋代' });

    expect(period.dynasty).toBe('宋代');
    expect(period.characteristics).toBe('');
    expect(period.representativeDishes).toEqual([]);
  });

  it('不传 id 时自动生成递增数字 ID', () => {
    const a = createHistoricalPeriod({ dynasty: '汉代' });
    const b = createHistoricalPeriod({ dynasty: '唐代' });

    expect(typeof a.id).toBe('number');
    expect(a.id).not.toBe(b.id);
  });

  it('EXAMPLE_PERIOD 包含春秋战国楚菜内容', () => {
    expect(EXAMPLE_PERIOD.dynasty).toBe('春秋战国');
    expect(EXAMPLE_PERIOD.characteristics.length).toBeGreaterThan(20);
    expect(EXAMPLE_PERIOD.representativeDishes.length).toBeGreaterThanOrEqual(3);
  });
});

describe('validateHistoricalPeriod', () => {
  it('有效时期验证通过', () => {
    const result = validateHistoricalPeriod(EXAMPLE_PERIOD);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('空朝代验证失败', () => {
    const result = validateHistoricalPeriod(createHistoricalPeriod({ dynasty: '' }));
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('朝代'))).toBe(true);
  });

  it('纯空白朝代验证失败', () => {
    const result = validateHistoricalPeriod(createHistoricalPeriod({ dynasty: '  ' }));
    expect(result.valid).toBe(false);
  });

  it('缺少 dynasty 字段验证失败', () => {
    const result = validateHistoricalPeriod({});
    expect(result.valid).toBe(false);
  });

  it('null 对象验证失败', () => {
    const result = validateHistoricalPeriod(null);
    expect(result.valid).toBe(false);
  });

  it('representativeDishes 为非数组时验证失败', () => {
    const result = validateHistoricalPeriod({
      dynasty: '唐代',
      representativeDishes: '不是数组',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('代表菜品'))).toBe(true);
  });
});
