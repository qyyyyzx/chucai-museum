<template>
  <view class="page">
    <!-- 新建打卡区域 -->
    <view class="section">
      <view class="section-title">
        <text>记录此刻</text>
      </view>

      <!-- 照片选择 -->
      <view class="photo-block">
        <view class="photo-grid">
          <view v-for="(image, index) in selectedImages" :key="index" class="photo-item">
            <image :src="image" class="photo-img" mode="aspectFill" @tap="previewImage(index)" />
            <view class="photo-remove" @tap="removeImage(index)">
              <uni-icons type="clear" size="22" color="#e43d33" />
            </view>
          </view>
          <view v-if="selectedImages.length < 3" class="photo-add" @tap="chooseImage">
            <uni-icons type="plusempty" size="36" color="#bbbbbb" />
            <text class="photo-add-text">添加照片</text>
          </view>
        </view>
        <text class="photo-tip">最多选择 3 张照片，保存后以 base64 格式存储</text>
      </view>

      <!-- 打卡感想 -->
      <view class="field-block">
        <text class="field-label">打卡感想</text>
        <uni-easyinput
          v-model="note"
          type="textarea"
          :maxlength="200"
          placeholder="写下你此刻的楚菜体验，例如：第一次见到活水养武昌鱼，太开眼了"
        />
      </view>

      <!-- 打卡地点 -->
      <view class="field-block">
        <text class="field-label">打卡地点</text>
        <uni-easyinput v-model="location" placeholder="例如：楚菜文化数字博物馆 展陈大厅" />
      </view>

      <button class="save-btn" type="primary" :loading="isSaving" @tap="handleSave">
        保存打卡
      </button>
    </view>

    <!-- 历史打卡记录 -->
    <view class="section">
      <view class="section-title">
        <text>我的打卡记录</text>
        <text class="section-count">共 {{ records.length }} 条</text>
      </view>

      <loading-state :visible="isLoading" text="加载打卡记录中..." />

      <view v-if="!isLoading && records.length > 0" class="record-list">
        <uni-card v-for="record in records" :key="record.id" class="record-card">
          <view class="record-head">
            <view class="record-meta">
              <text class="record-time">{{ formatTime(record.createdAt) }}</text>
              <text v-if="record.location" class="record-location">{{ record.location }}</text>
            </view>
            <view class="record-actions">
              <uni-tag text="楚菜打卡" type="primary" size="small" :inverted="true" />
              <view class="record-share" @tap="handleShare(record)">
                <uni-icons type="redo" size="20" color="#2979ff" />
              </view>
              <view class="record-delete" @tap="handleDelete(record)">
                <uni-icons type="trash" size="20" color="#999999" />
              </view>
            </view>
          </view>
          <text v-if="record.note" class="record-note">{{ record.note }}</text>
          <view v-if="record.images.length > 0" class="record-images">
            <image
              v-for="(image, index) in record.images"
              :key="index"
              :src="image"
              class="record-img"
              mode="aspectFill"
              @tap="previewRecordImage(record, index)"
            />
          </view>
        </uni-card>
      </view>

      <view v-else-if="!isLoading" class="empty-state">
        <uni-icons type="camera-filled" size="60" color="#cccccc" />
        <text class="empty-text">还没有打卡记录，拍下你的第一张楚菜瞬间吧</text>
      </view>
    </view>
  </view>
</template>

<script>
import { createCheckin, getCheckinRecords, deleteCheckinRecord } from '@/modules/social/services/checkin-service.js';
import { buildShareText } from '@/modules/social/domain/checkin-record.js';

