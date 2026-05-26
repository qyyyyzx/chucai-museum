/**
 * 路由参数处理工具
 * 解决 vue3 + uni-app 5.07 H5 模式下 onLoad(options) 可能不包含 query 参数的问题
 */

/**
 * 安全获取路由参数
 * @param {Object} options - onLoad 生命周期的 options 参数
 * @param {string} key - 要获取的参数名
 * @returns {string|null} 参数值，不存在时返回 null
 */
export function pickRouteParam(options, key) {
  if (!options || !key) {
    return null
  }

  // 直接从 options 中获取
  if (options[key] !== undefined && options[key] !== null) {
    return String(options[key])
  }

  // 尝试从 URL 中解析（兼容某些情况）
  if (options.url && typeof options.url === 'string') {
    const urlParams = new URLSearchParams(options.url.split('?')[1] || '')
    const value = urlParams.get(key)
    if (value !== null) {
      return value
    }
  }

  return null
}
