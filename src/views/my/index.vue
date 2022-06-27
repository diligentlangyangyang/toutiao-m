<template>
  <div class="my-container">
    <!-- 已登录头部 -->
    <div class="header user-info"
    v-if="user">
      <div class="base-info">
        <div class="left">
          <van-image
              round
              class="avatar"
              fit="cover"
              :src="userInfo.photo"
            />
            <span class="name">{{userInfo.name}}</span>
        </div>
        <div class="right">
          <van-button round size="mini" :to="{name:'user'}">编辑资料</van-button>
        </div>
      </div>
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{userInfo.art_count}}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.follow_count}}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.fans_count}}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
        <span class="count">{{userInfo.like_count}}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <!-- /已登录头部 -->

    <!-- /未登录头部 -->
    <div class="header not-login" v-else>
      <div class="login-btn" @click="login_btn">
        <img class="mobile-img" src="~@/assets/mobile.png" alt="">
        <span class="text">登录 / 注册</span>
      </div>
    </div>
    <!-- /未登录头部 -->

    <!-- 宫格导航 -->
    <van-grid :column-num="2" class="grid-nav mb-9" clickable>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-shoucang"></i>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-lishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>
    <!-- /宫格导航 -->

    <van-cell  title="消息通知" is-link />
    <van-cell title="小智同学" is-link />
    <van-cell title="退出登录"
    v-if="user"
    class="logout-cell"
    @click="onLogout"
    clickable/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user'
export default {
  data () {
    return {
      userInfo: {} //* 用户信息
    }
  },
  computed: {
    ...mapState(['user'])
  },
  name: 'MyPage',
  created () {
    //* 如果用户登录了，则请求加载用户信息数据
    if (this.user) {
      this.loadUser()
    }
  },
  methods: {
    login_btn () {
      this.$router.push({
        name: 'login'
      })
    },
    async onLogout () {
      // 退出提示
      // 在组件中需要使用 this.$dialog 来调用弹框组件
      await this.$dialog.confirm({
        title: '退出提示',
        message: '确认退出吗'
      })
      this.$store.commit('setUser', null)
    },
    async loadUser () {
      try {
        const res = await getUserInfo()
        this.userInfo = res.data.data
        // console.log(res.data)
      } catch (err) {
        this.$toast('获取数据失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.my-container {
  // 未登录
  .header {
    height:361px;
    background:url("~@/assets/banner.png");
    background-size:cover;
  }
  .not-login {
     display :flex;
     justify-content: center;
     align-items: center;
     .login-btn {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .mobile-img {
           width: 132px;
           height: 132px;
           margin-bottom:15px;
        }
        .text {
          font-size:28px;
          color:#fff;
        }

     }
  }
  // 已登录
  .user-info {
    .base-info {
      height:231px;
      padding: 76px 32px 23px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        .avatar {
          width: 132px;
          height :132px;
          border: 4px solid #fff;
          margin-right: 23px;
        }
        .name {
          font-size:30px;
          color:#fff;
        }
      }
    }
    .data-stats {
      display: flex;
      .data-item {
        height: 130px;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color:#fff;
        .count {
          font-size: 36px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }
    .grid-nav {
      .grid-item {
        height: 141px;
        i.toutiao {
          font-size:45px;
        }
        .toutiao-shoucang {
          color:#eb5253;
        }
        .toutiao-lishi {
          color:#ff9d1d;
        }
        span.text {
          font-size:28px;
        }
      }
     }
      .logout-cell {
        text-align: center;
        color:#d86262;
        margin-top:9px;
      }
      .mb-9 {
        margin-bottom: 9px;
      }

}
</style>
