import axios from 'axios';
import notification from 'ant-design-vue/es/notification';
console.log(import.meta.env);
// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: import.meta.env.VITE_APP_API_BASE_URL as string,
  timeout: 60000, // 请求超时时间
});

// 用于流式请求的 axios 实例
const streamingRequest = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL as string,
  // timeout: 60000,
  responseType: 'arraybuffer',
});

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    notification.error({
      message: error.message,
      description: '请求失败',
    });
  }
  return Promise.reject(error);
};

// 流式请求的异常拦截处理器
const streamingErrorHandler = (error) => {
  if (error.response) {
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: 'Forbidden',
      });
    }
    if (error.response.status === 401) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed',
      });
    }
  }
  return Promise.reject(error);
};

// request interceptor
request.interceptors.request.use((config: any) => config, errorHandler);

// response interceptor
request.interceptors.response.use((response) => {
  const contentDisposition = response.headers['content-disposition'];
  // 下载文件时要使用header
  if (contentDisposition) {
    return response;
  }
  return response.data;
}, errorHandler);

streamingRequest.interceptors.response.use((response: any) => response.data, streamingErrorHandler);

export default request;

export {
  request as axios,
  streamingRequest,
};
