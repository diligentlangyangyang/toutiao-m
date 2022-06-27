import Vue from 'vue'
import App from './App.vue'
import Vant from 'vant'
import 'vant/lib/index.css'
import router from './router'
import store from './store'

// 引入全局样式
import '@/styles/index.less'
// 加载 flexible模块
import 'amfe-flexible'
import '@/utils/dayjs'
Vue.use(Vant)
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
