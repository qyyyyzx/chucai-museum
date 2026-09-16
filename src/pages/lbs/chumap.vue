<template>
  <view class="page">
    <!-- 顶部时间轴 -->
    <time-slot-bar
      :modelValue="selectedSlot"
      @change="onSlotChange"
    />

    <!-- 主体内容区 -->
    <view class="body">
      <!-- 加载状态 -->
      <loading-state v-if="isLoading" />

      <!-- 错误状态 -->
      <error-message v-else-if="errorMsg" :message="errorMsg" />

      <!-- 空状态 -->
      <view v-else-if="restaurants.length === 0" class="empty-state">
        <uni-icons type="shop" size="60" color="#cccccc" />
        <text class="empty-text">该时辰暂无推荐餐厅</text>
      </view>

      <!-- 餐厅列表 -->
      <view v-else class="list-wrap">
        <view
          v-for="item in restaurants"
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
            <text class="card-value">
              {{ item.businessHours.open }} - {{ item.businessHours.close }}
              <text v-if="item.businessHours.remark" class="card-remark">
                （{{ item.businessHours.remark }}）
              </text>
            </text>
          </view>

          <!-- 招牌菜品（前 2 道） -->
          <view class="card-row">
            <text class="card-label">招牌菜品</text>
            <text class="card-value">{{ getTopDishes(item.signatureDishes) }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部留空（Step 4 加详情弹窗） -->
  </view>
</template>

<script>
import { lbsApi } from '@/platform/api.js';
import { getCurrentTimeSlot } from '@/modules/lbs/domain/time-slots.js';
import { sortRestaurantsByDistance } from '@/modules/lbs/domain/distance.js';
import TimeSlotBar from '@/pages/lbs/components/TimeSlotBar.vue';
import LoadingState from '@/shared/components/loading-state.vue';
import ErrorMessage from '@/shared/components/error-message.vue';

/**
 * 楚菜地图主页面 - 筷乐寻楚
 *
 * @description
 * 以荆州十二时辰为时间轴，展示对应时段的推荐餐厅。
 * 页面结构分三层：
 * - 顶部：TimeSlotBar 时间轴（时辰切换）
 * - 主体：餐厅列表（按距离排序，含加载/错误/空状态）
 * - 底部：餐厅详情弹窗（Step 4 实现）
 *
 * 用户位置在首次加载时获取并缓存到 userLocation，
 * 切换时辰时复用缓存坐标，不重复调用定位接口。
 */
export default {
  name: 'ChumapPage',

  components: {
    TimeSlotBar,
    LoadingState,
    ErrorMessage,
  },

  data() {
    return {
      /**
       * 当前选中的时辰 slot 标识
       * 初始值由 getCurrentTimeSlot() 根据真实时间计算得出
       * @type {string}
       */
      selectedSlot: getCurrentTimeSlot(),

      /** 是否正在加载（初始为 true，避免闪现空状态） */
      isLoading: true,

      /** 错误信息，无错误时为空字符串 */
      errorMsg: '',

      /**
       * 当前时辰的餐厅列表，每项已附带 distanceKm 和 distanceText 字段
       * @type {Array}
       */
      restaurants: [],

      /**
       * 缓存的用户位置坐标，首次获取后复用，避免切换时辰时重复定位
       * @type {{ latitude: number, longitude: number } | null}
       */
      userLocation: null,
    };
  },

  async onShow() {
    /**
     * 每次页面显示时刷新当前时辰，并重新加载对应餐厅列表。
     * 场景：用户切到其他 tab 停留后返回，若跨越时辰边界则自动更新。
     * 注意：userLocation 不在此处清空，位置缓存跨 onShow 保持有效。
     */
    this.selectedSlot = getCurrentTimeSlot();
    await this.loadRestaurants(this.selectedSlot);
  },

  methods: {
    /**
     * 加载指定时辰的餐厅列表
     *
     * 流程：
     * 1. 若 userLocation 为空，先调用 lbsApi.getCurrentLocation() 获取并缓存
     * 2. 调用 lbsApi.getRestaurantsByTimeSlot(slot) 获取该时辰餐厅
     * 3. 用 sortRestaurantsByDistance 为每条记录附加距离字段并按距离升序排序
     * 4. 赋值给 this.restaurants
     *
     * @param {string} slot - 时辰 slot 标识（如 'wu'）
     */
    async loadRestaurants(slot) {
      this.isLoading = true;
      this.errorMsg = '';

      try {
        // 首次加载时获取用户位置并缓存，后续切换时辰复用
        if (!this.userLocation) {
          this.userLocation = await lbsApi.getCurrentLocation();
        }

        const { list } = lbsApi.getRestaurantsByTimeSlot(slot);

        this.restaurants = sortRestaurantsByDistance(
          list,
          this.userLocation.latitude,
          this.userLocation.longitude,
        );
      } catch (error) {
        this.errorMsg = error.message || '获取餐厅列表失败，请稍后重试';
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * 处理时间轴时辰切换事件
     * @param {string} slot - 新选中的时辰 slot 标识
     */
    async onSlotChange(slot) {
      this.selectedSlot = slot;
      await this.loadRestaurants(slot);
    },

    /**
     * 取招牌菜品前 2 道，拼接为顿号分隔的字符串
     * @param {string[]} dishes - 招牌菜品数组
     * @returns {string} 格式化后的菜品字符串，无数据时返回"暂无"
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
/* 整体页面：浅灰背景，全屏高度，纵向布局 */
.page {
  background-color: #f5f5f5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 主体内容区：撑满剩余空间 */
.body {
  flex: 1;
  padding: 20rpx;
  box-sizing: border-box;
}

/* 空状态：居中显示图标和提示文字 */
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

/* 餐厅列表：纵向排列，卡片之间留间距 */
.list-wrap {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

/* 餐厅卡片：白底、圆角、阴影 */
.card {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 28rpx 32rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

/* 卡片头部：名称左对齐，距离右对齐 */
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

/* 卡片信息行：标签 + 内容 */
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

/* 营业时间备注：颜色更浅，区别于主要时段 */
.card-remark {
  font-size: 24rpx;
  color: #aaaaaa;
}
</style>
