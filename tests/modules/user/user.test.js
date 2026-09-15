import { describe, it, expect } from 'vitest';
import { createUser, validateUser } from '@/modules/user/domain/user.js';

describe('createUser', () => {
  it('不传参时返回含默认值的用户对象', () => {
    const user = createUser({});

    expect(user.nickname).toBe('游客');
    expect(user.avatar).toBe('');
    expect(user.openid).toBe('');
    expect(typeof user.id).toBe('number');
    expect(typeof user.createdAt).toBe('string');
    expect(user.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  it('传入全部字段时正确赋值', () => {
    const user = createUser({
      id: 42,
      nickname: '楚菜达人',
      avatar: 'data:image/png;base64,AAAA',
      openid: 'wx_openid_abc',
      createdAt: '2026-06-01T08:00:00.000Z',
    });

    expect(user.id).toBe(42);
    expect(user.nickname).toBe('楚菜达人');
    expect(user.avatar).toBe('data:image/png;base64,AAAA');
    expect(user.openid).toBe('wx_openid_abc');
    expect(user.createdAt).toBe('2026-06-01T08:00:00.000Z');
  });

  it('不传 id 时自动生成数字类型的唯一 id', () => {
    const a = createUser({ nickname: '用户甲' });
    const b = createUser({ nickname: '用户乙' });

    expect(typeof a.id).toBe('number');
    expect(typeof b.id).toBe('number');
    expect(a.id).not.toBe(b.id);
  });

  it('nickname 为空白字符串时使用默认值"游客"', () => {
    const user = createUser({ nickname: '   ' });

    expect(user.nickname).toBe('游客');
  });

  it('nickname 有首尾空白时自动 trim', () => {
    const user = createUser({ nickname: '  楚菜爱好者  ' });

    expect(user.nickname).toBe('楚菜爱好者');
  });

  it('不传 createdAt 时自动取当前时间', () => {
    const before = new Date().toISOString();
    const user = createUser({});
    const after = new Date().toISOString();

    expect(user.createdAt >= before).toBe(true);
    expect(user.createdAt <= after).toBe(true);
  });

  it('data 为 null 时不抛异常，返回全默认值用户', () => {
    expect(() => createUser(null)).not.toThrow();
    const user = createUser(null);
    expect(user.nickname).toBe('游客');
  });
});

describe('validateUser', () => {
  it('合法用户对象返回 valid: true', () => {
    const user = createUser({
      nickname: '楚菜爱好者',
      openid: 'mock_openid_001',
    });

    const result = validateUser(user);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('null 传入时返回 valid: false 且不抛异常', () => {
    const result = validateUser(null);

    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('不能为空');
  });

  it('非对象传入时返回 valid: false', () => {
    const result = validateUser('字符串不是用户');

    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('不能为空');
  });

  it('缺少 id 时验证失败', () => {
    const result = validateUser({
      nickname: '楚菜爱好者',
      avatar: '',
      openid: '',
      createdAt: '2026-06-01T08:00:00.000Z',
    });

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('ID'))).toBe(true);
  });

  it('id 不是数字类型时验证失败', () => {
    const result = validateUser({
      id: 'not-a-number',
      nickname: '楚菜爱好者',
      avatar: '',
      openid: '',
      createdAt: '2026-06-01T08:00:00.000Z',
    });

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('ID') && e.includes('数字'))).toBe(true);
  });

  it('nickname 为空字符串时验证失败', () => {
    const result = validateUser({
      id: 1,
      nickname: '',
      avatar: '',
      openid: '',
      createdAt: '2026-06-01T08:00:00.000Z',
    });

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('昵称'))).toBe(true);
  });

  it('avatar 不是字符串时验证失败', () => {
    const result = validateUser({
      id: 1,
      nickname: '楚菜爱好者',
      avatar: 12345,
      openid: '',
      createdAt: '2026-06-01T08:00:00.000Z',
    });

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('头像'))).toBe(true);
  });

  it('openid 不是字符串时验证失败', () => {
    const result = validateUser({
      id: 1,
      nickname: '楚菜爱好者',
      avatar: '',
      openid: null,
      createdAt: '2026-06-01T08:00:00.000Z',
    });

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('openid'))).toBe(true);
  });

  it('createdAt 不是 ISO 8601 格式时验证失败', () => {
    const result = validateUser({
      id: 1,
      nickname: '楚菜爱好者',
      avatar: '',
      openid: '',
      createdAt: '昨天下午',
    });

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('ISO 8601'))).toBe(true);
  });

  it('avatar 允许为空字符串时验证通过', () => {
    const user = createUser({ nickname: '楚菜爱好者', avatar: '' });
    const result = validateUser(user);

    expect(result.valid).toBe(true);
  });

  it('openid 允许为空字符串时验证通过', () => {
    const user = createUser({ nickname: '楚菜爱好者', openid: '' });
    const result = validateUser(user);

    expect(result.valid).toBe(true);
  });
});
