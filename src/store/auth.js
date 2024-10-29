/*
 * @Author: Your Name
 * @Date: 2024-10-04 16:06:48
 * @LastEditors: Jerry Han angelamazing@163.com
 * @LastEditTime: 2024-10-27 15:38:19
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
    login({ commit }, credentials) {
      const defaultUsers = [
        { username: 'admin', password: '123456', role: '管理员', id: 1, permissions: ['create', 'edit', 'delete', 'view'] },
        { username: 'user', password: '123456', role: '普通用户', id: 2, permissions: ['view'] },
        { username: 'reviewer', password: 'reviewer123', role: '审核员', id: 3, permissions: ['view', 'review'] }
      ];

      const user = defaultUsers.find(
        u => u.username === credentials.username && u.password === credentials.password
      );

      if (user) {
        const userData = {
          id: user.id,
          username: user.username,
          role: user.role,
          permissions: user.permissions,
        };
        console.log('Login successful, userData:', userData);
        commit('setUser', userData);
        return { success: true };
      } else {
        return { success: false, message: '用户名或密码错误' };
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
