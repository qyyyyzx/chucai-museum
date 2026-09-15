<template>
  <view class="page">
    <!-- 加载中 -->
    <loading-state v-if="isLoading" />

    <!-- 加载失败 -->
    <error-message v-else-if="errorMsg" :message="errorMsg" />

    <!-- 加载成功，内容区占位（Step 2/3 填充） -->
    <view v-else-if="detail">
      <text>{{ detail.name }}</text>
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
};
</script>

<style scoped>
.page {
  background-color: #f5f5f5;
  min-height: 100vh;
}
</style>
