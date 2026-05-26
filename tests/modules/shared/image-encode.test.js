import { describe, it, expect, vi } from 'vitest'
import { blobToDataURL, isBlobToDataURLSupported } from '@/shared/utils/image-encode.js'

describe('isBlobToDataURLSupported', () => {
  it('在 Vitest 环境中返回 true', () => {
    // Vitest 模拟了浏览器环境，应该支持
    expect(isBlobToDataURLSupported()).toBe(true)
  })
})

describe('blobToDataURL', () => {
  it('dataURL 直接返回', async () => {
    const dataUrl = 'data:image/png;base64,iVBORw0KGgo='
    const result = await blobToDataURL(dataUrl)
    expect(result).toBe(dataUrl)
  })

  it('无效输入时 reject', async () => {
    await expect(blobToDataURL(null)).rejects.toThrow('无效的 blob URL')
    await expect(blobToDataURL('')).rejects.toThrow('无效的 blob URL')
    await expect(blobToDataURL(123)).rejects.toThrow('无效的 blob URL')
  })

  it('非 blob URL 时 reject', async () => {
    await expect(blobToDataURL('https://example.com/image.png')).rejects.toThrow('不是有效的 blob URL')
    await expect(blobToDataURL('/static/image.png')).rejects.toThrow('不是有效的 blob URL')
  })
})
