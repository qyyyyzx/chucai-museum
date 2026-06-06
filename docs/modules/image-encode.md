# image-encode.js

> 图片编码工具

## 说明

解决 H5 模式下 `uni.chooseImage` 返回的 blob URL 是 page-scoped 的，跨页面会失效的问题。

**环境限制**：本模块依赖浏览器 API（XMLHttpRequest、FileReader），**仅支持 H5 环境**。小程序环境请使用 `uni.getFileSystemManager()` 或在 platform 层实现对应逻辑。

## 函数

### isBlobToDataURLSupported()

检测当前环境是否支持 blobToDataURL。

**返回值**：
- `boolean`: 支持返回 true，不支持返回 false

### blobToDataURL(blobUrl)

将 blob URL 转换为 base64 dataURL（仅支持 H5 环境）。

**参数**：
- `blobUrl` (string): blob URL（以 blob: 开头）

**返回值**：
- `Promise<string>`: base64 dataURL

**异常**：
- 环境不支持时抛出错误

**使用示例**：
```javascript
import { blobToDataURL, isBlobToDataURLSupported } from '@/shared/utils/image-encode.js'

uni.chooseImage({
  success: async (res) => {
    if (!isBlobToDataURLSupported()) {
      console.log('当前环境不支持，使用原生方式')
      return
    }

    const blobUrl = res.tempFilePaths[0]
    const dataUrl = await blobToDataURL(blobUrl)
    // dataUrl 可以跨页面使用，也可以持久化存储
  }
})
```

**解决问题**：
- blob URL 在当前页面有效，跳转后失效
- 转换为 base64 dataURL 后可持久化存储
