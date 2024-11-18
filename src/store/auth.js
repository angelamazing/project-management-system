/*
 * @Author: Your Name
 * @Date: 2024-10-04 16:06:48
 * @LastEditors: Jerry Han angelamazing@163.com
 * @LastEditTime: 2024-11-18 11:05:14
 * @FilePath: \project-management-system\src\store\auth.js
 * @Description: Vuex store for user authentication and authorization management
 */

import { createStore } from 'vuex';
import axios from '@/axios';

export default createStore({
  state: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    role: null,
    permissions: [],
  },
  mutations: {
    setUser(state, user) {
      console.log('Setting user in store:', user);
      state.user = user;
      state.role = user.role;
      state.permissions = user.permissions;

      // 将用户信息存储到 localStorage
      localStorage.setItem('user', JSON.stringify(user));
   
    },
    clearUser(state) {
      state.user = null;
      state.role = null;
      state.permissions = [];

      // 清除 localStorage 中的用户信息
      localStorage.removeItem('user');
    }
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await axios.post('/login', credentials, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.data.code === 1) {
          const userData = response.data.data;
          console.log('Login successful, userData:', userData);
          commit('setUser', userData);
          return { success: true };
        } else {
          return { success: false, message: response.data.message || '用户名或密码错误' };
        }
      } catch (error) {
        console.error('Login failed:', error);
        return { success: false, message: '登录请求失败，请稍后再试' };
      }
    },
    logout({ commit }) {
      commit('clearUser');
    }
  },
  getters: {
    username: state => state.user.username,
    isAuthenticated: state => !!state.user,
    userRole: state => state.user ? state.user.role : null, // 确保从 user 中获取角色
    userPermissions: state => state.user ? state.user.permissions : [], // 确保从 user 中获取权限
    userId: state => state.user ? state.user.id : null,  // 新增 getter 用于获取用户 ID
  }
});
