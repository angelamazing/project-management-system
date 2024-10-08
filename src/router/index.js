/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-10-04 16:06:48
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-10-08 09:09:58
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
import store from '../store/auth'; // 确保引用的是正确的 Vuex 存储

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
        meta: { requiredRoles: ['普通用户', '审核员', '管理员'], requiresAuth: true }
      },
      { 
        path: 'new-project', 
        component: () => import('../components/ProjectForm.vue'), 
        meta: { requiredRoles: ['普通用户', '审核员', '管理员'], requiresAuth: true } 
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
        meta: { requiredRoles: ['管理员', '审核员'], requiresAuth: true }
      },
      { 
        path: 'review', 
        component: ReviewProjects,
        meta: { requiredRoles: ['审核员', '管理员'], requiresAuth: true }
      },
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated; // 获取用户是否认证
  const userRole = store.getters.userRole; // 获取用户角色

  // 检查需要认证的路由
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ path: '/' }); // 未认证重定向到登录页面
  } else if (to.meta.requiredRoles && !to.meta.requiredRoles.includes(userRole)) {
    alert('您没有访问该页面的权限'); // 权限不足提示
    next(false); // 取消导航
  } else {
    next(); // 继续导航
  }
});

export default router;
