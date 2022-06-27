<template>
<!-- 关注 -->
  <van-button
            v-if="isFollowed"
            class="follow-btn"
            round
            size="small"
            @click="follow"
            :loading="FollowLoading"
          >已关注</van-button>
          <van-button
            v-else
            class="follow-btn"
            type="info"
            color="#3296fa"
            round
            size="small"
            icon="plus"
            @click="follow"
            :loading="FollowLoading"
          >关注</van-button>
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'
export default {
  name: 'FolloUser',
  data () {
    return {
      FollowLoading: false
    }
  },
  // 自定义 v-model 的数据名称
  // model: {
  //   prop: 'isFollowed', // 默认是 value
  //   event: 'update-is_followed' // 默认是 input
  // },
  props: {
    isFollowed: {
      type: Boolean,
      required: true,
      default: false
    },
    userId: {
      type: [Number, String, Object],
      required: true
    }

  },
  methods: {
    async follow () {
      // 开启按钮的 loading 状态
      this.FollowLoading = true
      try {
        if (this.isFollowed) {
          // 已关注，取消关注
          await deleteFollow(this.userId)
          // this.article.is_followed = false
        } else {
          // 没有关注，添加关注
          await addFollow(this.userId)
          // this.article.is_followed = true
        }
        // 更新视图状态
        // this.article.is_followed = !this.article.is_followed
        this.$emit('update:isFollowed', !this.isFollowed)
      } catch (err) {
        console.log(err)
        if (err.response && err.response.status === 400) {
          this.$toast.fail('你不能关注你自己！')
          this.FollowLoading = false
          return
        }
        this.$toast.fail('操作失败')
      }
      // 关闭按钮的 loading 状态
      this.FollowLoading = false
    }
  }
}
</script>

<style>

</style>
