<template>
<!-- 收藏 -->
<van-icon
        :color="value ? '#ffa500' : ''"
        :name="value ? 'star' : 'star-o'"
        @click="onCollect"
        :loading="loading"
      />
</template>

<script>
import { addCollect, deleteCollect } from '@/api/article'
export default {
  name: 'CollextArticle',
  data () {
    return {
      loading: false
    }
  },
  props: {
    value: {
      type: Boolean,
      required: true
    },
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },
  methods: {
    async onCollect () {
      this.loading = true
      try {
        if (this.value) {
          await deleteCollect(this.articleId)
        } else {
          await addCollect(this.articleId)
        }
        this.$emit('input', !this.value)
        this.$toast.success(!this.value ? '收藏成功' : '取消收藏')
      } catch (err) {
        this.$toast('操作失败')
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less">

</style>