export default {
  name: 'SocialCheckin',
  data() {
    return {
      selectedImages: [],
      note: '',
      location: '',
      isSaving: false,
      isLoading: false,
      records: [],
    };
  },
  onShow() {
    this.loadRecords();
  },
  /**
   * 微信小程序原生分享：用户点右上角菜单「转发」时触发
   */
  onShareAppMessage() {
    return {
      title: '来楚菜文化数字博物馆，一起打卡楚菜吧',
      path: '/pages/social/checkin',
    };
  },
  methods: {
    /**
     * 选择打卡照片（H5 模式返回 blob URL，保存前会统一转 base64）
     */
    chooseImage() {
      const remain = 3 - this.selectedImages.length;
      uni.chooseImage({
        count: remain,
        sizeType: ['compressed'],
        success: (res) => {
          this.selectedImages = this.selectedImages.concat(res.tempFilePaths || []);
        },
      });
    },
    /**
     * 从待保存列表移除一张照片
     */
    removeImage(index) {
      this.selectedImages.splice(index, 1);
    },
    /**
     * 预览待保存的照片
     */
    previewImage(index) {
      uni.previewImage({
        current: index,
        urls: this.selectedImages,
      });
    },
    /**
     * 预览历史记录里的照片
     */
    previewRecordImage(record, index) {
      uni.previewImage({
        current: index,
        urls: record.images,
      });
    },
    /**
     * 保存打卡记录：blob URL 转 base64 后写入 localStorage
     */
    async handleSave() {
      if (this.isSaving) {
        return;
      }
      if (!this.note.trim() && this.selectedImages.length === 0) {
        uni.showToast({ title: '请填写感想或选择照片', icon: 'none' });
        return;
      }

      this.isSaving = true;
      try {
        await createCheckin({
          note: this.note,
          images: this.selectedImages,
          location: this.location,
        });
        uni.showToast({ title: '打卡成功', icon: 'success' });
        this.note = '';
        this.location = '';
        this.selectedImages = [];
        this.loadRecords();
      } catch (error) {
        uni.showToast({ title: error.message || '保存失败', icon: 'none' });
      } finally {
        this.isSaving = false;
      }
    },
    /**
     * 加载历史打卡记录
     */
    loadRecords() {
      this.isLoading = true;
      try {
        this.records = getCheckinRecords();
      } catch (error) {
        uni.showToast({ title: '记录加载失败', icon: 'none' });
        this.records = [];
      } finally {
        this.isLoading = false;
      }
    },
    /**
     * 分享一条打卡记录：生成分享文案并复制到剪贴板
     * H5 端可粘贴到任意社交平台；微信端还可用右上角菜单原生转发
     */
    handleShare(record) {
      const text = buildShareText(record);
      uni.setClipboardData({
        data: text,
        success: () => {
          uni.showToast({ title: '分享文案已复制，去粘贴吧', icon: 'none' });
        },
        fail: () => {
          uni.showToast({ title: '复制失败，请重试', icon: 'none' });
        },
      });
    },
    /**
     * 确认后删除一条打卡记录
     */
    handleDelete(record) {
      uni.showModal({
        title: '删除打卡',
        content: '确定删除这条打卡记录吗？删除后不可恢复。',
        confirmText: '删除',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            const removed = deleteCheckinRecord(record.id);
            if (removed) {
              uni.showToast({ title: '已删除', icon: 'success' });
            } else {
              uni.showToast({ title: '记录不存在', icon: 'none' });
            }
            this.loadRecords();
          }
        },
      });
    },
    /**
     * 格式化时间显示
     */
    formatTime(isoString) {
      if (!isoString) {
        return '';
      }
      const date = new Date(isoString);
      if (Number.isNaN(date.getTime())) {
        return isoString;
      }
      const pad = (n) => String(n).padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    },
  },
};
</script>

<style scoped>
.page {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 20rpx;
}

.section {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.section-count {
  font-size: 26rpx;
  font-weight: normal;
  color: #999999;
}

.photo-grid {
  display: flex;
  flex-wrap: wrap;
}

.photo-item {
  position: relative;
  width: 200rpx;
  height: 200rpx;
  margin: 0 16rpx 16rpx 0;
}

.photo-img {
  width: 100%;
  height: 100%;
  border-radius: 12rpx;
}

.photo-remove {
  position: absolute;
  top: -12rpx;
  right: -12rpx;
  background-color: #ffffff;
  border-radius: 50%;
}

.photo-add {
  width: 200rpx;
  height: 200rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2rpx dashed #cccccc;
  border-radius: 12rpx;
  box-sizing: border-box;
}

.photo-add-text {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #999999;
}

.photo-tip {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #999999;
}

.field-block {
  margin-top: 24rpx;
}

.field-label {
  display: block;
  font-size: 28rpx;
  color: #333333;
  margin-bottom: 12rpx;
}

.save-btn {
  margin-top: 32rpx;
}

.record-list {
  display: flex;
  flex-direction: column;
}

.record-card {
  margin-bottom: 16rpx;
}

.record-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12rpx;
}

.record-meta {
  display: flex;
  flex-direction: column;
}

.record-time {
  font-size: 24rpx;
  color: #999999;
}

.record-location {
  margin-top: 4rpx;
  font-size: 24rpx;
  color: #2979ff;
}

.record-actions {
  display: flex;
  align-items: center;
}

.record-share {
  margin-left: 16rpx;
  padding: 8rpx;
}

.record-delete {
  margin-left: 16rpx;
  padding: 8rpx;
}

.record-note {
  display: block;
  font-size: 28rpx;
  color: #333333;
  line-height: 1.6;
}

.record-images {
  display: flex;
  flex-wrap: wrap;
  margin-top: 16rpx;
}

.record-img {
  width: 200rpx;
  height: 200rpx;
  border-radius: 12rpx;
  margin: 0 16rpx 16rpx 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 0;
}

.empty-text {
  margin-top: 20rpx;
  font-size: 26rpx;
  color: #999999;
}
</style>
