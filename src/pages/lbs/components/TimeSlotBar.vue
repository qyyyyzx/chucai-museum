<template>
  <view class="timeslot-bar">
    <scroll-view
      scroll-x
      class="scroll-wrap"
      :show-scrollbar="false"
    >
      <view class="inner">
        <view
          v-for="item in TIME_SLOT_LIST"
          :key="item.slot"
          class="slot-item"
          :class="{ 'slot-item--active': item.slot === modelValue }"
          @click="handleClick(item.slot)"
        >
          <!-- info 图标：绝对定位在卡片右上角，点击阻止冒泡并触发 detail emit -->
          <view class="slot-info-icon" @click.stop="handleDetailClick(item.slot)">
            <uni-icons type="info" size="14" color="#999999" />
          </view>

          <!-- 上行：名称 + 别名 -->
          <text class="slot-name">{{ item.name }} · {{ item.alias }}</text>
          <!-- 下行：时段 -->
          <text class="slot-period">{{ item.period }}</text>
          <!-- 选中态底部指示线 -->
          <view v-if="item.slot === modelValue" class="slot-indicator" />
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { TIME_SLOT_LIST } from '@/modules/lbs/domain/time-slots.js';

/**
 * 时间轴子组件 - 荆州十二时辰选择条
 *
 * @description
 * 横向可滚动的时辰选择条，展示十二时辰列表，支持选中态高亮。
 * 数据来自 domain 层的 TIME_SLOT_LIST，不在组件内硬编码。
 * 每个时辰卡片右上角有 info 图标，点击可触发 detail 事件查看文化介绍。
 *
 * @example
 * <TimeSlotBar
 *   :modelValue="currentSlot"
 *   @change="onSlotChange"
 *   @detail="onSlotDetail"
 * />
 *
 * @props
 * - modelValue {string} 当前选中的时辰 slot 标识（如 'wu'）
 *
 * @emits
 * - change {string} 用户点击新时辰时触发，参数为新的 slot 字符串
 * - detail {string} 用户点击时辰卡片右上角 info 图标时触发，参数为对应的 slot 字符串
 */
export default {
  name: 'TimeSlotBar',

  props: {
    /**
     * 当前选中的时辰 slot 标识
     * 取值范围：zi / chou / yin / mao / chen / si / wu / wei / shen / you / xu / hai
     */
    modelValue: {
      type: String,
      required: true,
    },
  },

  emits: ['change', 'detail'],

  data() {
    return {
      /**
       * 十二时辰完整信息列表，来自 domain 层，不可在此修改
       * @type {import('@/modules/lbs/domain/time-slots.js').TimeSlotInfo[]}
       */
      TIME_SLOT_LIST,
    };
  },

  methods: {
    /**
     * 处理时辰点击事件
     * 若点击的是当前已选中的时辰，不重复触发 change 事件
     * @param {string} slot - 被点击的时辰 slot 标识
     */
    handleClick(slot) {
      if (slot === this.modelValue) {
        return;
      }
      this.$emit('change', slot);
    },

    /**
     * 处理 info 图标点击事件
     * 触发 detail 事件通知父组件打开时辰文化介绍弹窗
     * 图标上已通过 @click.stop 阻止冒泡，不会同时触发卡片的 change 事件
     * @param {string} slot - 被点击的时辰 slot 标识
     */
    handleDetailClick(slot) {
      this.$emit('detail', slot);
    },
  },
};
</script>

<style scoped>
/* 外层容器：白色背景，底部阴影分隔内容区 */
.timeslot-bar {
  background-color: #ffffff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
}

/* scroll-view 需要显式设置宽度才能横向滚动 */
.scroll-wrap {
  width: 100%;
  white-space: nowrap;
}

/* 内部行容器：flex 布局，不换行，保证横向滚动 */
.inner {
  display: inline-flex;
  flex-direction: row;
  align-items: stretch;
  padding: 0 8rpx;
}

/* 单个时辰卡片 */
.slot-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 20rpx 24rpx 16rpx;
  position: relative;
  min-width: 160rpx;
  cursor: pointer;
}

/* info 图标容器：绝对定位在卡片右上角 */
.slot-info-icon {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  padding: 8rpx;
  cursor: pointer;
}

/* 上行：时辰名称 + 别名 */
.slot-name {
  font-size: 26rpx;
  color: #666666;
  line-height: 1.4;
  white-space: nowrap;
}

/* 下行：时段范围 */
.slot-period {
  font-size: 22rpx;
  color: #999999;
  margin-top: 6rpx;
  white-space: nowrap;
  line-height: 1.4;
}

/* 选中态：文字变蓝加粗 */
.slot-item--active .slot-name {
  color: #2979ff;
  font-weight: bold;
}

.slot-item--active .slot-period {
  color: #2979ff;
}

/* 选中态底部蓝色指示线 */
.slot-indicator {
  position: absolute;
  bottom: 0;
  left: 20rpx;
  right: 20rpx;
  height: 4rpx;
  background-color: #2979ff;
  border-radius: 2rpx;
}
</style>
