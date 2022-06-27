<template>
<!--  评论列表 -->
  <div class="article-comments">
    <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    :immediate-check="false"
    @load="onLoad"
    >
    <!-- 评论项 -->
    <CommentItem
    v-for="item in list"
    :key="item.art_id"
    :comment="item"
    @reply-click="$emit('reply-click',$event)"
     />
    </van-list>
  </div>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item.vue'
export default {
  name: 'CommentList',
  data () {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null
    }
  },
  created () {
    // 当你手动初始化 onload的话，它不会自动初始化的  loading,需要我们手动的开启初始化 loading
    this.loading = true
    this.onLoad()
  },
  props: {
    source: {
      type: [Number, Object, String],
      required: true
    },
    list: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      // 自定义 Prop 数据验证
      validator (value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    }
  },
  components: {
    CommentItem
  },
  methods: {
    //* 1. 请求获取数据
    async onLoad () {
      try {
      // 获取文章的评论和获取评论的回复是同一个接口
      // 唯一的区别是接口参数不一样
      //    type
      //      a 文章的评论
      //      c 评论的回复
      //    source
      //      文章的评论，则传递文章的 ID
      //      评论的回复，则传递评论的 ID
        const { data } = await getComments({
          type: this.type, //  评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source.toString(), // 源id，文章id或评论id
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: 10// 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        })
        // console.log(data)
        //* 2. 将数据添加到列表中
        const { results } = data.data

        // eslint-disable-next-line vue/no-mutating-props
        this.list.push(...results)
        // 把文章评论的总数量传递到外部
        this.$emit('onload-success', data.data.total_count)
        //* 3. 将 loading 设置为 false
        this.loading = false
        //* 4. 判断是否还有数据
        if (results.length) {
        // 有就更新获取下一页的数据页码
          this.offset = data.data.last_id
        } else {
        // 没有就将 finished 设置结束
          this.finished = true
        }
      } catch (err) {
        this.$toast('发布失败')
        this.loading = false
      }
    }
  }

}
</script>

<style>

</style>
