import Vue from 'vue'

import router from './router'
import axiosIns from '@/axios'
import store from './store'

import 'static/css/common.css'

import App from './App'
Vue.config.productionTip = false
Vue.prototype.$axiosIns = axiosIns

/* eslint-disable no-new */
new Vue({ el: '#app', router, store, components: { App }, template: '<App/>' })
