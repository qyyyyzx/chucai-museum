<template>
  <view v-if="visible" class="error-message">
    <view class="error-content">
      <uni-icons :type="iconType" size="60" :color="iconColor" />
      <text class="error-text">{{ text }}</text>
      <button v-if="retry" class="retry-button" @tap="$emit('retry')">
        <uni-icons type="refresh" size="16" color="#ffffff" />
        <text class="retry-text">重试</text>
      </button>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ErrorMessage',
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'network', 'data', 'permission'].includes(value)
    },
    text: {
      type: String,
      default: '加载失败'
    },
    retry: {
      type: Boolean,
      default: false
    }
  },
  emits: ['retry'],
  computed: {
    iconType() {
      const icons = {
        default: 'info',
        network: 'wifi-off',
        data: 'info',
        permission: 'locked'
      }
      return icons[this.type] || 'info'
    },
    iconColor() {
      const colors = {
        default: '#ff6b6b',
        network: '#ffa502',
        data: '#ff6b6b',
        permission: '#ff6b6b'
      }
      return colors[this.type] || '#ff6b6b'
    }
  }
}
</script>

<style scoped>
.error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60rpx 40rpx;
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.error-text {
  margin-top: 20rpx;
  font-size: 28rpx;
  color: #666666;
  text-align: center;
}

.retry-button {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30rpx;
  background-color: #2979ff;
  color: #ffffff;
  border: none;
  border-radius: 8rpx;
  padding: 16rpx 40rpx;
  font-size: 28rpx;
  line-height: 1.5;
}

.retry-button::after {
  border: none;
}

.retry-text {
  margin-left: 8rpx;
}
</style>
