/*
 * @Author: Your Name
 * @Date: 2024-10-04 16:06:48
 * @LastEditors: Jerry House angelamazing@163.com
 * @LastEditTime: 2024-11-27 08:52:11
 * @FilePath: \project-management-system\src\store\auth.js
 * @Description: Vuex store for user authentication and authorization management
 */

import { createStore } from 'vuex';


export default createStore({
  state: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    role: null,
    permissions: [],
    
  },
  mutations: {
    setUser(state, user) {
      // console.log('Setting user in store:', user);
      state.user = user;
      state.role = user.role;
      state.permissions = user.permissions;
      state.id = user.id;
      state.departmentId = user.departmentId;
      

      // 将用户信息存储到 localStorage
      localStorage.setItem('user', JSON.stringify(user));
   
    },
    clearUser(state) {
      state.user = null;
      state.role = null;
      state.permissions = [];

      // 清除 localStorage 中的用户信息
      localStorage.removeItem('user');
    },
    logout(state) {
      state.user = null;
      state.role = null;
      state.permissions = [];
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  },
  actions: {
    async login({ commit }, userData) {
      try {
        // 设置用户信息
        const user = {
          username: userData.username,
          role: userData.role,
          token: userData.token,
          id:userData.id,
          departmentId:userData.departmentId,
        };
        
        // 提交 mutation 更新状态
        commit('setUser', user);  
        
        // 存储 token
        localStorage.setItem('token', userData.token);
        
        // console.log('Vuex 状态更新完成');
        return { success: true };
        
      } catch (error) {
        console.error('Vuex login action error:', error);
        return { success: false, message: '登录状态处理失败' };
      }
    },
    logout({ commit }) {
      commit('logout');
    }
  },
  getters: {
    username: state => state.user ? state.user.username : null,
    isAuthenticated: state => !!state.user,
    userRole: state => state.user ? state.user.role : null,
    userPermissions: state => state.user ? state.user.permissions : [],
    userId: state => state.user ? state.user.id : null,
    departmentId: state => state.user ? state.user.departmentId : null,
  }
});
