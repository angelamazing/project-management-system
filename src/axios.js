/*
 * @Author: Jerry Han angelamazing@163.com
 * @Date: 2024-11-16 17:01:54
 * @LastEditors: Jerry House angelamazing@163.com
 * @LastEditTime: 2024-12-09 09:51:13
 * @FilePath: \project-management-system\src\axios.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios';

// 创建 Axios 实例
const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/api/' : 'http://192.168.1.109:8080/api/', // 根据环境设置请求地址
  timeout: 10000, // 设置超时时间
});

// axios.defaults.withCredentials = true;

// 请求拦截器，自动添加 token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // 从本地存储中获取 token
    if (token) {
      config.headers.token = token; // 在请求头中添加 token
    }
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
