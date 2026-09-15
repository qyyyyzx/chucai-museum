<template>
  <view class="page">
    <!-- 加载中 -->
    <loading-state v-if="isLoading" />

    <!-- 加载失败 -->
    <error-message v-else-if="errorMsg" :message="errorMsg" />

    <!-- 菜品详情 -->
    <view v-else-if="detail && detail.type === 'dish'" class="content">
      <!-- 顶部大图 -->
      <image
        v-if="detail.image && !imageError"
        :src="detail.image"
        class="hero-image"
        mode="widthFix"
        @error="imageError = true"
      />

      <!-- 基本信息卡片 -->
      <view class="card">
        <text class="title">{{ detail.name }}</text>
      </view>

      <!-- 历史渊源 -->
      <view v-if="detail.history" class="card">
        <text class="section-label">历史渊源</text>
        <text class="section-body">{{ detail.history }}</text>
      </view>

      <!-- 烹饪做法 -->
      <view v-if="detail.method" class="card">
        <text class="section-label">烹饪做法</text>
        <text class="section-body">{{ detail.method }}</text>
      </view>

      <!-- 食材列表 -->
      <view v-if="detail.ingredients && detail.ingredients.length > 0" class="card">
        <text class="section-label">主要食材</text>
        <view class="ingredients-wrap">
          <uni-tag
            v-for="(item, index) in detail.ingredients"
            :key="index"
            :text="item"
            type="primary"
            size="normal"
            class="ingredient-tag"
          />
        </view>
      </view>

      <!-- 查看故事入口 -->
      <view class="card story-btn" @tap="goStory">
        <uni-icons type="book" size="18" color="#2979ff" />
        <text class="story-btn-text">查看故事</text>
      </view>
    </view>

    <!-- 名厨详情 -->
    <view v-else-if="detail && detail.type === 'chef'" class="content">
      <!-- 顶部照片 -->
      <image
        v-if="detail.photo && !imageError"
        :src="detail.photo"
        class="hero-image"
        mode="widthFix"
        @error="imageError = true"
      />

      <!-- 基本信息卡片 -->
      <view class="card">
        <text class="title">{{ detail.name }}</text>
      </view>

      <!-- 简介 -->
      <view v-if="detail.bio" class="card">
        <text class="section-label">名厨简介</text>
        <text class="section-body">{{ detail.bio }}</text>
      </view>

      <!-- 代表菜品 -->
      <view v-if="detail.signatureDishes && detail.signatureDishes.length > 0" class="card">
        <text class="section-label">代表菜品</text>
        <view class="ingredients-wrap">
          <uni-tag
            v-for="(dish, index) in detail.signatureDishes"
            :key="index"
            :text="dish"
            type="primary"
            size="normal"
            class="ingredient-tag"
          />
        </view>
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
  name: 'ExhibitDetail',
  components: {
    LoadingState,
    ErrorMessage,
  },
  data() {
    return {
      isLoading: false,
      errorMsg: '',
      detail: null,
      imageError: false,
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
      this.detail = result;
    } catch (error) {
      this.errorMsg = error.message || '数据加载失败';
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    goStory() {
      if (!this.detail) return;
      uni.navigateTo({
        url: `/pages/exhibit/story?id=${this.detail.id}`,
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
  padding-bottom: 40rpx;
}

.hero-image {
  width: 100%;
  display: block;
}

.card {
  background-color: #ffffff;
  border-radius: 16rpx;
  margin: 20rpx 24rpx 0;
  padding: 32rpx;
}

.title {
  font-size: 40rpx;
  font-weight: bold;
  color: #1a1a1a;
  line-height: 1.4;
}

.section-label {
  font-size: 28rpx;
  font-weight: bold;
  color: #333333;
  display: block;
  margin-bottom: 16rpx;
  padding-left: 12rpx;
  border-left: 6rpx solid #2979ff;
}

.section-body {
  font-size: 28rpx;
  color: #555555;
  line-height: 1.8;
  display: block;
}

.ingredients-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.ingredient-tag {
  margin: 0;
}

/* 查看故事按钮 */
.story-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28rpx;
}

.story-btn-text {
  font-size: 28rpx;
  color: #2979ff;
  margin-left: 8rpx;
}
</style>
