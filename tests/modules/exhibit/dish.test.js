import { describe, it, expect } from 'vitest';
import { createDish, toExhibitItem, EXAMPLE_DISH } from '@/modules/exhibit/domain/dish.js';
import { validateDish } from '@/modules/exhibit/domain/validators.js';

describe('createDish', () => {
  it('使用全部字段创建菜品', () => {
    const dish = createDish({
      id: 1,
      name: '沔阳三蒸',
      image: '/static/mianyang-sanzheng.jpg',
      history: '源自湖北仙桃（原沔阳县），始于元代',
      method: '将鱼、肉、菜分别调味后蒸制',
      ingredients: ['鱼', '五花肉', '青菜', '米粉'],
    });

    expect(dish.id).toBe(1);
    expect(dish.name).toBe('沔阳三蒸');
    expect(dish.image).toBe('/static/mianyang-sanzheng.jpg');
    expect(dish.history).toContain('元代');
    expect(dish.method).toContain('蒸制');
    expect(dish.ingredients).toHaveLength(4);
  });

  it('省略可选字段时使用默认值', () => {
    const dish = createDish({ name: '排骨藕汤' });

    expect(dish.name).toBe('排骨藕汤');
    expect(dish.image).toBe('');
    expect(dish.history).toBe('');
    expect(dish.method).toBe('');
    expect(dish.ingredients).toEqual([]);
  });

  it('不传 id 时自动生成递增数字 ID', () => {
    const a = createDish({ name: '菜A' });
    const b = createDish({ name: '菜B' });

    expect(typeof a.id).toBe('number');
    expect(typeof b.id).toBe('number');
    expect(a.id).not.toBe(b.id);
  });

  it('EXAMPLE_DISH 包含完整楚菜内容', () => {
    expect(EXAMPLE_DISH.name).toBe('清蒸武昌鱼');
    expect(EXAMPLE_DISH.history.length).toBeGreaterThan(20);
    expect(EXAMPLE_DISH.method.length).toBeGreaterThan(10);
    expect(EXAMPLE_DISH.ingredients.length).toBeGreaterThanOrEqual(3);
  });
});

describe('toExhibitItem', () => {
  it('将菜品转换为展品列表项格式', () => {
    const item = toExhibitItem(EXAMPLE_DISH);

    expect(item.id).toBe(EXAMPLE_DISH.id);
    expect(item.name).toBe(EXAMPLE_DISH.name);
    expect(item.type).toBe('dish');
    expect(item.image).toBe(EXAMPLE_DISH.image);
    expect(typeof item.summary).toBe('string');
    expect(item.summary.length).toBeLessThanOrEqual(80);
  });
});

describe('validateDish', () => {
  it('有效菜品验证通过', () => {
    const result = validateDish(EXAMPLE_DISH);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('空名称验证失败', () => {
    const result = validateDish(createDish({ name: '' }));
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('名称'))).toBe(true);
  });

  it('纯空白名称验证失败', () => {
    const result = validateDish(createDish({ name: '   ' }));
    expect(result.valid).toBe(false);
  });

  it('缺少 name 字段验证失败', () => {
    const result = validateDish({});
    expect(result.valid).toBe(false);
  });

  it('null 对象验证失败且不抛异常', () => {
    const result = validateDish(null);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('不能为空');
  });

  it('ingredients 为非数组时验证失败', () => {
    const result = validateDish({ name: '测试菜', ingredients: '不是数组' });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('食材'))).toBe(true);
  });

  it('id 类型不为数字时验证失败', () => {
    const result = validateDish({ name: '测试', id: 'abc' });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('ID'))).toBe(true);
  });
});
