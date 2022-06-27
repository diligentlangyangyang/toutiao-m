<template>
  <div class="search-container">
    <!-- 搜索栏 -->
      <form action="/">
        <van-search
          v-model="searchText"
          show-action
          placeholder="请输入搜索关键词"
          @search="onSearch"
          @cancel="onCancel"
          background="#3296fa"
          @focus="isResultShow=false"
        />
      </form>
    <!-- /搜索栏 -->

    <!-- 搜索结果 -->
        <SearchResult
        v-if="isResultShow"
        :search-text="searchText"/>
    <!-- /搜索结果 -->

    <!-- 搜索联想 -->
        <SearchSuggestion
        v-else-if="searchText"
        :search-text="searchText"
        @search="onSearch"
        />
    <!-- /搜索联想 -->

    <!-- 搜索历史记录 -->
        <SearchHistory
        :searchHistoryDate="searchHistoryDate"
        @search-history="onSearch"
        @update-search="searchHistoryDate=[]"
        v-else/>
    <!-- /搜索历史记录 -->

  </div>
</template>

<script>
import SearchHistory from './components/search-history.vue'
import SearchResult from './components/search-result.vue'
import SearchSuggestion from './components/search-suggestion.vue'
import { setItem, getItem } from '@/utils/storage'
export default {
  name: 'SearchIndex',
  components: {
    SearchHistory,
    SearchResult,
    SearchSuggestion
  },
  data () {
    return {
      searchText: '',
      isResultShow: false,
      searchHistoryDate: getItem('TOUTIAO_SEARCH_HISTORY') || [] //* 历史记录数据

    }
  },
  watch: {
    //* 数据持久化，
    //* 直接对 searchHistoryDate 数据进行侦听，就不需要考虑添加数据时的数据类型等
    searchHistoryDate (value) {
      setItem('TOUTIAO_SEARCH_HISTORY', value)
    }
  },
  methods: {
    onSearch (val) {
      this.isResultShow = true
      //* 存储搜索历史记录
      //* 不能有重复历史记录，且排在最前面位置
      // const searchIndex = this.searchHistoryDate.indexOf(val)
      // if (searchIndex !== -1) {
      //   this.searchHistoryDate.splice(searchIndex, 1)
      // }
      // this.searchHistoryDate.unshift(val)
      //* 优化方法
      this.searchHistoryDate = [...new Set([val, ...this.searchHistoryDate])]

      this.searchText = val
    },
    onCancel () {
      this.$router.back()
    }
  }

}
</script>

<style scoped lang="less">
.search-container {
  padding-top: 106px;
  .van-search {
    position:fixed;
    top: 0;
    left: 0;
    right:0;
    z-index: 1;
  }
  .van-search__action {
    color: #fff;
  }
}
</style>
