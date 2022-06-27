<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
    class="page-nav-bar"
    title="个人信息"
    left-arrow
    @click-left="$router.back()" />
    <!-- /导航栏 -->

    <input type="file" hidden ref="file" @change="onFileChange">

    <van-cell title="头像" is-link @click="$refs.file.click()">
      <van-image
        class="avatar"
        fit="cover"
        round
        :src="user.photo"
      />
    </van-cell>
    <van-cell title="昵称" :value="user.name" is-link @click="isShowUpdateName = true"/>
    <van-cell title="性别" :value="user.gender===0 ? '男' : '女'" is-link @click="isUpdateGenderShow = true"/>
    <van-cell title="生日" :value="user.birthday" is-link @click="isUpdateBirthdayShow = true" />
    <!-- 编辑昵称弹层 -->
    <van-popup
        v-model="isShowUpdateName"
        style="height: 100%"
        position="bottom"
    >
      <!-- 编辑昵称 -->
        <UpdateName
         @close="isShowUpdateName = false"
         :name.sync="user.name"
         v-if="isShowUpdateName"
        />
    </van-popup>
    <!-- 编辑昵称弹层 -->

    <!-- 编辑性别 -->
    <van-popup
      v-model="isUpdateGenderShow"
      position="bottom"
    >
      <update-gender
       v-if="isUpdateGenderShow"
       @close="isUpdateGenderShow=false"
       :gender.sync="user.gender"
      />
    </van-popup>
    <!-- /编辑性别 -->

     <!-- 编辑生日 -->
    <van-popup
      v-model="isUpdateBirthdayShow"
      position="bottom"
    >
      <update-birthday
       v-if="isUpdateBirthdayShow"
       @close="isUpdateBirthdayShow=false"
       :birth.sync="user.birthday"
      />
    </van-popup>
    <!-- /编辑生日 -->

    <!-- 编辑头像 -->
    <van-popup
      v-model="isUpdatePhotoShow"
      position="bottom"
      style="height:100%"
    >
    <UpdatePhoto
    :img="img"
    v-if="isUpdatePhotoShow"
    @close="isUpdatePhotoShow = false"
    @update-photo="user.photo = $event"/>
    </van-popup>
    <!-- /编辑头像 -->
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name.vue'
import UpdateGender from './components/update-gender'
import UpdateBirthday from './components/update-birthday'
import UpdatePhoto from './components/update-photo'
export default {
  name: 'UserProfile',
  data () {
    return {
      user: {}, //* 用户个人信息
      isShowUpdateName: false,
      isUpdateGenderShow: false,
      isUpdateBirthdayShow: false,
      isUpdatePhotoShow: false,
      img: null// 预览的图片

    }
  },
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },
  created () {
    this.loadProfile()
  },
  methods: {
    async loadProfile () {
      try {
        const { data } = await getUserProfile()
        this.user = data.data
      } catch (err) {
        this.$toast('获取用户个人信息失败')
      }
    },
    onFileChange () {
      const file = this.$refs.file.files[0]
      this.img = window.URL.createObjectURL(file)
      this.isUpdatePhotoShow = true
    }

  }
}
</script>

<style scoped lang='less'>
.user-profile {
   /deep/ .van-nav-bar__arrow{
        color:#fff;
    }
  .avatar {
    width: 60px;
    height: 60px;
  }
   .van-popup {
    background-color: #f5f7f9;
  }
}
</style>
