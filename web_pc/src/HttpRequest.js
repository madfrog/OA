import axios from "axios";
import {Notification} from "element-ui";
import router from "./router";
import {removeToken, getToken} from '@/cookie';

let CONFIG = require('./config').config

let basePath = "";

function init() {
  const active = CONFIG.active
  if (active == "dev") {
    basePath = CONFIG.server.dev.context_path;
    return;
  }
  basePath = CONFIG.server.prod.context_path;
}
init();


// 通过 axios.create 创建一个实例，对该实例进行一些配置，便得到了一个专门用来与后端服务器进行通信的 ajax 函数。
const axiosInstance = axios.create({
  timeout: 50000, // 请求超时时间
  // `transformRequest` 允许在向服务器发送前，修改请求数据
  // 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
  // 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
  //transformRequest: [
  //function(data) {
  // 对 data 进行任意转换处理
  // console.log(Qs.stringify(data));
  // return Qs.stringify(data);
  // }
  //],
  // `params` 是即将与请求一起发送的 URL 参数
  // 必须是一个无格式对象(plain object)或 URLSearchParams 对象
  // params: {
  //   email:'123@qq.com',
  //   password:'123'
  // },
  // `data` 是作为请求主体被发送的数据
  // 只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
  // 在没有设置 `transformRequest` 时，必须是以下类型之一：
  // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
  // - 浏览器专属：FormData, File, Blob
  // - Node 专属： Stream
  // data: {

  // },
  // `withCredentials` 表示跨域请求时是否需要使用凭证
  withCredentials: true, // 默认的
  // `auth` 表示应该使用 HTTP 基础验证，并提供凭据
  // 这将设置一个 `Authorization` 头，覆写掉现有的任意使用 `headers` 设置的自定义 `Authorization`头
  // auth: {
  // },

  // `validateStatus` 定义对于给定的HTTP 响应状态码是 resolve 或 reject  promise 。如果 `validateStatus` 返回 `true` (或者设置为 `null` 或 `undefined`)，promise 将被 resolve; 否则，promise 将被 rejecte
  validateStatus: function (status) {
    return status >= 200 && status < 300; // 默认的
  }
});

// 添加请求拦截器
axiosInstance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    console.log("请求拦截器-----> 请求发送......", config);
    console.log(CONFIG.loginPage)
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    console.log("请求错误......", error);
    return Promise.reject(error);
  }
);

function checkResult(response) {
  var code = response.data.code;
  var msg = response.data.msg;
  if (code == CONFIG.no_login_code) {
    Notification.error("会话过期/尚未登录，请先登录~");
    router.replace({
      path: CONFIG.loginPage
    });
    return;
  } else if (code == CONFIG.res_success_code) {
    response.data['R'] = true;
  } else {
    if(CONFIG.autoAlertErrorMsg){
      Notification.error(msg);
    }
    response.data['R'] = false;
  }
}

// 添加响应拦截器
axiosInstance.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    console.log("请求结束......");
    checkResult(response);
    return response.data;
  },
  function (error) {
    // 对响应错误做点什么
    console.log("响应报错", error);
    var errMsg = "服务器异常";

    if (error.response) {
      if (error.response.status == 401) {
        errMsg = "会话过期/未登录";
        router.replace({
          path: CONFIG.loginPage
        });
      } else if (error.response.status == 504) {
        errMsg = "网关请求超时";
      } else if (error.response.status == 502) {
        errMsg = "服务器被未启动⊙﹏⊙∥";
      } else if (error.response.status == 403) {
        errMsg = "权限不足,请联系管理员!";
      } else if (error.response.status == CONFIG.no_page) {
        errMsg = "服务器跑偏了⊙﹏⊙∥";
      } else {
        errMsg = "未知错误!";
      }
      console.log(
        "错误内容：" +
        error.response.data.message +
        ", 路径：" +
        error.config.url +
        ", 状态码：" +
        error.response.data.status +
        ", 请求类型：" +
        error.config.method
      );
    } else {
      errMsg = "会话过期或您已退出登录";
      router.replace({
        path: CONFIG.loginPage
      });
    }
    Notification.error(errMsg);
    return Promise.reject(error);
  }
);

export const uploadRequest = (url, formData) => {
  let token = getToken();
  return axiosInstance({
    method: "post",
    url: basePath + url,
    data: formData,
    headers: {'token': token, "Content-Type": 'multipart/form-data'}
  });
};


export const postRequestJSON = (url, params) => {
  let token = getToken();
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const element = params[key];

      if (element != 0) {
        if (element == "" || element == null) {
          console.log(element)
          delete params[key];
        }
      }
    }
  }
  return axiosInstance({
    method: "post",
    url: basePath + url,
    data: params,
    headers: {'token': token, "Content-Type": 'application/json'}
  });
};


export const postRequest = (url, params) => {
  let token = getToken();
  filterParamsIsEmpty(params);
  return axiosInstance({
    method: "post",
    url: basePath + url,
    params: params,
    headers: {'token': token, "Content-Type": 'multipart/form-data'}
  });
};

function filterParamsIsEmpty(params) {
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const element = params[key];
      if (element==0){
        continue;
      }
      if (element == "" || element == null) {
        delete params[key];
      }
    }
  }
}

export const putRequest = (url, params) => {
  let token = getToken();
  filterParamsIsEmpty(params);
  return axiosInstance({
    method: "put",
    url: basePath + url,
    data: params
    , headers: {'token': token, "Content-Type": 'application/json'}
  });
};

export const deleteRequest = (url, params) => {
  let token = getToken();
  return axiosInstance({
    method: "delete",
    url: basePath + url,
    params: params
    , headers: {"token": token}
  });
};

export const getRequest = (url, params) => {
  let token = getToken();
  filterParamsIsEmpty(params);
  return AxiosInstance.get(basePath + url, {
    params: params
    , headers: {'token': token}
  });
};

export const AxiosInstance = axiosInstance;
