import axios from 'axios'
import { Loading } from 'element-ui'
let loadingInstance = null;     // 加载全局的loading

const instance = axios.create({    //创建axios实例，在这里可以设置请求的默认配置
  timeout: 60000, // 适当延长超时时间
  baseURL: 'graphics'
});
// 文档中的统一设置post请求头。下面会说到post请求的几种'Content-Type' application/json
// instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
instance.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8'

/** 添加请求拦截器 **/
instance.interceptors.request.use(config => {
  loadingInstance = Loading.service({       // 发起请求时加载全局loading，请求失败或有响应时会关闭
    spinner: 'fa fa-spinner fa-spin fa-3x fa-fw',
    target: '#app',
    text: '加载中...'
  });
  return config
}, error=> {
  // 对请求错误做些什么
  return Promise.reject(error)
});

/** 添加响应拦截器  **/
instance.interceptors.response.use(response => {
  loadingInstance.close();
  return Promise.resolve(response.data);
}, error => {
  loadingInstance.close();
  return Promise.reject(error)
});

/* 统一封装get请求 */
export const get = (url, params, config = {}) => {
  return new Promise((resolve, reject) => {
    instance({
      method: 'get',
      url,
      params,
      ...config
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
};

/* 统一封装post请求  */
export const post = (url, data, config = {}) => {
  return new Promise((resolve, reject) => {
    instance({
      method: 'post',
      url,
      data,
      ...config
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
};

