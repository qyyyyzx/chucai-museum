<template>
  <view class="page">
    <view class="hero">
      <text class="hero-title">楚菜文化数字博物馆</text>
      <text class="hero-subtitle">探索楚菜千年饮食文化</text>
    </view>

    <view class="nav-grid">
      <view class="nav-item" @tap="goExhibit">
        <uni-icons type="images" size="40" color="#2979ff" />
        <text class="nav-label">数字展陈</text>
      </view>
      <view class="nav-item" @tap="goCheckin">
        <uni-icons type="camera" size="40" color="#2979ff" />
        <text class="nav-label">社交打卡</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'IndexPage',
  methods: {
    goExhibit() {
      uni.navigateTo({ url: '/pages/exhibit/list' })
    },
    goCheckin() {
      uni.navigateTo({ url: '/pages/social/checkin' })
    }
  }
}
</script>

<style scoped>
.page {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 40rpx 30rpx;
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 0 40rpx;
}

.hero-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333333;
}

.hero-subtitle {
  margin-top: 16rpx;
  font-size: 28rpx;
  color: #999999;
}

.nav-grid {
  display: flex;
  flex-wrap: wrap;
  margin-top: 40rpx;
}

.nav-item {
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 40rpx 0;
  box-sizing: border-box;
}

.nav-item:nth-child(odd) {
  margin-right: 10rpx;
  width: calc(50% - 10rpx);
}

.nav-item:nth-child(even) {
  margin-left: 10rpx;
  width: calc(50% - 10rpx);
}

.nav-label {
  margin-top: 16rpx;
  font-size: 28rpx;
  color: #333333;
}
</style>
