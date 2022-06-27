/* eslint-disable vue/no-mutating-props */
<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isHistoryShow">
        <span @click="$emit('update-search')">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isHistoryShow=!isHistoryShow">完成</span>
      </div>
      <van-icon name="delete"
      v-else
      @click="isHistoryShow=!isHistoryShow"
      />
    </van-cell>
    <van-cell v-for="(item,index) in searchHistoryDate"
      :key="index"
      :title="item"
      @click="deleteSearchHistory(item,index)"
      >
      <van-icon name="close"
      v-show="isHistoryShow"

      />
    </van-cell>

  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  data () {
    return {
      isHistoryShow: false
    }
  },
  props: {
    searchHistoryDate: {
      type: Array,
      required: true
    }
  },
  methods: {
    deleteSearchHistory (v, index) {
      if (this.isHistoryShow) {
        // eslint-disable-next-line vue/no-mutating-props
        this.searchHistoryDate.splice(index, 1)
      } else {
        this.$emit('search-history', v)
      }
    }
  }
}
</script>

<style>

</style>
