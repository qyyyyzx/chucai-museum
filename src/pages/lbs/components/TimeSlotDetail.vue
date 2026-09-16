<template>
  <uni-popup ref="popup" type="bottom" :safe-area="false">
    <view class="detail-card">

      <!-- 配图区（含关闭按钮绝对定位层） -->
      <view class="image-wrap">
        <!-- 有真实图片时显示 image -->
        <image
          v-if="slotInfo && slotInfo.image"
          :src="slotInfo.image"
          mode="aspectFill"
          class="cover-image"
        />
        <!-- 无图片时显示主题色色块 + 时辰名 -->
        <view
          v-else
          class="color-block"
          :style="{ backgroundColor: slotInfo ? slotInfo.themeColor : '#333333' }"
        >
          <text class="color-block-name">
            {{ slotInfo ? slotInfo.name : '' }}
          </text>
        </view>

        <!-- 关闭按钮：绝对定位在配图右上角 -->
        <view class="close-btn" @click="close">
          <uni-icons type="close" size="20" color="#ffffff" />
        </view>
      </view>

      <!-- 内容区 -->
      <view v-if="slotInfo" class="content">
        <!-- 第一行：时辰名 + 别名 -->
        <view class="title-row">
          <text class="slot-name">{{ slotInfo.name }}</text>
          <text class="slot-alias">{{ slotInfo.alias }}</text>
        </view>

        <!-- 第二行：时段 -->
        <view class="period-row">
          <text class="slot-period">{{ slotInfo.period }}</text>
        </view>

        <!-- 第三行：文化描述正文 -->
        <view class="desc-row">
          <text class="slot-desc">{{ slotInfo.description }}</text>
        </view>
      </view>

    </view>
  </uni-popup>
</template>

<script>
/**
 * 时辰文化介绍弹窗组件
 *
 * @description
 * 从底部弹出的时辰文化介绍弹窗，展示单个时辰的配图（或主题色色块）、
 * 名称、别名、时段以及文化描述正文。
 * 由父组件通过 ref 调用 open() / close() 控制显隐，自身不管理数据。
 *
 * @example
 * <TimeSlotDetail ref="slotDetail" :slotInfo="currentSlotInfo" />
 *
 * // 父组件中：
 * this.$refs.slotDetail.open();
 * this.$refs.slotDetail.close();
 *
 * @props
 * - slotInfo {Object|null} 时辰数据对象，字段包括：
 *     slot {string}        时辰标识，如 'wu'
 *     name {string}        时辰名称，如 '午时'
 *     alias {string}       时辰别名，如 '日中'
 *     period {string}      时段范围，如 '11:00-13:00'
 *     themeColor {string}  主题色，无图片时作为色块背景
 *     image {string}       配图路径，空字符串表示无图
 *     description {string} 文化介绍正文
 */
export default {
  name: 'TimeSlotDetail',

  props: {
    /**
     * 时辰数据对象，由父组件传入
     * 为 null 时弹窗内容不渲染，避免属性访问报错
     */
    slotInfo: {
      type: Object,
      default: null,
    },
  },

  methods: {
    /**
     * 打开弹窗
     * 由父组件通过 ref 调用
     */
    open() {
      this.$refs.popup.open();
    },

    /**
     * 关闭弹窗
     * 由父组件通过 ref 调用，也可由内部关闭按钮触发
     */
    close() {
      this.$refs.popup.close();
    },
  },
};
</script>

<style scoped>
/* 弹窗主容器：白底，顶部圆角，最大高度 80vh，内容超出时可滚动 */
.detail-card {
  background-color: #ffffff;
  border-radius: 24rpx 24rpx 0 0;
  max-height: 80vh;
  overflow-y: auto;
  box-sizing: border-box;
}

/* ========== 配图区 ========== */
.image-wrap {
  position: relative;
  width: 100%;
  height: 240rpx;
  overflow: hidden;
  /* 顶部圆角跟随容器 */
  border-radius: 24rpx 24rpx 0 0;
}

/* 真实图片：铺满配图区 */
.cover-image {
  width: 100%;
  height: 100%;
  display: block;
}

/* 主题色色块：无图片时的降级方案 */
.color-block {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 色块中央的时辰名大字 */
.color-block-name {
  font-size: 72rpx;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 8rpx;
}

/* 关闭按钮：绝对定位在配图右上角 */
.close-btn {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  width: 56rpx;
  height: 56rpx;
  background-color: rgba(0, 0, 0, 0.35);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* ========== 内容区 ========== */
.content {
  padding: 32rpx;
  box-sizing: border-box;
}

/* 第一行：时辰名 + 别名 */
.title-row {
  display: flex;
  align-items: baseline;
  margin-bottom: 16rpx;
}

.slot-name {
  font-size: 44rpx;
  font-weight: bold;
  color: #333333;
  margin-right: 16rpx;
}

.slot-alias {
  font-size: 28rpx;
  color: #999999;
}

/* 第二行：时段 */
.period-row {
  margin-bottom: 24rpx;
}

.slot-period {
  font-size: 26rpx;
  color: #aaaaaa;
}

/* 第三行：文化描述正文 */
.desc-row {
  /* 底部留白，避免内容贴底 */
  padding-bottom: 16rpx;
}

.slot-desc {
  font-size: 28rpx;
  color: #555555;
  line-height: 1.8;
}
</style>
