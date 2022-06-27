<template>
  <div class="update-gender">
   <van-picker
        title="性别"
        show-toolbar
        :columns="columns"
        :default-index="gender"
        @confirm="onConfirm"
        @cancel="$emit('close')"
        @change="onPickerChange"

/>
  </div>
</template>

<script>
import { updateUserName } from '@/api/user'

export default {
  name: 'UpdateGender',
  components: {},
  props: {
    gender: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      columns: ['男', '女'],
      localGender: this.gender
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,
        duration: 0
      })
      try {
        await updateUserName({
          gender: this.localGender
        })
        this.$emit('close')
        this.$toast.success('更新成功')

        this.$emit('update:gender', this.localGender)
      } catch (err) {
        this.$toast.fail('更新失败')
      }
    },
    onPickerChange (picker, value, index) {
      this.localGender = index
    }
  }

}
</script>

<style scoped lang="less"></style>
