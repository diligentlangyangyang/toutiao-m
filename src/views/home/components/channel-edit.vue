/* eslint-disable vue/no-mutating-props */
/* eslint-disable vue/no-mutating-props */
<template>
  <div class="channel-edit">
  <!-- 我的频道 -->
    <van-cell :border="false">
        <template #title>
            <div class="title-text">我的频道</div>
        </template>
        <van-button
            class="edit-btn"
            size="mini"
            round
            plain
            @click="isEdit=!isEdit"
            >{{isEdit ? '完成' : '编辑'}}
        </van-button>
    </van-cell>
    <van-grid class="my-grid" :gutter="10">
        <van-grid-item
            class="grid-item"
            v-for="(value,index) in myChannels"
            :key="value.id"
            @click="onMyChannelClick(index,value)"
            >
            <template #text>
              <van-icon v-show="isEdit && value.id!=0" name="close"></van-icon>
                <span class="text" :class="{active:index===active}">
                    {{value.name}}
                </span>
            </template>
        </van-grid-item>
    </van-grid>
 <!-- /我的频道 -->
 <!-- 频道推荐 -->
    <van-cell :border="false">
       <template #title>
            <div class="title-text">频道推荐</div>
        </template>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
        <van-grid-item
          class="grid-item"
          v-for="channel in recommendChannels"
          :key="channel.id"
          icon="plus"
          :text="channel.name"
          @click="onAddChannel(channel)"

        />
    </van-grid>
<!-- /频道推荐 -->
  </div>
</template>

<script>
import { getAllChannel, addUserChannel, delUserChanel } from '@/api/article'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  data () {
    return {
      allChannel: [],
      isEdit: false
    }
  },
  props: {
    myChannels: {
      type: Array,
      require: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  created () {
    this.getAllChannelDate()
  },

  computed: {
    //* 获取user
    ...mapState(['user']),
    //* 推荐频道  所有频道 - 用户频道 = 推荐频道
    //* 计算属性会检测内部依赖数据变化而变化
    recommendChannels () {
      return this.allChannel.filter(channel => !this.myChannels.some(mychannel => mychannel.id === channel.id))
    }
    /*   const mychannel = this.myChannels.find(myChannel => {
          return myChannel.id === channel.id
        })
        return !mychannel */
  },
  methods: {
    async getAllChannelDate () { //* 获取频道列表数据
      try {
        const { data } = await getAllChannel()
        this.allChannel = data.data.channels
      } catch (err) {
        console.log(err)
        this.$toast('获取频道列表数据失败')
      }
    },
    async onAddChannel (v) { //* 添加频道
      // eslint-disable-next-line vue/no-mutating-props
      this.myChannels.push(v)
      //* 数据持久化
      if (this.user) {
        //* 已登录，把数据请求接口放到线上
        try {
          await addUserChannel({
            id: v.id, //* 频道 id
            seq: this.myChannels.length //* 频道的 序号
          })
          this.$toast('添加成功')
        } catch (err) {
          this.$toast('添加失败')
        }
      } else {
        //* 未登录，把数据存储到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    onMyChannelClick (i, v) {
      if (this.isEdit) { //* 执行删除操作
      //* 1. 如果删除项为推荐 则不删除
        if (v.id === 0) return
        if (i <= this.active) { //* 删除不隐藏弹出层
        //* 3. 若删除的是激活频道之前的频道，这更新激活的频道项
          this.$emit('update-active', this.active - 1, true)
        }
        // eslint-disable-next-line vue/no-mutating-props
        this.myChannels.splice(i, 1)//* 2. 删除频道项

        //* 4. 处理数据持久化
        this.delChannel(v)
      } else {
        //* 执行跳转操作
        this.$emit('update-active', i, false)
      }
    },
    async delChannel (v) {
      try {
        if (this.user) {
          // 已登录，将数据存储到线上
          await delUserChanel(v.id)
        } else {
          // 未登录，将数据存储到本地
          setItem('TOUTIAO_CHANNELS', this.mychannels)
        }
      } catch (err) {
        this.$toast('删除频道失败，请稍后重试')
      }
    }

  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;

  .title-text {
    font-size: 32px;
    color: #333333;
  }

  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }

  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text, .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .van-icon-close{
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
