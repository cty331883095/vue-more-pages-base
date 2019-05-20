import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const filterOptions = {
  include: [],
  exclude: []
}
function genRouters ({
  include = [],
  exclude = []
}) {
  const contexts = require.context('page@/index/views', true, /([\s\S]*)?\/index\.vue$/, 'lazy')
  let routers = []
  contexts.keys().forEach(dir => {
    const matchValue = /\/([\s\S]+)?\/index\.vue/g.exec(dir)
    if (!matchValue || !matchValue.length) return
    routers.push(matchValue[1])
  })
  if (!include.length && exclude.length) {
    routers = routers.filter(item => exclude.indexOf(item) === -1)
  }
  if (include.length && !exclude.length) {
    routers = routers.filter(item => include.indexOf(item) > -1)
  }
  if (include.length && exclude.length) {
    routers = routers.filter(item => exclude.indexOf(item) === -1 && include.indexOf(item) > -1)
  }
  return routers.map((router) => {
    // console.log(`page@/index/views/${router}/`)
    return {
      path: '/' + router,
      name: router.trim().replace(/^[a-zA-Z]/g, v => v.toUpperCase()),
      component: () => import(/* webpackChunkName:"index-[request]",webpackPrefetch:0 */ `page@/index/views/${router}/`)
    }
  })
}

export default new Router({
  routes: [{
    path: '/',
    redirect: '/home'
  },
  ...genRouters(filterOptions)
  ]
})
