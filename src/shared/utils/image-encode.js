/**
 * 图片编码工具
 * 解决 H5 模式下 blob URL 跨页面失效的问题
 *
 * 注意：本函数依赖浏览器 API（XMLHttpRequest、FileReader），
 * 仅支持 H5 环境。小程序环境请使用 uni.getFileSystemManager() 或
 * 在 platform 层实现对应逻辑
 */

/**
 * 检测当前环境是否支持 blobToDataURL
 * @returns {boolean}
 */
export function isBlobToDataURLSupported() {
  return typeof XMLHttpRequest !== 'undefined' && typeof FileReader !== 'undefined'
}

/**
 * 将 blob URL 转换为 base64 dataURL（仅支持 H5 环境）
 * @param {string} blobUrl - blob URL（以 blob: 开头）
 * @returns {Promise<string>} base64 dataURL
 */
export function blobToDataURL(blobUrl) {
  return new Promise((resolve, reject) => {
    if (!blobUrl || typeof blobUrl !== 'string') {
      reject(new Error('无效的 blob URL'))
      return
    }

    // 如果已经是 dataURL，直接返回
    if (blobUrl.startsWith('data:')) {
      resolve(blobUrl)
      return
    }

    // 验证是否为 blob URL
    if (!blobUrl.startsWith('blob:')) {
      reject(new Error('不是有效的 blob URL'))
      return
    }

    // 检测环境支持
    if (!isBlobToDataURLSupported()) {
      reject(new Error('当前环境不支持 blobToDataURL，请使用 H5 环境或在 platform 层实现'))
      return
    }

    try {
      const xhr = new XMLHttpRequest()
      xhr.open('GET', blobUrl, true)
      xhr.responseType = 'blob'

      xhr.onload = function () {
        if (xhr.status === 200) {
          const reader = new FileReader()
          reader.onloadend = function () {
            resolve(reader.result)
          }
          reader.onerror = function () {
            reject(new Error('FileReader 读取失败'))
          }
          reader.readAsDataURL(xhr.response)
        } else {
          reject(new Error(`请求失败: ${xhr.status}`))
        }
      }

      xhr.onerror = function () {
        reject(new Error('网络请求失败'))
      }

      xhr.send()
    } catch (error) {
      reject(error)
    }
  })
}
