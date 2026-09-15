import { describe, it, expect, beforeEach, vi } from 'vitest';

// mock platform/api.js，隔离 service 层与平台实现
vi.mock('@/platform/api.js', () => {
  const mockUser = {
    id: 1700000000000,
    nickname: '楚菜爱好者',
    avatar: '',
    openid: 'mock_openid_001',
    createdAt: '2026-06-01T08:00:00.000Z',
  };

  let currentUser = null;

  return {
    userApi: {
      login: vi.fn(async (_params) => {
        currentUser = { ...mockUser };
        return currentUser;
      }),
      logout: vi.fn(async () => {
        currentUser = null;
        return true;
      }),
      getCurrentUser: vi.fn(async () => {
        return currentUser;
      }),
    },
  };
});

const { login, logout, getCurrentUser, isLoggedIn } = await import(
  '@/modules/user/services/auth-service.js'
);
const { userApi } = await import('@/platform/api.js');

describe('auth-service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // 重置 getCurrentUser 的返回值为 null（未登录状态）
    userApi.getCurrentUser.mockResolvedValue(null);
  });

  describe('login', () => {
    it('调用 login 后返回用户对象', async () => {
      const mockUser = {
        id: 1700000000000,
        nickname: '楚菜爱好者',
        avatar: '',
        openid: 'mock_openid_001',
        createdAt: '2026-06-01T08:00:00.000Z',
      };
      userApi.login.mockResolvedValue(mockUser);

      const user = await login({ nickname: '楚菜爱好者' });

      expect(user).toEqual(mockUser);
      expect(userApi.login).toHaveBeenCalledOnce();
      expect(userApi.login).toHaveBeenCalledWith({ nickname: '楚菜爱好者' });
    });

    it('不传参数时 login 仍可调用并返回默认用户', async () => {
      const defaultUser = {
        id: 1700000000001,
        nickname: '楚菜爱好者',
        avatar: '',
        openid: 'mock_openid_001',
        createdAt: '2026-06-01T08:00:00.000Z',
      };
      userApi.login.mockResolvedValue(defaultUser);

      const user = await login();

      expect(user.nickname).toBe('楚菜爱好者');
      expect(userApi.login).toHaveBeenCalledOnce();
    });

    it('传入 nickname 和 avatar 时参数透传到 userApi.login', async () => {
      userApi.login.mockResolvedValue({
        id: 1,
        nickname: '自定义用户',
        avatar: 'data:image/png;base64,AAAA',
        openid: 'mock_openid_001',
        createdAt: '2026-06-01T08:00:00.000Z',
      });

      await login({ nickname: '自定义用户', avatar: 'data:image/png;base64,AAAA' });

      expect(userApi.login).toHaveBeenCalledWith({
        nickname: '自定义用户',
        avatar: 'data:image/png;base64,AAAA',
      });
    });
  });

  describe('logout', () => {
    it('logout 返回 true', async () => {
      userApi.logout.mockResolvedValue(true);

      const result = await logout();

      expect(result).toBe(true);
      expect(userApi.logout).toHaveBeenCalledOnce();
    });

    it('logout 后 getCurrentUser 返回 null', async () => {
      userApi.logout.mockResolvedValue(true);
      userApi.getCurrentUser.mockResolvedValue(null);

      await logout();
      const user = await getCurrentUser();

      expect(user).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('未登录时返回 null', async () => {
      userApi.getCurrentUser.mockResolvedValue(null);

      const user = await getCurrentUser();

      expect(user).toBeNull();
      expect(userApi.getCurrentUser).toHaveBeenCalledOnce();
    });

    it('已登录时返回用户对象', async () => {
      const mockUser = {
        id: 1700000000000,
        nickname: '楚菜爱好者',
        avatar: '',
        openid: 'mock_openid_001',
        createdAt: '2026-06-01T08:00:00.000Z',
      };
      userApi.getCurrentUser.mockResolvedValue(mockUser);

      const user = await getCurrentUser();

      expect(user).toEqual(mockUser);
    });
  });

  describe('isLoggedIn', () => {
    it('未登录时返回 false', async () => {
      userApi.getCurrentUser.mockResolvedValue(null);

      const result = await isLoggedIn();

      expect(result).toBe(false);
    });

    it('已登录时返回 true', async () => {
      userApi.getCurrentUser.mockResolvedValue({
        id: 1700000000000,
        nickname: '楚菜爱好者',
        avatar: '',
        openid: 'mock_openid_001',
        createdAt: '2026-06-01T08:00:00.000Z',
      });

      const result = await isLoggedIn();

      expect(result).toBe(true);
    });

    it('isLoggedIn 内部通过 getCurrentUser 判断，不单独调用 userApi', async () => {
      userApi.getCurrentUser.mockResolvedValue(null);

      await isLoggedIn();

      // isLoggedIn 复用 getCurrentUser，不应绕过服务层直接调用 userApi.login
      expect(userApi.login).not.toHaveBeenCalled();
      expect(userApi.logout).not.toHaveBeenCalled();
      expect(userApi.getCurrentUser).toHaveBeenCalledOnce();
    });
  });
});
