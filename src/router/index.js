/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-10-04 16:06:48
 * @LastEditors: Jerry House angelamazing@163.com
 * @LastEditTime: 2024-12-03 08:36:35
 * @FilePath: \project-management-system\src\router\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../views/LoginPage.vue';
import AdminDashboard from '../views/AdminDashboard.vue';
import ProjectList from '../components/ProjectList.vue';
import Users from '../components/UserManagement.vue';
import SystemLogs from '../components/SystemLogs.vue';
import ProjectOverview from '../components/ProjectOverview.vue';
import ReviewProjects from '../components/ReviewProjects.vue';
import store from '@/store/auth'

const routes = [
  { path: '/', component: LoginPage },
  {
    path: '/dashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true }, // 添加此行
    children: [
      { 
        path: 'projects', 
        component: ProjectList,
        meta: { requiredRoles: ['普通用户', '安全员', '管理员','队领导'], requiresAuth: true }
      },
      { 
        path: 'new-project', 
        component: () => import('../components/ProjectForm.vue'), 
        meta: { requiredRoles: ['普通用户',  '管理员'], requiresAuth: true } 
      },
      { 
        path: 'users', 
        component: Users,
        meta: { requiredRoles: ['管理员'], requiresAuth: true }
      },
      { 
        path: 'logs', 
        component: SystemLogs,
        meta: { requiredRoles: ['管理员'], requiresAuth: true }
      },
      { 
        path: 'overview', 
        component: ProjectOverview,
        meta: { requiredRoles: ['普通用户', '安全员', '管理员','队领导'], requiresAuth: true }
      },
      { 
        path: 'review', 
        component: ReviewProjects,
        meta: { requiredRoles: ['安全员', '管理员','队领导'], requiresAuth: true }
      },
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  // console.log('路由守卫检查权限');
  // console.log('当前用户状态:', store.state.user);
  // console.log('目标路由:', to.path);

  const isAuthenticated = store.getters.isAuthenticated;
  
  if (to.path === '/login') {
    if (isAuthenticated) {
      next('/dashboard');
    } else {
      next();
    }
  } else if (to.meta.requiresAuth && !isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;
