<template>
  <view class="exit-button-wrap">
    <button class="exit-button" @tap="handleExit">
      <uni-icons type="back" size="16" color="#ffffff" />
      <text class="exit-text">{{ text }}</text>
    </button>
  </view>
</template>

<script>
export default {
  name: 'ExitButton',
  props: {
    text: {
      type: String,
      default: '返回首页'
    },
    url: {
      type: String,
      default: '/pages/index/index'
    },
    type: {
      type: String,
      default: 'switchTab',
      validator: (value) => ['switchTab', 'reLaunch', 'navigateBack'].includes(value)
    }
  },
  methods: {
    handleExit() {
      if (this.type === 'navigateBack') {
        uni.navigateBack()
      } else if (this.type === 'reLaunch') {
        uni.reLaunch({ url: this.url })
      } else {
        uni.switchTab({ url: this.url })
      }
    }
  }
}
</script>

<style scoped>
.exit-button-wrap {
  display: flex;
  justify-content: center;
  padding: 20rpx;
}

.exit-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2979ff;
  color: #ffffff;
  border: none;
  border-radius: 8rpx;
  padding: 16rpx 32rpx;
  font-size: 28rpx;
  line-height: 1.5;
}

.exit-button::after {
  border: none;
}

.exit-text {
  margin-left: 8rpx;
}
</style>
