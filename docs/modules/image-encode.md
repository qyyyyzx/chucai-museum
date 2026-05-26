# image-encode.js

> 图片编码工具

## 说明

解决 H5 模式下 `uni.chooseImage` 返回的 blob URL 是 page-scoped 的，跨页面会失效的问题。

## 函数

### blobToDataURL(blobUrl)

将 blob URL 转换为 base64 dataURL。

**参数**：
- `blobUrl` (string): blob URL（以 blob: 开头）

**返回值**：
- `Promise<string>`: base64 dataURL

**使用示例**：
```javascript
import { blobToDataURL } from '@/shared/utils/image-encode.js'

uni.chooseImage({
  success: async (res) => {
    const blobUrl = res.tempFilePaths[0]
    const dataUrl = await blobToDataURL(blobUrl)
    // dataUrl 可以跨页面使用，也可以持久化存储
  }
})
```

**解决问题**：
- blob URL 在当前页面有效，跳转后失效
- 转换为 base64 dataURL 后可持久化存储
