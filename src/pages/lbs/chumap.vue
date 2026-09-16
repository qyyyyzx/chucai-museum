<template>
  <view class="page">
    <!-- 顶部时间轴 -->
    <time-slot-bar
      :modelValue="selectedSlot"
      @change="onSlotChange"
    />

    <!-- 主体占位区域（Step 3b 替换为餐厅列表） -->
    <view class="body-placeholder">
      <text class="placeholder-text">当前选中：{{ selectedSlot }}</text>
    </view>

    <!-- 底部留空（Step 4 加详情弹窗） -->
  </view>
</template>

<script>
import { getCurrentTimeSlot } from '@/modules/lbs/domain/time-slots.js';
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
 * - 主体：餐厅列表（Step 3b 实现）
 * - 底部：餐厅详情弹窗（Step 4 实现）
 *
 * 当前为 Step 3a 骨架，主体区域为占位文字，不调用接口。
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
    };
  },

  onShow() {
    /**
     * 每次页面显示时刷新当前时辰。
     * 场景：用户切到其他 tab 停留一段时间后返回，
     * 若跨越了时辰边界则自动更新选中态，避免展示过时时辰。
     */
    this.selectedSlot = getCurrentTimeSlot();
  },

  methods: {
    /**
     * 处理时间轴时辰切换事件
     * @param {string} slot - 新选中的时辰 slot 标识
     */
    onSlotChange(slot) {
      this.selectedSlot = slot;
    },
  },
};
</script>

<style scoped>
/* 整体页面：浅灰背景，全屏高度 */
.page {
  background-color: #f5f5f5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 主体占位区域（Step 3b 替换） */
.body-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}

.placeholder-text {
  font-size: 28rpx;
  color: #999999;
}
</style>
