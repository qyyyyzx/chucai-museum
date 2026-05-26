<template>
  <view class="page">
    <view class="section">
      <text class="section-title">退出/返回按钮组件</text>
      <view class="demo-item">
        <text class="demo-label">默认样式（返回首页）</text>
        <exit-button />
      </view>
      <view class="demo-item">
        <text class="demo-label">自定义文案</text>
        <exit-button text="返回上一页" type="navigateBack" />
      </view>
    </view>

    <view class="section">
      <text class="section-title">加载状态组件</text>
      <view class="demo-item">
        <text class="demo-label">局部加载</text>
        <loading-state text="正在加载数据..." />
      </view>
      <view class="demo-item">
        <text class="demo-label">隐藏状态</text>
        <loading-state :visible="false" />
        <text class="demo-hint">（不可见）</text>
      </view>
    </view>

    <view class="section">
      <text class="section-title">错误提示组件</text>
      <view class="demo-item">
        <text class="demo-label">默认错误</text>
        <error-message text="数据加载失败" />
      </view>
      <view class="demo-item">
        <text class="demo-label">网络错误（带重试）</text>
        <error-message type="network" text="网络连接失败" :retry="true" @retry="handleRetry" />
      </view>
      <view class="demo-item">
        <text class="demo-label">权限错误</text>
        <error-message type="permission" text="暂无访问权限" />
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ComponentsDemo',
  methods: {
    handleRetry() {
      uni.showToast({
        title: '点击了重试',
        icon: 'none'
      })
    }
  }
}
</script>

<style scoped>
.page {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 20rpx;
}

.section {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 20rpx;
  display: block;
}

.demo-item {
  margin-bottom: 30rpx;
  padding-bottom: 30rpx;
  border-bottom: 1rpx solid #eeeeee;
}

.demo-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.demo-label {
  font-size: 26rpx;
  color: #666666;
  margin-bottom: 16rpx;
  display: block;
}

.demo-hint {
  font-size: 24rpx;
  color: #999999;
  margin-top: 10rpx;
  display: block;
}
</style>
