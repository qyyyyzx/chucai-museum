<template>
  <view class="page">
    <!-- 加载中 -->
    <loading-state v-if="isLoading" />

    <!-- 加载失败 / 类型不符 -->
    <error-message v-else-if="errorMsg" :message="errorMsg" />

    <!-- 故事卡正文 -->
    <view v-else-if="detail" class="content">

      <!-- 顶部轮播图（storyImages 非空时才显示） -->
      <swiper
        v-if="detail.storyImages && detail.storyImages.length > 0"
        class="swiper"
        circular
        indicator-dots
        indicator-color="rgba(255,255,255,0.5)"
        indicator-active-color="#ffffff"
        autoplay
        interval="3000"
      >
        <swiper-item
          v-for="(img, index) in detail.storyImages"
          :key="index"
        >
          <image
            :src="img"
            class="swiper-image"
            mode="aspectFill"
          />
        </swiper-item>
      </swiper>

      <!-- 菜品名称 -->
      <view class="card">
        <text class="dish-name">{{ detail.name }}</text>
        <uni-tag text="菜品故事" type="primary" size="small" class="name-tag" />
      </view>

      <!-- 历史典故 -->
      <view v-if="detail.story" class="card">
        <text class="section-label">历史典故</text>
        <text class="section-body">{{ detail.story }}</text>
      </view>

      <!-- 制作技艺（折叠面板） -->
      <view v-if="detail.technique" class="card">
        <view class="collapse-header" @tap="isExpanded = !isExpanded">
          <text class="section-label collapse-label">制作技艺</text>
          <text class="collapse-arrow">{{ isExpanded ? '收起' : '展开' }}</text>
        </view>
        <view v-show="isExpanded" class="collapse-body">
          <text class="section-body">{{ detail.technique }}</text>
        </view>
      </view>

      <!-- 底部：了解更多 -->
      <view class="footer">
        <uni-icons type="info" size="16" color="#2979ff" />
        <text class="footer-link" @tap="goDetail">了解更多</text>
      </view>

    </view>
  </view>
</template>

<script>
import { pickRouteParam } from '@/shared/utils/route-query.js';
import { exhibitApi } from '@/platform/api.js';
import LoadingState from '@/shared/components/loading-state.vue';
import ErrorMessage from '@/shared/components/error-message.vue';

export default {
  name: 'ExhibitStory',
  components: {
    LoadingState,
    ErrorMessage,
  },
  data() {
    return {
      isLoading: false,
      errorMsg: '',
      detail: null,
      isExpanded: false,
    };
  },
  async onLoad(options) {
    const rawId = pickRouteParam(options, 'id');
    const id = Number(rawId);
    if (!rawId || Number.isNaN(id)) {
      this.errorMsg = '展品 ID 无效';
      return;
    }
    this.isLoading = true;
    try {
      const result = await exhibitApi.getExhibitDetail(id);
      if (!result) {
        this.errorMsg = '未找到对应展品';
        return;
      }
      if (result.type !== 'dish') {
        this.errorMsg = '故事卡仅支持菜品类型';
        return;
      }
      this.detail = result;
    } catch (error) {
      this.errorMsg = error.message || '数据加载失败';
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    goDetail() {
      if (!this.detail) return;
      uni.navigateTo({
        url: `/pages/exhibit/detail?id=${this.detail.id}`,
      });
    },
  },
};
</script>

<style scoped>
.page {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.content {
  padding-bottom: 60rpx;
}

/* 轮播图 */
.swiper {
  width: 100%;
  height: 480rpx;
}

.swiper-image {
  width: 100%;
  height: 100%;
}

/* 卡片通用 */
.card {
  background-color: #ffffff;
  border-radius: 16rpx;
  margin: 20rpx 24rpx 0;
  padding: 32rpx;
}

/* 菜品名称行 */
.dish-name {
  font-size: 40rpx;
  font-weight: bold;
  color: #1a1a1a;
  line-height: 1.4;
  margin-right: 16rpx;
}

.name-tag {
  vertical-align: middle;
}

/* 区块标题 */
.section-label {
  font-size: 28rpx;
  font-weight: bold;
  color: #333333;
  display: block;
  margin-bottom: 16rpx;
  padding-left: 12rpx;
  border-left: 6rpx solid #2979ff;
}

/* 正文 */
.section-body {
  font-size: 28rpx;
  color: #555555;
  line-height: 1.8;
  display: block;
}

/* 折叠面板头部 */
.collapse-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.collapse-label {
  margin-bottom: 0;
}

.collapse-arrow {
  font-size: 26rpx;
  color: #2979ff;
}

/* 折叠内容区 */
.collapse-body {
  margin-top: 16rpx;
}

/* 底部了解更多 */
.footer {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 32rpx 24rpx 0;
  padding: 28rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
}

.footer-link {
  font-size: 28rpx;
  color: #2979ff;
  margin-left: 8rpx;
}
</style>
