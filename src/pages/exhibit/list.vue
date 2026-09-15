<template>
  <view class="page">
    <view class="tab-bar">
      <view
        class="tab-item"
        :class="{ active: activeTab === 'dish' }"
        @tap="activeTab = 'dish'"
      >
        <text>菜品</text>
      </view>
      <view
        class="tab-item"
        :class="{ active: activeTab === 'chef' }"
        @tap="activeTab = 'chef'"
      >
        <text>名厨</text>
      </view>
    </view>

    <!-- 加载状态提示 -->
    <view v-if="isRefreshing" class="refresh-tip">
      <uni-icons type="refresh" size="20" color="#2979ff" />
      <text class="refresh-text">正在刷新...</text>
    </view>

    <view v-if="isLoading" class="refresh-tip">
      <uni-icons type="refresh" size="20" color="#2979ff" />
      <text class="refresh-text">加载中...</text>
    </view>

    <view v-if="!isLoading && list.length > 0" class="list-wrap">
      <uni-list>
        <uni-list-item
          v-for="item in list"
          :key="item.id"
          :title="item.name"
          :note="item.summary"
          :thumb="item.image"
          thumb-size="lg"
          :link="true"
          @click="goDetail(item.id)"
        >
          <template #footer>
            <view class="item-tag">
              <uni-tag :text="item.type === 'dish' ? '菜品' : '名厨'" type="primary" size="small" />
            </view>
          </template>
        </uni-list-item>
      </uni-list>
    </view>

    <view v-else-if="!isLoading" class="empty-state">
      <uni-icons type="info" size="60" color="#ccc" />
      <text class="empty-text">暂无数据</text>
    </view>
  </view>
</template>

<script>
import { exhibitApi } from '@/platform/api.js';

export default {
  name: 'ExhibitList',
  data() {
    return {
      activeTab: 'dish',
      isRefreshing: false,
      isLoading: false,
      list: [],
      total: 0,
      hasMore: false,
      page: 1,
      pageSize: 10,
    };
  },
  watch: {
    activeTab() {
      this.page = 1;
      this.list = [];
      this.loadData();
    },
  },
  onLoad() {
    this.loadData();
  },
  onPullDownRefresh() {
    this.refreshData();
  },
  methods: {
    /**
     * 从 exhibitApi 加载展品列表
     * mock 返回的菜品字段含 history，名厨含 bio，统一映射为 summary
     */
    async loadData() {
      this.isLoading = true;
      try {
        const result = await exhibitApi.getExhibitList({
          type: this.activeTab,
          page: this.page,
          pageSize: this.pageSize,
        });
        const mapped = (result.list || []).map((item) => ({
          id: item.id,
          name: item.name || '',
          summary: item.summary || item.history || item.bio || '',
          image: item.image || item.photo || '',
          type: item.type || this.activeTab,
        }));
        this.list = mapped;
        this.total = result.total || 0;
        this.hasMore = result.hasMore || false;
      } catch (error) {
        uni.showToast({ title: error.message || '数据加载失败', icon: 'none' });
        this.list = [];
      } finally {
        this.isLoading = false;
      }
    },
    goDetail(id) {
      uni.navigateTo({
        url: `/pages/exhibit/detail?id=${id}`,
      });
    },
    async refreshData() {
      this.isRefreshing = true;
      this.page = 1;
      try {
        const result = await exhibitApi.getExhibitList({
          type: this.activeTab,
          page: 1,
          pageSize: this.pageSize,
        });
        const mapped = (result.list || []).map((item) => ({
          id: item.id,
          name: item.name || '',
          summary: item.summary || item.history || item.bio || '',
          image: item.image || item.photo || '',
          type: item.type || this.activeTab,
        }));
        this.list = mapped;
        this.total = result.total || 0;
        this.hasMore = result.hasMore || false;
        uni.showToast({ title: '刷新成功', icon: 'success' });
      } catch (error) {
        uni.showToast({ title: error.message || '刷新失败', icon: 'none' });
      } finally {
        this.isRefreshing = false;
        uni.stopPullDownRefresh();
      }
    },
  },
};
</script>

<style scoped>
.page {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.tab-bar {
  display: flex;
  background-color: #ffffff;
  border-bottom: 1rpx solid #e5e5e5;
}

.tab-item {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 88rpx;
  font-size: 30rpx;
  color: #666666;
  position: relative;
}

.tab-item.active {
  color: #2979ff;
  font-weight: bold;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60rpx;
  height: 6rpx;
  background-color: #2979ff;
  border-radius: 3rpx;
}

.refresh-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx 0;
  background-color: #e8f4ff;
}

.refresh-text {
  margin-left: 10rpx;
  font-size: 28rpx;
  color: #2979ff;
}

.list-wrap {
  padding: 20rpx 0;
}

.item-tag {
  display: flex;
  align-items: center;
  margin-left: 16rpx;
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
</style>
