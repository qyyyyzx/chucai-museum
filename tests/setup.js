/**
 * Vitest setup — shim uni.* globals so domain/service code can be tested
 * without the full uni-app runtime.
 *
 * 存储 API 用内存 Map 模拟，保证 set/get/remove 行为一致。
 * 每个测试用例前自动清空，避免测试之间相互污染。
 */

import { beforeEach } from 'vitest';

const _memStorage = new Map();

beforeEach(() => {
  _memStorage.clear();
});

globalThis.uni = {
  showToast: () => {},
  showModal: () => ({ confirm: true }),
  navigateTo: () => {},
  navigateBack: () => {},
  reLaunch: () => {},
  switchTab: () => {},
  setStorageSync: (key, value) => {
    _memStorage.set(key, value);
  },
  getStorageSync: (key) => (_memStorage.has(key) ? _memStorage.get(key) : ''),
  removeStorageSync: (key) => {
    _memStorage.delete(key);
  },
  clearStorageSync: () => {
    _memStorage.clear();
  },
  chooseImage: () => {},
  getSystemInfoSync: () => ({ platform: 'devtools' })
};

globalThis.wx = globalThis.uni;
