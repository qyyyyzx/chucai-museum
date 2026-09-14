import { describe, it, expect, beforeEach } from 'vitest';
import {
  createCheckinRecord,
  validateCheckinRecord,
  buildShareText,
} from '@/modules/social/domain/checkin-record.js';

describe('createCheckinRecord', () => {
  it('使用全部字段创建打卡记录', () => {
    const record = createCheckinRecord({
      id: 1,
      note: '第一次见到活水养的武昌鱼',
      images: ['data:image/png;base64,AAAA'],
      location: '楚菜文化数字博物馆 展陈大厅',
      createdAt: '2026-05-26T10:30:00.000Z',
    });

    expect(record.id).toBe(1);
    expect(record.note).toBe('第一次见到活水养的武昌鱼');
    expect(record.images).toEqual(['data:image/png;base64,AAAA']);
    expect(record.location).toBe('楚菜文化数字博物馆 展陈大厅');
    expect(record.createdAt).toBe('2026-05-26T10:30:00.000Z');
  });

  it('省略可选字段时使用默认值', () => {
    const record = createCheckinRecord({});

    expect(record.note).toBe('');
    expect(record.images).toEqual([]);
    expect(record.location).toBe('');
    expect(typeof record.createdAt).toBe('string');
    expect(record.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('note 和 location 自动去除首尾空白', () => {
    const record = createCheckinRecord({ note: '  好吃  ', location: '  荆州  ' });

    expect(record.note).toBe('好吃');
    expect(record.location).toBe('荆州');
  });

  it('不传 id 时自动生成递增数字 ID', () => {
    const a = createCheckinRecord({ note: '记录A' });
    const b = createCheckinRecord({ note: '记录B' });

    expect(typeof a.id).toBe('number');
    expect(typeof b.id).toBe('number');
    expect(a.id).not.toBe(b.id);
  });

  it('images 数组是拷贝而非引用', () => {
    const images = ['data:image/png;base64,AAAA'];
    const record = createCheckinRecord({ note: 'x', images });

    images.push('data:image/png;base64,BBBB');
    expect(record.images).toHaveLength(1);
  });
});

describe('validateCheckinRecord', () => {
  it('有效记录（有照片有感想）验证通过', () => {
    const record = createCheckinRecord({
      note: '排骨藕汤真好喝',
      images: ['data:image/jpeg;base64,AAAA'],
    });

    const result = validateCheckinRecord(record);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('纯文字打卡（无照片）验证通过', () => {
    const record = createCheckinRecord({ note: '只写感想不拍照' });

    const result = validateCheckinRecord(record);
    expect(result.valid).toBe(true);
  });

  it('感想和照片同时为空时验证失败', () => {
    const record = createCheckinRecord({});

    const result = validateCheckinRecord(record);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('同时为空'))).toBe(true);
  });

  it('blob URL 照片验证失败并提示转换', () => {
    const record = createCheckinRecord({
      note: '测试',
      images: ['blob:http://localhost:5173/abc123'],
    });

    const result = validateCheckinRecord(record);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('blobToDataURL'))).toBe(true);
  });

  it('images 非字符串项验证失败', () => {
    const result = validateCheckinRecord({ note: '测试', images: [123] });

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('第 1 张照片'))).toBe(true);
  });

  it('null 对象验证失败且不抛异常', () => {
    const result = validateCheckinRecord(null);

    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('不能为空');
  });

  it('id 类型不为数字时验证失败', () => {
    const result = validateCheckinRecord({ note: '测试', id: 'abc' });

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('ID'))).toBe(true);
  });

  it('createdAt 不是 ISO 字符串时验证失败', () => {
    const result = validateCheckinRecord({ note: '测试', createdAt: '昨天下午' });

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('ISO 8601'))).toBe(true);
  });
});

describe('buildShareText', () => {
  it('地点和感想齐全时组装完整分享文案', () => {
    const record = createCheckinRecord({
      note: '武昌鱼太鲜了',
      location: '展陈大厅',
    });

    expect(buildShareText(record)).toBe('我在楚菜文化数字博物馆打卡啦 @展陈大厅 「武昌鱼太鲜了」');
  });

  it('只有感想时只追加感想', () => {
    const record = createCheckinRecord({ note: '第一次见活水养武昌鱼' });

    expect(buildShareText(record)).toBe('我在楚菜文化数字博物馆打卡啦 「第一次见活水养武昌鱼」');
  });

  it('只有地点时只追加地点', () => {
    const record = createCheckinRecord({ location: '楚菜文化数字博物馆' });

    expect(buildShareText(record)).toBe('我在楚菜文化数字博物馆打卡啦 @楚菜文化数字博物馆');
  });

  it('记录为空或字段为空白时只返回固定开头', () => {
    expect(buildShareText(null)).toBe('我在楚菜文化数字博物馆打卡啦');
    expect(buildShareText({ note: '   ', location: '  ' })).toBe('我在楚菜文化数字博物馆打卡啦');
    expect(buildShareText({})).toBe('我在楚菜文化数字博物馆打卡啦');
  });

  it('字段类型错误时不会抛异常', () => {
    expect(() => buildShareText({ note: 123, location: undefined })).not.toThrow();
    expect(buildShareText({ note: 123, location: undefined })).toBe(
      '我在楚菜文化数字博物馆打卡啦'
    );
  });
});
