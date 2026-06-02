import { describe, it, expect } from 'vitest';
import { createExhibitItem } from '@/modules/exhibit/domain/exhibit-item.js';
import { createDish, toExhibitItem as dishToItem } from '@/modules/exhibit/domain/dish.js';
import { createChef, toExhibitItem as chefToItem } from '@/modules/exhibit/domain/chef.js';

describe('createExhibitItem', () => {
  it('创建菜品类型展品项', () => {
    const item = createExhibitItem({
      id: 1,
      name: '武昌鱼',
      summary: '楚菜经典名菜',
      image: '/static/wuchangyu.jpg',
      type: 'dish',
    });

    expect(item.id).toBe(1);
    expect(item.name).toBe('武昌鱼');
    expect(item.summary).toBe('楚菜经典名菜');
    expect(item.image).toBe('/static/wuchangyu.jpg');
    expect(item.type).toBe('dish');
  });

  it('创建名厨类型展品项', () => {
    const item = createExhibitItem({
      id: 101,
      name: '卢永良',
      summary: '中国烹饪大师',
      image: '/static/chef-lu.jpg',
      type: 'chef',
    });

    expect(item.type).toBe('chef');
  });

  it('type 默认值为 dish', () => {
    const item = createExhibitItem({ id: 1, name: '测试', summary: '', image: '' });
    expect(item.type).toBe('dish');
  });
});

describe('Dish/Chef 到 ExhibitItem 转换', () => {
  it('菜品 toExhibitItem 生成正确的 type', () => {
    const dish = createDish({ name: '沔阳三蒸', history: '湖北传统蒸菜' });
    const item = dishToItem(dish);

    expect(item.type).toBe('dish');
    expect(item.summary).toBe('湖北传统蒸菜');
  });

  it('名厨 toExhibitItem 生成正确的 type', () => {
    const chef = createChef({ name: '孙昌弼', bio: '鄂菜泰斗' });
    const item = chefToItem(chef);

    expect(item.type).toBe('chef');
    expect(item.summary).toBe('鄂菜泰斗');
  });

  it('转换后 ID 和名称保持一致', () => {
    const dish = createDish({ id: 42, name: '测试菜' });
    const item = dishToItem(dish);

    expect(item.id).toBe(42);
    expect(item.name).toBe('测试菜');
  });
});
