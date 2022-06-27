<template>
  <div class="search-suggestion">
      <van-cell v-for="(item,index) in suggestions"
        :key="index"
        icon="search"
        @click="$emit('search',item)">
      <template #title>
        <span v-html="hightLightText(item)"></span>
      </template>
      </van-cell>

    </div>
</template>

<script>
import { getSearchSuggestion } from '@/api/search'
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  data () {
    return {
      suggestions: [] //* 建议列表
    }
  },
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  watch: {
    searchText: {
      // debounce 函数
      // 参数1：函数
      // 参数2：防抖时间
      handler: debounce(function (value) {
        this.loadSearchSuggestion(value)
      }, 200),
      // handler (value) {
      //   this.loadSearchSuggestions(value)
      // },
      immediate: true // 首次监视触发
    }
  },
  methods: {
    // 获取联想建议数据
    async loadSearchSuggestion (q) {
      try {
        const { data } = await getSearchSuggestion(q)
        this.suggestions = data.data.options
        this.suggestions = this.suggestions.filter(v => v != null)
        // console.log(this.suggestions)
      } catch (err) {
        this.$toast('数据获取失败，请稍后重试')
      }
    },
    //* 处理高亮文本
    hightLightText (text) {
      //* （一）
      // 据数据变量动态的创建正则表达式，则手动 new RegExp
      // RegExp 正则表达式构造函数
      //    参数1：匹配模式字符串，它会根据这个字符串创建正则对象
      //    参数2：匹配模式，要写到字符串中
      // const hightLightStr = `<span class="active">${this.searchText}</span>`
      // const reg = new RegExp(this.searchText, 'gi')
      // return text.replace(reg, hightLightStr)
      //* (二)
      text.replace(new RegExp(`(${this.searchText})`, 'gi'), <span class="active">$1</span>)
    }

  }
}

</script>

<style scoped lang="less">
.search-suggestion {
  /deep/ span.active {
    color: #3296fa;
  }
}
</style>
