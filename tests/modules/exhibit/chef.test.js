import { describe, it, expect } from 'vitest';
import { createChef, toExhibitItem, EXAMPLE_CHEF } from '@/modules/exhibit/domain/chef.js';
import { validateChef } from '@/modules/exhibit/domain/validators.js';

describe('createChef', () => {
  it('使用全部字段创建名厨', () => {
    const chef = createChef({
      id: 201,
      name: '黄昌祥',
      photo: '/static/huang-changxiang.jpg',
      bio: '鄂菜泰斗，楚菜奠基人之一',
      signatureDishes: ['红烧鮰鱼', '粉蒸肉'],
    });

    expect(chef.id).toBe(201);
    expect(chef.name).toBe('黄昌祥');
    expect(chef.photo).toBe('/static/huang-changxiang.jpg');
    expect(chef.bio).toContain('鄂菜泰斗');
    expect(chef.signatureDishes).toHaveLength(2);
  });

  it('省略可选字段时使用默认值', () => {
    const chef = createChef({ name: '孙昌弼' });

    expect(chef.name).toBe('孙昌弼');
    expect(chef.photo).toBe('');
    expect(chef.bio).toBe('');
    expect(chef.signatureDishes).toEqual([]);
  });

  it('不传 id 时自动生成递增数字 ID', () => {
    const a = createChef({ name: '厨师A' });
    const b = createChef({ name: '厨师B' });

    expect(typeof a.id).toBe('number');
    expect(a.id).not.toBe(b.id);
  });

  it('EXAMPLE_CHEF 包含楚菜大师完整内容', () => {
    expect(EXAMPLE_CHEF.name).toBe('卢永良');
    expect(EXAMPLE_CHEF.bio.length).toBeGreaterThan(20);
    expect(EXAMPLE_CHEF.signatureDishes.length).toBeGreaterThanOrEqual(3);
  });
});

describe('toExhibitItem', () => {
  it('将名厨转换为展品列表项格式', () => {
    const item = toExhibitItem(EXAMPLE_CHEF);

    expect(item.id).toBe(EXAMPLE_CHEF.id);
    expect(item.name).toBe(EXAMPLE_CHEF.name);
    expect(item.type).toBe('chef');
    expect(item.image).toBe(EXAMPLE_CHEF.photo);
    expect(typeof item.summary).toBe('string');
    expect(item.summary.length).toBeLessThanOrEqual(80);
  });
});

describe('validateChef', () => {
  it('有效名厨验证通过', () => {
    const result = validateChef(EXAMPLE_CHEF);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('空姓名验证失败', () => {
    const result = validateChef(createChef({ name: '' }));
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('姓名'))).toBe(true);
  });

  it('缺少 name 字段验证失败', () => {
    const result = validateChef({});
    expect(result.valid).toBe(false);
  });

  it('null 对象验证失败', () => {
    const result = validateChef(null);
    expect(result.valid).toBe(false);
  });

  it('signatureDishes 为非数组时验证失败', () => {
    const result = validateChef({ name: '测试', signatureDishes: '清蒸武昌鱼' });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('代表菜品'))).toBe(true);
  });
});
