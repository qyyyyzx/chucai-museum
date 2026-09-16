<template>
  <view class="page">
    <!-- 顶部时间轴 -->
    <time-slot-bar
      :modelValue="selectedSlot"
      @change="onSlotChange"
      @detail="openSlotDetail"
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
          @click="openDetail(item)"
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

    <!-- 餐厅详情弹窗（从底部滑出） -->
    <uni-popup
      ref="popup"
      type="bottom"
      :safe-area="false"
      @maskClick="closeDetail"
    >
      <view class="popup-card">
        <!-- 弹窗顶部：餐厅名称 + 关闭按钮 -->
        <view class="popup-header">
          <text class="popup-name">
            {{ selectedRestaurant ? selectedRestaurant.name : '' }}
          </text>
          <uni-icons
            type="close"
            size="24"
            color="#666666"
            class="popup-close"
            @click="closeDetail"
          />
        </view>

        <!-- 弹窗内容，仅在数据就绪时渲染 -->
        <view v-if="popupVisible && selectedRestaurant">
          <!-- 地址行 -->
          <view class="popup-row">
            <text class="popup-label">地址</text>
            <text class="popup-value">{{ selectedRestaurant.address }}</text>
          </view>

          <!-- 营业时间行 -->
          <view class="popup-row">
            <text class="popup-label">营业时间</text>
            <text class="popup-value">
              {{ selectedRestaurant.businessHours.open }} - {{ selectedRestaurant.businessHours.close }}
              <text v-if="selectedRestaurant.businessHours.remark" class="popup-remark">
                （{{ selectedRestaurant.businessHours.remark }}）
              </text>
            </text>
          </view>

          <!-- 招牌菜品区（全部展示） -->
          <view class="popup-row popup-row--wrap">
            <text class="popup-label">招牌菜品</text>
            <view class="popup-tags">
              <uni-tag
                v-for="(dish, index) in selectedRestaurant.signatureDishes"
                :key="index"
                :text="dish"
                type="default"
                size="normal"
              />
            </view>
          </view>
        </view>

        <!-- 底部一键导航按钮 -->
        <view class="popup-footer">
          <view class="navigate-btn" @click="handleNavigate">
            <text class="navigate-btn-text">一键导航</text>
          </view>
        </view>
      </view>
    </uni-popup>
    <!-- 时辰文化介绍弹窗 -->
    <time-slot-detail
      ref="slotDetail"
      :slotInfo="currentSlotInfo"
    />
  </view>
</template>

<script>
import { lbsApi } from '@/platform/api.js';
import { getCurrentTimeSlot, getTimeSlotInfo } from '@/modules/lbs/domain/time-slots.js';
import { sortRestaurantsByDistance } from '@/modules/lbs/domain/distance.js';
import TimeSlotBar from '@/pages/lbs/components/TimeSlotBar.vue';
import TimeSlotDetail from '@/pages/lbs/components/TimeSlotDetail.vue';
import LoadingState from '@/shared/components/loading-state.vue';
import ErrorMessage from '@/shared/components/error-message.vue';

/**
 * 楚菜地图主页面 - 筷乐寻楚
 *
 * 页面结构：
 * - 顶部：TimeSlotBar 时间轴（时辰切换）
 * - 主体：餐厅列表（按距离排序，含加载/错误/空状态）
 * - 底部：餐厅详情弹窗（uni-popup，含一键导航）
 */
