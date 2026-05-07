/**
 * Vitest setup — shim uni.* globals so domain/service code can be tested
 * without the full uni-app runtime.
 */

globalThis.uni = {
  showToast: () => {},
  showModal: () => ({ confirm: true }),
  navigateTo: () => {},
  navigateBack: () => {},
  reLaunch: () => {},
  switchTab: () => {},
  setStorageSync: () => {},
  getStorageSync: () => '',
  removeStorageSync: () => {},
  chooseImage: () => {},
  getSystemInfoSync: () => ({ platform: 'devtools' })
}

globalThis.wx = globalThis.uni
