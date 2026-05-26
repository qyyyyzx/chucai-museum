/**
 * 路由参数处理工具
 * 解决 vue3 + uni-app 5.07 H5 模式下 onLoad(options) 可能不包含 query 参数的问题
 *
 * 注意：本函数使用纯 JavaScript 实现，不依赖浏览器 API（如 URLSearchParams），
 * 支持 H5、小程序、Node.js 等所有环境
 */

/**
 * 解析 URL 查询字符串
 * @param {string} queryString - 查询字符串（不含 ?）
 * @returns {Object} 参数对象
 */
function parseQueryString(queryString) {
  const params = {}
  if (!queryString) {
    return params
  }

  const pairs = queryString.split('&')
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=')
    const key = decodeURIComponent(pair[0] || '')
    const value = decodeURIComponent(pair[1] || '')
    if (key) {
      params[key] = value
    }
  }

  return params
}

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
    const queryString = options.url.split('?')[1] || ''
    const params = parseQueryString(queryString)
    if (params[key] !== undefined) {
      return params[key]
    }
  }

  return null
}
