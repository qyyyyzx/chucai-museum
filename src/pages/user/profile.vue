<template>
  <view class="page">

    <!-- 头像 + 只读信息区 -->
    <view class="profile-header">
      <view class="avatar-wrap">
        <image
          v-if="user.avatar"
          :src="user.avatar"
          class="avatar-img"
          mode="aspectFill"
        />
        <view v-else class="avatar-placeholder">
          <text v-if="user.nickname" class="avatar-letter">{{ user.nickname.charAt(0) }}</text>
        </view>
      </view>
      <text class="header-nickname">{{ user.nickname || '游客' }}</text>
      <text v-if="isLoggedIn && user.openid" class="header-meta">openid：{{ user.openid }}</text>
      <text v-if="isLoggedIn && user.createdAt" class="header-meta">注册时间：{{ formatDate(user.createdAt) }}</text>
      <text v-if="!isLoggedIn" class="hint-text">填写昵称后保存即可完成首次登录</text>
    </view>

    <!-- 编辑区 -->
    <view class="section">
      <view class="field-block">
        <text class="field-label">昵称</text>
        <uni-easyinput
          v-model="editNickname"
          placeholder="请输入昵称"
          :maxlength="20"
        />
      </view>
      <view class="field-block">
        <text class="field-label">头像 URL</text>
        <uni-easyinput
          v-model="editAvatar"
          placeholder="请输入头像图片 URL（选填）"
          :maxlength="500"
        />
      </view>
    </view>

    <!-- 保存按钮 -->
    <view class="btn-wrap">
      <button class="save-btn" type="primary" :loading="isSaving" @tap="handleSave">
        保存
      </button>
    </view>

    <!-- 退出登录按钮：已登录才显示 -->
    <view v-if="isLoggedIn" class="btn-wrap">
      <button class="logout-btn" type="warn" @tap="handleLogout">
        退出登录
      </button>
    </view>

  </view>
</template>

<script>
import {
  getCurrentUser,
  login,
  updateUser,
  logout,
} from '@/modules/user/services/auth-service.js';

export default {
  name: 'UserProfile',
  data() {
    return {
      /** 当前登录用户对象，未登录时各字段为默认空值 */
      user: {
        nickname: '',
        avatar: '',
        openid: '',
        createdAt: '',
      },
      /** 是否已登录 */
      isLoggedIn: false,
      /** 编辑框：昵称 */
      editNickname: '',
      /** 编辑框：头像 URL */
      editAvatar: '',
      /** 保存中状态，防止重复提交 */
      isSaving: false,
    };
  },
  async onShow() {
    await this.loadUser();
  },
  methods: {
    /**
     * 从 auth-service 拉取当前用户，初始化页面数据
     */
    async loadUser() {
      try {
        const current = await getCurrentUser();
        if (current) {
          this.isLoggedIn = true;
          this.user = {
            nickname: current.nickname || '',
            avatar: current.avatar || '',
            openid: current.openid || '',
            createdAt: current.createdAt || '',
          };
          this.editNickname = this.user.nickname;
          this.editAvatar = this.user.avatar;
        } else {
          this.isLoggedIn = false;
          this.user = { nickname: '', avatar: '', openid: '', createdAt: '' };
          this.editNickname = '';
          this.editAvatar = '';
        }
      } catch (error) {
        uni.showToast({ title: '加载用户信息失败', icon: 'none' });
      }
    },
    /**
     * 保存：未登录调 login，已登录调 updateUser
     * 保存完毕后刷新页面展示数据，留在当前页
     */
    async handleSave() {
      if (this.isSaving) {
        return;
      }
      if (!this.editNickname.trim()) {
        uni.showToast({ title: '昵称不能为空', icon: 'none' });
        return;
      }
      this.isSaving = true;
      try {
        const current = await getCurrentUser();
        if (current === null) {
          await login({ nickname: this.editNickname, avatar: this.editAvatar });
        } else {
          await updateUser({ nickname: this.editNickname, avatar: this.editAvatar });
        }
        uni.showToast({ title: '保存成功', icon: 'success' });
        await this.loadUser();
      } catch (error) {
        uni.showToast({ title: error.message || '保存失败', icon: 'none' });
      } finally {
        this.isSaving = false;
      }
    },
    /**
     * 退出登录：二次确认后调 logout，清空页面数据
     */
    handleLogout() {
      uni.showModal({
        title: '退出登录',
        content: '确定要退出登录吗？',
        confirmText: '退出',
        cancelText: '取消',
        success: async (res) => {
          if (res.confirm) {
            try {
              await logout();
              this.isLoggedIn = false;
              this.user = { nickname: '', avatar: '', openid: '', createdAt: '' };
              this.editNickname = '';
              this.editAvatar = '';
              uni.showToast({ title: '已退出登录', icon: 'success' });
            } catch (error) {
              uni.showToast({ title: '退出失败，请重试', icon: 'none' });
            }
          }
        },
      });
    },
    /**
     * 将 ISO 8601 时间字符串格式化为 yyyy-MM-dd
     * @param {string} isoString
     * @returns {string}
     */
    formatDate(isoString) {
      if (!isoString) {
        return '';
      }
      const date = new Date(isoString);
      if (Number.isNaN(date.getTime())) {
        return isoString;
      }
      const pad = (n) => String(n).padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
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

/* 头像 + 只读信息区 */
.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 48rpx 24rpx 36rpx;
  margin-bottom: 24rpx;
}

.avatar-wrap {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 24rpx;
}

.avatar-img {
  width: 100%;
  height: 100%;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background-color: #c8a97e;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-letter {
  font-size: 64rpx;
  color: #ffffff;
  font-weight: bold;
  line-height: 1;
}

.header-nickname {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 12rpx;
}

.header-meta {
  font-size: 24rpx;
  color: #999999;
  margin-top: 8rpx;
}

.hint-text {
  font-size: 24rpx;
  color: #c8a97e;
  margin-top: 16rpx;
}

/* 编辑区 */
.section {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
}

.field-block {
  margin-bottom: 24rpx;
}

.field-block:last-child {
  margin-bottom: 0;
}

.field-label {
  display: block;
  font-size: 28rpx;
  color: #333333;
  margin-bottom: 12rpx;
}

/* 按钮区 */
.btn-wrap {
  margin-bottom: 24rpx;
}

.save-btn {
  width: 100%;
}

.logout-btn {
  width: 100%;
}
</style>
