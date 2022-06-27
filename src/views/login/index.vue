<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录">
      <van-icon slot="left" name="arrow-left"
      @click="$router.go(-1)"
      color="#fff"/>
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 登录表单 -->
  <van-form @submit="onSubmit" ref="loginForm">
    <van-field
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
      <!-- <i slot="left-icon" class="toutiao toutiao-shouji"></i> (老方式插槽)-->
      <template #left-icon><!-- 新方法 -->
        <i class="toutiao toutiao-shouji"></i>
      </template>
    </van-field>
    <van-field
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
      >
      <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
      <van-count-down slot="button" :time="1000 * 60" format="ss s"
       v-if="isCountDownShow"
       @finish="isCountDownShow = false"/>
      <van-button slot="button" class="send-sms-btn" round size="small" native-type="button"
          @click="onSendSms"
          v-else
          >
        发送验证码
        </van-button>
    </van-field>

    <div class="login-btn-wrap">
      <van-button class="login-btn" block type="info" native-type="submit">
        登录
      </van-button>
    </div>
</van-form>
<!-- /登录表单 -->
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user.js'
export default {
  name: 'LoginPage',
  data () {
    return {
      isCountDownShow: false,
      user: {
        mobile: '',
        code: ''
      },
      userFormRules: {
        mobile: [{
          required: true,
          message: '手机号不能为空！'
        }, {
          pattern: /^1[34578]\d{9}$/,
          message: '手机号格式不正确！'
        }],
        code: [{
          required: true,
          message: '验证码不能为空！'
        }, {
          pattern: /^\d{6}$/,
          message: '验证码格式不正确！'
        }]
      }
    }
  },

  methods: {

    async onSubmit () {
      //* 1.获取表单数据
      const user = this.user
      //*  2. 表单验证
      //* 在组件中必须通过 this.$stoast 来调用 Toast 组件
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, // * 禁用背景点击
        duration: 0 //* 如果为0 则持续展示
      })
      //* 提交表单请求登录
      try {
        const res = await login(user)
        // console.log(res)
        this.$store.commit('setUser', res.data.data)

        //*  提示 success 或者 fail 的时候，会先把其它的 toast 先清除
        this.$toast.success('登录成功！')
        this.$router.push({
          name: 'my'
        })
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('手机号或验证码不正确！', err)
        } else {
          this.$toast.fail('登录失败，请稍后重试！')
        }
      }
    },
    //* 发送验证码
    async onSendSms () {
      //* 1. 校验手机号
      try {
        await this.$refs.loginForm.validate('mobile')
      } catch (err) {
        return console.log('验证失败！')
      }
      //* 2. 验证通过，显示倒计时
      this.isCountDownShow = true
      //* 3. 请求发送验证码
      try {
        // await sendSms(this.user.mobile)
        const res = await sendSms(this.user.mobile)
        console.log(res)
        this.$toast('发送成功！')
      } catch (err) {
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast('发送太频繁了，请稍后重试')
        } else {
          this.$toast('发送失败，请稍后重试')
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.login-container {
  .toutiao {
    font-size:37px;
  }
  .send-sms-btn {
    height: 46px;
    line-height: 46px;
    background-color:#ededed;
    font-size:22px;
    color:#666;
  }
  .login-btn-wrap {
    padding: 53px 33px;
  }
}
</style>
