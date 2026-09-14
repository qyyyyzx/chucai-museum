<template>
  <view v-if="visible" class="loading-state" :class="{ 'fullscreen': fullscreen }">
    <view class="loading-content">
      <!-- 用纯 CSS border 动画代替 uni-icons animation，兼容性更好 -->
      <view class="loading-spinner" />
      <text class="loading-text">{{ text }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'LoadingState',
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    text: {
      type: String,
      default: '加载中...'
    },
    fullscreen: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx 0;
}

.loading-state.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 999;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading-spinner {
  width: 64rpx;
  height: 64rpx;
  border: 6rpx solid #e0e0e0;
  border-top-color: #2979ff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  margin-top: 16rpx;
  font-size: 28rpx;
  color: #666666;
}
</style>
