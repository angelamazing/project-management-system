// 在一个独立的文件（如 axios.js）中配置 Axios
import axios from 'axios';

// 创建 Axios 实例
const axiosInstance = axios.create({
  timeout: 10000, // 设置超时时间
});

// 请求拦截器，自动添加 token
axiosInstance.interceptors.request.use(
  (config) => {
    
    const token = localStorage.getItem('token'); // 从本地存储中获取 token

    if (token) {
      config.headers.token = token; // 在请求头中添加 Authorization
    }
    // 打印请求头以进行调试
    console.log('Request Headers:', config.headers);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器，处理错误或全局响应逻辑
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 处理未授权（401）错误，例如跳转到登录页
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
