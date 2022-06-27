import axios from 'axios'
import store from '@/store'
import JSONBig from 'json-bigint'

const request = axios.create({
  baseURL:
   'http://toutiao.itheima.net',
  // 'http://192.168.15.60:8000'
  // 'http://192.168.15.25:3000',

  //* 自定义后端返回的原始数据
  //* data: 后端返回的原始数据，说白了就是 JSON 格式的字符串
  transformResponse: [function (data) {
    try {
      return JSONBig.parse(data)
    } catch (err) {
      return data
    }
    //* axios 默认会在内部这样来处理后端返回的数据
    //* return JSON.parse(data)
  }]

})
//* 请求拦截器
request.interceptors.request.use(function (config) {
  // console.log(config)
  const { user } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

export default request
