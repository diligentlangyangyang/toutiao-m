<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed >
      <van-button
       class="search-btn"
       slot="title"
       icon="search"
       size="small"
       round
       :to="{name:'search'}"
       >搜索</van-button>
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 头部列表 -->
    <van-tabs class="channer-tabs" v-model="active" animated swipeable swipe-threshold="3">
      <van-tab

      v-for="item in chanels"
      :key="item.id"
      :title="item.name">
      <!-- 列表内容 -->
        <ArticleList
          :chanel="item"/>
      <!-- /列表内容 -->
      </van-tab>
      <template #nav-right>
        <div class="placeholder"></div>
        <div class="hamburger-btn">
          <i class="toutiao toutiao-gengduo" @click="isEditChannelShow=true"></i>
        </div>
      </template>
    </van-tabs>
    <!-- /头部列表 -->

    <!-- 频道编辑弹出层 -->
    <van-popup
      round
      v-model="isEditChannelShow"
      closeable
      position="bottom"
      close-icon-position="top-left"
      :style="{ height: '98%' }"
      >
      <!-- 频道编辑内容 -->
        <ChannelEdit
          :active="active"
          :myChannels="chanels"
          @update-active="onUpdateActive"/>
      <!-- /频道编辑内容 -->
    </van-popup>
    <!-- /频道编辑弹出层 -->
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user.js'
import ArticleList from './components/article-list.vue'
import ChannelEdit from './components/channel-edit.vue'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage.js'
export default {
  name: 'HomePage',
  data () {
    return {
      chanels: [], //* 频道列表
      isEditChannelShow: false,
      active: 0
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created () {
    this.loadChanels()
  },
  methods: {
    async loadChanels () {
    //   try {
    //     const { data } = await getUserChannels()
    //     this.chanels = data.data.channels
    //   } catch (err) {
    //     this.$toast('获取频道列表数据失败')
    //   }
    // },
      //* 优化loadChannels
      //     async loadChannels () {
      //     try {
      //         let channles = []
      //         const localChannels = getItem('TOUTIAO_CHANNELS')
      //         if (this.user || !localChannels) {
      // 登录 或者 本地没有存储 获取后端数据
      //             const { data } = await getUserChannels()
      //             this.channels = data.data.channels
      //             return false
      //         } else {
      // 未登录并且本地没有数据
      //             channles = localChannels
      //         }
      //         this.channels = channles
      //     } catch (err) {
      //         this.$toast('获取频道列表数据失败')
      //     }
      // }

      try {
        let channels = []
        if (this.user) {
          //* 已登录，请求获取线上的频道数据
          const { data } = await getUserChannels()
          channels = data.data.channels
        } else {
          //* 未登录，判断是否有本地的频道列表数据
          //* 有：拿来既用
          const localChannels = getItem('TOUTIAO_CHANNELS')
          if (localChannels) {
            channels = localChannels
          } else {
            //* 没有：请求获取默认频道数据
            const { data } = await getUserChannels()
            console.log(123)
            channels = data.data.channels
          }
        }
        //* 将数据更新到组件中
        this.chanels = channels
      } catch (err) {
        console.log(err)
        this.$toast('数据频道列表失败！')
      }
    },

    onUpdateActive (index, isEditChannelShow = true) {
      this.active = index
      this.isEditChannelShow = isEditChannelShow //* 弹出层隐藏
    }
  },
  components: {
    ArticleList,
    ChannelEdit
  }
}
</script>

<style scoped lang="less">
.home-container {
  padding:100px 0;
 /deep/ .van-nav-bar__title {
    max-width: unset;
    // max-width: none;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color:#5babfb;
    border: none;
    font-size:28px;
    color:#fff;
    .van-icon {
      font-size:32px;
      color:#fff;
    }
  }
  ::v-deep .channer-tabs {
    .van-tab {
      border-right:1px solid #edeff3;
      min-width:200px;
      height: 80px;
      .van-tab__text {
        font-size:27px;
        color:#777777;
      }
    }
    .van-tab--active .van-tab__text{
      color:#333 !important;
    }
    .van-tabs__line {
      width: 31px !important;
      height: 6px;
      background:rgba(50,150,250,1);
    }
    .van-tabs__nav--complete {
      padding-bottom: 15px;
    }
     .placeholder{
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }
    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity:.902;
      i.toutiao {
        font-size: 33px;
      }
      &:before {
        content: '';
        position: absolute;
        left: 0;
        width: 1px;
        height: 100%;
        background-image: url('~@/assets/gradient-gray-line.png');
        background-size: contain;
      }
    }
  }
}

</style>
