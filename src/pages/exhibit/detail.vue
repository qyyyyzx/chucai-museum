<template>
  <view class="page">
    <view class="placeholder">
      <uni-icons type="info" size="60" color="#cccccc" />
      <text class="placeholder-title">展品详情页</text>
      <text class="placeholder-id">展品 ID：{{ exhibitId }}</text>
      <text class="placeholder-tip">此页面由 C3 负责人（吴若凡）开发，当前为占位页面</text>
    </view>
  </view>
</template>

<script>
import { pickRouteParam } from '@/shared/utils/route-query.js';

export default {
  name: 'ExhibitDetail',
  data() {
    return {
      exhibitId: null,
    };
  },
  onLoad(options) {
    this.exhibitId = pickRouteParam(options, 'id');
  },
};
</script>

<style scoped>
.page {
  background-color: #f5f5f5;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx 40rpx;
}

.placeholder-title {
  margin-top: 24rpx;
  font-size: 36rpx;
  color: #333333;
  font-weight: bold;
}

.placeholder-id {
  margin-top: 16rpx;
  font-size: 28rpx;
  color: #666666;
}

.placeholder-tip {
  margin-top: 20rpx;
  font-size: 24rpx;
  color: #999999;
  text-align: center;
  line-height: 1.6;
}
</style>
