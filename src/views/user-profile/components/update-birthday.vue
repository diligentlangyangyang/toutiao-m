<template>
  <div class="update-birthday">
    <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="出生日期"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="$emit('close')"
        @confirm="onConfirm"
        />
  </div>
</template>

<script>
import { updateUserName } from '@/api/user'
import dayjs from 'dayjs'
export default {
  name: 'UpdateBirthday',
  data () {
    return {
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.birth)
    }
  },
  props: {
    birth: {
      type: String,
      required: true
    }
  },
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,
        duration: 0
      })
      try {
        const currentDate = dayjs(this.currentDate).format('YYYY-MM-DD')
        await updateUserName({
          birthday: currentDate
        })
        this.$emit('close')
        this.$toast.success('更新成功')

        this.$emit('update:birth', currentDate)
      } catch (err) {
        this.$toast.fail('更新失败')
      }
    }
  }
}
</script>

<style>

</style>
