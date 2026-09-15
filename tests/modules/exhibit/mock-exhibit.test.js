import { describe, it, expect } from 'vitest';
import { getExhibitList, getExhibitDetail } from '@/platform/mock/exhibit.js';

describe('getExhibitList', () => {
  it('不传参数时应返回全部数据', async () => {
    const result = await getExhibitList();
    expect(result.list.length).toBe(10);
    expect(result.total).toBe(15);
    expect(result.hasMore).toBe(true);
  });

  it('type 为 dish 时应只返回菜品', async () => {
    const result = await getExhibitList({ type: 'dish' });
    expect(result.total).toBe(10);
    result.list.forEach((item) => {
      expect(item.type).toBe('dish');
    });
  });

  it('type 为 chef 时应只返回名厨', async () => {
    const result = await getExhibitList({ type: 'chef' });
    expect(result.total).toBe(5);
    result.list.forEach((item) => {
      expect(item.type).toBe('chef');
    });
  });

  it('分页第一页应返回指定条数且 hasMore 为 true', async () => {
    const result = await getExhibitList({ page: 1, pageSize: 5 });
    expect(result.list.length).toBe(5);
    expect(result.hasMore).toBe(true);
  });

  it('分页最后一页应返回剩余条数且 hasMore 为 false', async () => {
    const result = await getExhibitList({ page: 3, pageSize: 5 });
    expect(result.list.length).toBe(5);
    expect(result.hasMore).toBe(false);
  });

  it('超出范围的页码应返回空列表', async () => {
    const result = await getExhibitList({ page: 99, pageSize: 10 });
    expect(result.list.length).toBe(0);
    expect(result.hasMore).toBe(false);
  });

  it('菜品数据应包含必填字段', async () => {
    const result = await getExhibitList({ type: 'dish' });
    const first = result.list[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('name');
    expect(first).toHaveProperty('image');
    expect(first).toHaveProperty('history');
    expect(first).toHaveProperty('type');
  });

  it('名厨数据应包含必填字段', async () => {
    const result = await getExhibitList({ type: 'chef' });
    const first = result.list[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('name');
    expect(first).toHaveProperty('photo');
    expect(first).toHaveProperty('bio');
    expect(first).toHaveProperty('type');
  });
});

describe('getExhibitDetail', () => {
  it('传入存在的菜品 ID 应返回对应对象', async () => {
    const dish = await getExhibitDetail(1);
    expect(dish).not.toBeNull();
    expect(dish.id).toBe(1);
    expect(dish.type).toBe('dish');
    expect(dish).toHaveProperty('name');
  });

  it('传入存在的名厨 ID 应返回对应对象', async () => {
    const chef = await getExhibitDetail(101);
    expect(chef).not.toBeNull();
    expect(chef.id).toBe(101);
    expect(chef.type).toBe('chef');
    expect(chef).toHaveProperty('name');
  });

  it('传入不存在的 ID 应返回 null', async () => {
    const result = await getExhibitDetail(9999);
    expect(result).toBeNull();
  });

  it('传入 null 或 undefined 应返回 null', async () => {
    expect(await getExhibitDetail(null)).toBeNull();
    expect(await getExhibitDetail(undefined)).toBeNull();
  });
});