export default {
  name: 'ChumapPage',

  components: {
    TimeSlotBar,
    LoadingState,
    ErrorMessage,
    TimeSlotDetail,
  },

  data() {
    return {
      /** 当前选中的时辰 slot 标识 */
      selectedSlot: getCurrentTimeSlot(),

      /** 是否正在加载（初始 true 避免闪空状态） */
      isLoading: true,

      /** 错误信息，无错误时为空字符串 */
      errorMsg: '',

      /** 当前时辰的餐厅列表，每项已附带 distanceKm 和 distanceText */
      restaurants: [],

      /** 缓存的用户位置坐标，避免切换时辰时重复定位 */
      userLocation: null,

      /** 弹窗中当前展示的餐厅对象 */
      selectedRestaurant: null,

      /** 弹窗内容是否可渲染（与动画解耦，避免关闭时属性访问报错） */
      popupVisible: false,
      /** 当前"时辰详情"弹窗显示的时辰对象 */
      currentSlotInfo: null,
    };
  },

  async onShow() {
    this.selectedSlot = getCurrentTimeSlot();
    await this.loadRestaurants(this.selectedSlot);
  },

  methods: {
    /**
     * 加载指定时辰的餐厅列表
     * @param {string} slot - 时辰 slot 标识
     */
    async loadRestaurants(slot) {
      this.isLoading = true;
      this.errorMsg = '';

      try {
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
     * 时间轴切换时辰
     * @param {string} slot - 新选中的时辰 slot
     */
    async onSlotChange(slot) {
      this.selectedSlot = slot;
      await this.loadRestaurants(slot);
    },

    /**
     * 取招牌菜品前 2 道拼接为字符串
     * @param {string[]} dishes
     * @returns {string}
     */
    getTopDishes(dishes) {
      if (!Array.isArray(dishes) || dishes.length === 0) {
        return '暂无';
      }
      return dishes.slice(0, 2).join('、');
    },

    /**
     * 打开餐厅详情弹窗
     * @param {Object} item - 餐厅对象
     */
    openDetail(item) {
      this.selectedRestaurant = item;
      this.popupVisible = true;
      this.$refs.popup.open();
    },

    /**
     * 关闭弹窗
     */
    closeDetail() {
      this.$refs.popup.close();
      this.popupVisible = false;
      setTimeout(() => {
        this.selectedRestaurant = null;
      }, 300);
    },

    /**
     * 一键导航：调用系统地图
     */
    handleNavigate() {
      if (!this.selectedRestaurant) {
        return;
      }
      const { coordinates, name, address } = this.selectedRestaurant;
      uni.openLocation({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        name,
        address,
        scale: 18,
      });
    },
    /**
     * 打开时辰文化介绍弹窗
     * @param {string} slot - 时辰 slot 标识（如 'wu'）
     */
    openSlotDetail(slot) {
      const info = getTimeSlotInfo(slot);
      if (!info) {
        return;
      }
      this.currentSlotInfo = info;
      this.$nextTick(() => {
        this.$refs.slotDetail.open();
      });
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

/* 空状态 */
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

/* 餐厅列表 */
.list-wrap {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

/* 餐厅卡片 */
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

.card-remark {
  font-size: 24rpx;
  color: #aaaaaa;
}

/* ========== 弹窗样式 ========== */
.popup-card {
  background-color: #ffffff;
  border-radius: 24rpx 24rpx 0 0;
  padding: 32rpx;
  max-height: 70vh;
  overflow-y: auto;
  box-sizing: border-box;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 24rpx;
  border-bottom: 1rpx solid #eeeeee;
}

.popup-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
  flex: 1;
  padding-right: 16rpx;
}

.popup-close {
  cursor: pointer;
  flex-shrink: 0;
}

.popup-row {
  display: flex;
  align-items: flex-start;
  margin-top: 24rpx;
}

.popup-row--wrap {
  align-items: flex-start;
}

.popup-label {
  font-size: 28rpx;
  color: #999999;
  width: 160rpx;
  flex-shrink: 0;
}

.popup-value {
  font-size: 28rpx;
  color: #333333;
  flex: 1;
  line-height: 1.6;
}

.popup-remark {
  font-size: 24rpx;
  color: #aaaaaa;
}

.popup-tags {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.popup-footer {
  margin-top: 40rpx;
}

.navigate-btn {
  width: 100%;
  height: 88rpx;
  background-color: #2979ff;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.navigate-btn-text {
  font-size: 30rpx;
  color: #ffffff;
  font-weight: bold;
}
</style>
