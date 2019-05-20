import axios from 'axios'
import qs from 'qs'

let headers = {
  'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
}

let axiosIns = axios.create({
  timeout: 20000,
  withCredentials: true, // 允许携带cookie
  headers
})

// 请求之前处理数据
axiosIns.interceptors.request.use((config) => {
  let type = config.method.toLowerCase()
  if (['post', 'put', 'delete'].indexOf(type) > -1) {
    config.data = qs.stringify(config.data) // 序列化数据
  }
  return config
}, (error) => {
  return Promise.reject(error.data.error.message)
})

// 用于处理放回值
axiosIns.interceptors.response.use((res) => {
  if (res.data.flag !== void 0 && !res.data.flag) {
    console.error(`后台返回失败:${res.data.message}`)
  } else {
    return res.data.extend || res.data
  }
  return res.data
}, (error) => {
  console.error(`请求url失败:${error.config.url},错误原因:${error.response ? error.response.statusText : error.message}`)
})
export default axiosIns
