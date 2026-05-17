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

    <view v-if="currentList.length > 0" class="list-wrap">
      <uni-list>
        <uni-list-item
          v-for="item in currentList"
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

    <view v-else class="empty-state">
      <uni-icons type="info" size="60" color="#ccc" />
      <text class="empty-text">暂无数据</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ExhibitList',
  data() {
    return {
      activeTab: 'dish',
      dishes: [
        {
          id: 1,
          name: '武昌鱼',
          summary: '楚菜经典名菜，清蒸武昌鱼，肉质鲜嫩，汤汁清香',
          image: '/static/exhibit/wuchangyu.jpg',
          type: 'dish'
        },
        {
          id: 2,
          name: '排骨藕汤',
          summary: '湖北家家户户的传统汤品，藕粉糯、排骨酥烂',
          image: '/static/exhibit/paigulotang.jpg',
          type: 'dish'
        },
        {
          id: 3,
          name: '沔阳三蒸',
          summary: '蒸菜、蒸鱼、蒸肉，湖北沔阳传统蒸菜技艺',
          image: '/static/exhibit/mianyang.jpg',
          type: 'dish'
        },
        {
          id: 4,
          name: '红菜薹炒腊肉',
          summary: '武汉冬季时令名菜，红菜薹脆嫩、腊肉咸香',
          image: '/static/exhibit/hongcaitai.jpg',
          type: 'dish'
        },
        {
          id: 5,
          name: '潜江油焖大虾',
          summary: '潜江特色小龙虾，麻辣鲜香，色泽红亮',
          image: '/static/exhibit/qianjiangxia.jpg',
          type: 'dish'
        },
        {
          id: 6,
          name: '黄陂三合',
          summary: '肉丸、鱼丸、肉糕三合一，黄陂传统宴席菜',
          image: '/static/exhibit/huangpi.jpg',
          type: 'dish'
        },
        {
          id: 7,
          name: '东坡肉',
          summary: '苏东坡谪居黄州时所创，肥而不腻、入口即化',
          image: '/static/exhibit/dongporou.jpg',
          type: 'dish'
        },
        {
          id: 8,
          name: '荆沙甲鱼',
          summary: '荆州传统名菜，甲鱼软糯、汤汁浓郁',
          image: '/static/exhibit/jingsha.jpg',
          type: 'dish'
        },
        {
          id: 9,
          name: '钟祥蟠龙菜',
          summary: '钟祥宫廷菜，色泽鲜艳、造型似龙',
          image: '/static/exhibit/panlongcai.jpg',
          type: 'dish'
        },
        {
          id: 10,
          name: '珍珠丸子',
          summary: '糯米裹肉丸，晶莹剔透如珍珠，湖北蒸菜代表',
          image: '/static/exhibit/zhenzhuwanzi.jpg',
          type: 'dish'
        }
      ],
      chefs: [
        {
          id: 101,
          name: '卢永良',
          summary: '中国烹饪大师，楚菜非遗传承人，擅长传统楚菜技法',
          image: '/static/exhibit/chef-lu.jpg',
          type: 'chef'
        },
        {
          id: 102,
          name: '孙昌弼',
          summary: '鄂菜泰斗，深耕楚菜数十年，培养大批楚菜人才',
          image: '/static/exhibit/chef-sun.jpg',
          type: 'chef'
        },
        {
          id: 103,
          name: '余明社',
          summary: '中国烹饪大师，潜江油焖大虾技艺推广者',
          image: '/static/exhibit/chef-yu.jpg',
          type: 'chef'
        },
        {
          id: 104,
          name: '邹志平',
          summary: '楚菜名厨，专注湖北地方菜研究与创新',
          image: '/static/exhibit/chef-zou.jpg',
          type: 'chef'
        },
        {
          id: 105,
          name: '喻少林',
          summary: '中式烹调高级技师，传承沔阳三蒸技艺',
          image: '/static/exhibit/chef-yu2.jpg',
          type: 'chef'
        }
      ]
    }
  },
  computed: {
    currentList() {
      return this.activeTab === 'dish' ? this.dishes : this.chefs
    }
  },
  methods: {
    goDetail(id) {
      uni.navigateTo({
        url: `/pages/exhibit/detail?id=${id}`
      })
    }
  }
}
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
