module.exports = {
  plugins: {
    'postcss-pxtorem': {
      // 能够把所有元素的px单位转成Rem
      // rootValue: 转换px的基准值。

      rootValue ({ file }) {
        // return file.indexOf('vant') !== -1 ? 37.5 : 75
        return file.includes('vant') ? 37.5 : 75
      },
      propList: ['*'],
      exclude: 'github-markdown' //* 不对这个文件进行rem 转换
    }
  }
}
