<template>
<!-- 点赞 -->
  <van-icon
        :color="(value == 1 || value == -1) || (!value == 'undefined') ? (value==1 ? 'red': '') : (comment.is_liking ? 'red' : '')"
        :name="value == 1 ? 'good-job' : 'good-job-o'"
        @click="onLike(likeStatus)"
        :loading='loading'
          >
          <slot name="count"></slot>
  </van-icon>

</template>

<script>
import { addLike, deleteLike } from '@/api/article'
import { addCommentLike, deleteCommentLike } from '@/api/comment'
export default {
  name: 'LikeArticle',
  data () {
    return {
      loading: false
    }
  },
  props: {
    value: {
      type: Number
      // required: true
    },
    articleId: {
      type: [Number, Object, String]
      // required: true
    },
    likeStatus: {
      type: String,
      require: true
    },
    comment: {
      type: Object,
      Required: true
    }
  },
  methods: {
    async onLike (onStatus) {
      this.loading = true
      if (onStatus === 'wen') {
        try {
          let status = -1
          if (this.value === 1) {
            await deleteLike(this.articleId)
          } else {
            await addLike(this.articleId)
            status = 1
          }
          this.$emit('input', status)
          this.$toast.success(status === 1 ? '点赞成功' : '取消点赞')
        } catch (err) {
          this.$toast('操作失败')
        }
      } else {
        try {
          if (this.comment.is_liking) {
          // 如果已经赞了则取消点赞
            await deleteCommentLike(this.comment.com_id)
            // eslint-disable-next-line vue/no-mutating-props
            this.comment.like_count--
          } else {
          // 如果没有赞，则点赞
            await addCommentLike(this.comment.com_id)
            // eslint-disable-next-line vue/no-mutating-props
            this.comment.like_count++
          }
          // eslint-disable-next-line vue/no-mutating-props
          this.comment.is_liking = !this.comment.is_liking
        } catch (err) {
          this.$toast('操作失败')
        }
      }
      this.loading = false
    }

  }
}
</script>

<style scoped>

</style>
