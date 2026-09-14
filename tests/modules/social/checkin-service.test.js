import { describe, it, expect, beforeEach, vi } from 'vitest';

// mock 掉浏览器 API，防止 image-encode 在 Node 环境下报错；
// 服务层只在遇到 blob: 开头的 URL 时才真正调用 blobToDataURL
vi.mock('@/shared/utils/image-encode.js', () => ({
  blobToDataURL: vi.fn(async (url) => `data:image/png;base64,CONVERTED(${url})`),
}));

const { createCheckin, getCheckinRecords, deleteCheckinRecord } = await import(
  '@/modules/social/services/checkin-service.js'
);

/** 用内存对象模拟 localStorage */
function createMockStorage() {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
    _store: store,
  };
}

describe('checkin-service', () => {
  beforeEach(() => {
    globalThis.localStorage = createMockStorage();
  });

  it('创建打卡记录并保存到 localStorage', async () => {
    const record = await createCheckin({
      note: '荆沙甲鱼太入味了',
      images: ['data:image/jpeg;base64,AAAA'],
      location: '荆州 老南门',
    });

    expect(record.note).toBe('荆沙甲鱼太入味了');
    expect(record.images).toEqual(['data:image/jpeg;base64,AAAA']);

    const all = getCheckinRecords();
    expect(all).toHaveLength(1);
    expect(all[0].id).toBe(record.id);
  });

  it('blob URL 在保存前被转换为 base64 dataURL', async () => {
    const record = await createCheckin({
      note: '测试 blob 转换',
      images: ['blob:http://localhost:5173/xyz', 'data:image/png;base64,KEEP'],
    });

    expect(record.images[0]).toBe('data:image/png;base64,CONVERTED(blob:http://localhost:5173/xyz)');
    // 非 blob URL 原样保留
    expect(record.images[1]).toBe('data:image/png;base64,KEEP');

    const all = getCheckinRecords();
    expect(all[0].images[0].startsWith('data:')).toBe(true);
  });

  it('感想和照片同时为空时抛出错误', async () => {
    await expect(createCheckin({ note: '', images: [] })).rejects.toThrow('打卡记录不合法');
  });

  it('历史记录按创建时间倒序排列', async () => {
    await createCheckin({ note: '第一条', createdAt: '2026-05-20T08:00:00.000Z' });
    await createCheckin({ note: '第二条', createdAt: '2026-05-26T09:00:00.000Z' });
    await createCheckin({ note: '第三条', createdAt: '2026-05-23T12:00:00.000Z' });

    const all = getCheckinRecords();
    expect(all).toHaveLength(3);
    expect(all[0].note).toBe('第二条');
    expect(all[1].note).toBe('第三条');
    expect(all[2].note).toBe('第一条');
  });

  it('删除存在的记录返回 true，删除后列表更新', async () => {
    const record = await createCheckin({ note: '待删除' });

    expect(deleteCheckinRecord(record.id)).toBe(true);
    expect(getCheckinRecords()).toHaveLength(0);
  });

  it('删除不存在的记录返回 false', async () => {
    await createCheckin({ note: '保留' });

    expect(deleteCheckinRecord(99999)).toBe(false);
    expect(getCheckinRecords()).toHaveLength(1);
  });

  it('刷新（重新读取）后数据不丢失', async () => {
    const record = await createCheckin({ note: '持久化验证' });

    // 模拟刷新：直接从 storage 重新构造服务层读取
    const again = getCheckinRecords();
    expect(again).toHaveLength(1);
    expect(again[0].id).toBe(record.id);
    expect(again[0].note).toBe('持久化验证');
  });
});
