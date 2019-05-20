import Vue from 'vue'
import VueX from 'vuex'
import xxx from './modules/xxx'

Vue.use(VueX)

export default new VueX.Store({state: {Erate: 1}, modules: {xxx}, mutations: {}, strict: true})
