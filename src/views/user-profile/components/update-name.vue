<template>
  <div class="updateName">
    <!-- 导航栏 -->
    <van-nav-bar
        title="编辑昵称"
        left-text="取消"
        right-text="确定"
        @click-right="changeName"
        @click-left="$emit('close')"
         />
    <!-- /导航栏 -->
    <!-- 输入框 -->
    <div class="field-wrap">
        <van-field
            v-model.trim="userName"
            rows="2"
            autosize
            type="textarea"
            maxlength="7"
            show-word-limit
        />
    </div>
  </div>
</template>

<script>
import { updateUserName } from '@/api/user'
export default {
  name: 'updateName',
  data () {
    return {
      userName: this.name
    }
  },
  props: {
    name: {
      type: String,
      required: true
    }
  },
  methods: {
    async changeName () {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0// 持续展示
      })

      try {
        if (!this.userName.length) {
          this.$toast('昵称不能为空')
          return
        }
        await updateUserName({
          name: this.userName
        })
        // 更新视图
        this.$emit('update:name', this.userName)
        // 关闭弹层
        this.$emit('close')
        // 提示成功
        this.$toast.success('更新成功')
      } catch (err) {
        this.$toast.fait('更新失败')
        console.log(err)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.updateName{
 .field-wrap {
  padding: 20px;
}
}

</style>
