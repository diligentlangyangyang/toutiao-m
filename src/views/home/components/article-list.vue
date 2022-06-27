<template>
  <div class="article-container">
    <van-pull-refresh
    :success-text="refreshSuccessText"
    :success-duration="1500"
     v-model="isRefreshLoading"
     @refresh="onRefresh">
        <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
        >
        <!-- 文章列表内容 -->
          <!-- <van-cell
          v-for="item in articlesList"
          :key="item.art_id"
          :title="item.title"
        /> -->
        <ArticleItem
          v-for="(item,index) in articlesList"
          :key="index"
          :article="item"/>
        <!-- /文章列表内容 -->
        </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item/index.vue'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    chanel: {
      type: Object,
      required: true
    }

  },
  data () {
    return {
      loading: false,
      finished: false,
      articlesList: [], //* 文章列表数据
      timestamp: null, //* 请求下一页数据的时间戳
      error: false, //* 是否加载失败
      isRefreshLoading: false,
      refreshSuccessText: ''
    }
  },
  methods: {
    async onLoad () {
      // 异步更新数据
      try {
        //* 1. 请求获取数据
        const { data } = await getArticles({
          channel_id: this.chanel.id,
          timestamp: this.timestamp || Date.now()
        })
        const { results } = data.data
        //* 2. 把数据添加到 articlesList 数组中
        this.articlesList.push(...results)
        //* 3. 设置本次加载中的 loading 状态结束
        this.loading = false
        //* 4. 判断数据是否加载结束
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据了，设置加载状态结束，不再触发上拉加载更多了
          this.finished = true
        }
      } catch (err) {
        console.log(err)
        this.loading = false //* 关闭 loading 效果
        this.error = true //* 开启错误提示
      }
    },
    //* 当触发下拉刷新的时候调用该函数
    async onRefresh () {
      try {
        //* 1. 请求获取数据
        const { data } = await getArticles({
          channel_id: this.chanel.id,
          timestamp: Date.now() // 下拉刷新每次都应该获取最新数据
        })
        //* 2. 将数据追加到列表的顶部
        const { results } = data.data
        this.articlesList.unshift(...results)
        //* 3. 关闭下拉刷新的 loading 状态
        this.isRefreshLoading = false

        //* 提示成功
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
      } catch (err) {
        console.log(err)
        this.isRefreshLoading = false //* 关闭下拉刷新的 loading 状态
        this.$toast('刷新失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
//* 创建独自的滚动区域,
.article-container{
  height:79vh;
  overflow: auto;
}

</style>
