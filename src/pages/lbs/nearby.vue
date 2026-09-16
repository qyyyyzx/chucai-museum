<template>
  <view class="page">
    <!-- 加载状态 -->
    <loading-state v-if="isLoading" />

    <!-- 错误状态 -->
    <error-message v-else-if="errorMsg" :message="errorMsg" />

    <!-- 空状态 -->
    <view v-else-if="list.length === 0" class="empty-state">
      <uni-icons type="location" size="60" color="#cccccc" />
      <text class="empty-text">附近暂无餐厅</text>
    </view>

    <!-- 餐厅列表 -->
    <view v-else class="list-wrap">
      <view
        v-for="item in list"
        :key="item.id"
        class="card"
      >
        <!-- 卡片头部：餐厅名称 + 距离 -->
        <view class="card-header">
          <text class="card-name">{{ item.name }}</text>
          <text class="card-distance">{{ item.distanceText }}</text>
        </view>

        <!-- 营业时间 -->
        <view class="card-row">
          <text class="card-label">营业时间</text>
          <text class="card-value">{{ item.businessHours.open }} - {{ item.businessHours.close }}</text>
        </view>

        <!-- 招牌菜品（前 2 道） -->
        <view class="card-row">
          <text class="card-label">招牌菜品</text>
          <text class="card-value">{{ getTopDishes(item.signatureDishes) }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { lbsApi } from '@/platform/api.js';
import { sortRestaurantsByDistance } from '@/modules/lbs/domain/distance.js';
import LoadingState from '@/shared/components/loading-state.vue';
import ErrorMessage from '@/shared/components/error-message.vue';

export default {
  name: 'NearbyPage',
  components: {
    LoadingState,
    ErrorMessage,
  },
  data() {
    return {
      /** 是否正在加载 */
      isLoading: true,
      /** 错误信息，无错误时为空字符串 */
      errorMsg: '',
      /** 按距离排序后的餐厅列表 */
      list: [],
    };
  },
  async onShow() {
    await this.loadData();
  },
  methods: {
    /**
     * 并行获取用户位置和全量餐厅列表，计算距离后排序渲染
     */
    async loadData() {
      this.isLoading = true;
      this.errorMsg = '';
      this.list = [];

      try {
        const [location, restaurantResult] = await Promise.all([
          lbsApi.getCurrentLocation(),
          Promise.resolve(lbsApi.getRestaurantsByTimeSlot()),
        ]);

        const { list: restaurants } = restaurantResult;

        this.list = sortRestaurantsByDistance(
          restaurants,
          location.latitude,
          location.longitude,
        );
      } catch (error) {
        this.errorMsg = error.message || '获取附近餐厅失败，请稍后重试';
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * 取招牌菜品前 2 道，拼接为逗号分隔的字符串
     * @param {string[]} dishes - 招牌菜品数组
     * @returns {string} 格式化后的菜品字符串
     */
    getTopDishes(dishes) {
      if (!Array.isArray(dishes) || dishes.length === 0) {
        return '暂无';
      }
      return dishes.slice(0, 2).join('、');
    },
  },
};
</script>

<style scoped>
.page {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 20rpx;
  box-sizing: border-box;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;
}

.empty-text {
  margin-top: 20rpx;
  font-size: 28rpx;
  color: #999999;
}

.list-wrap {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.card {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 28rpx 32rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.card-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  flex: 1;
}

.card-distance {
  font-size: 26rpx;
  color: #2979ff;
  margin-left: 16rpx;
  white-space: nowrap;
}

.card-row {
  display: flex;
  align-items: flex-start;
  margin-top: 12rpx;
}

.card-label {
  font-size: 26rpx;
  color: #999999;
  width: 140rpx;
  flex-shrink: 0;
}

.card-value {
  font-size: 26rpx;
  color: #555555;
  flex: 1;
}
</style>
