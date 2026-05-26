<template>
  <view v-if="visible" class="loading-state" :class="{ 'fullscreen': fullscreen }">
    <view class="loading-content">
      <uni-icons type="loop" size="40" color="#2979ff" class="loading-icon" />
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

.loading-icon {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
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
