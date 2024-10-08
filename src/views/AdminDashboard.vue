<template>
  <div class="dashboard">
    <AppSidebar />
    <div class="dashboard-content">
      <!-- 注销登录按钮 -->
      <el-button class="logout-button" @click="logout">注销登录</el-button>
      
      <!-- 条件渲染欢迎信息 -->
      <el-card v-if="isDashboardRoot" class="welcome-card">
        <h2>欢迎回来, 朋友{{ username }}!</h2>
        <p>请选择左侧菜单以开始操作。</p>
      </el-card>
      
      <!-- 子路由内容 -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import AppSidebar from '../components/Sidebar/AppSidebar.vue';

export default {
  name: 'AdminDashboard',
  components: {
    AppSidebar
  },
  computed: {
    ...mapGetters(['username']),
    isDashboardRoot() {
      // 检查当前路径是否是 /dashboard 根路径
      return this.$route.path === '/dashboard';
    }
  },
  methods: {
    logout() {
      // 执行注销登录操作
      this.$store.commit('logout');
      this.$router.push('/');
      this.$message.success('您已成功注销登录');
    }
  }
}
</script>

<style>
.dashboard {
  display: flex;
  position: relative;
  min-height: 100vh; /* 确保整个页面占满视口高度 */
}

.dashboard-content {
  flex-grow: 1;
  padding: 20px;
  padding-top: 70px; /* 确保顶部不会与固定的注销按钮重叠 */
  padding-right: 60px; /* 确保右边的内容不会与注销按钮重叠 */
  position: relative; /* 使子元素可以相对定位 */
}

/* 固定注销登录按钮在右上角 */
.logout-button {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000; /* 确保按钮置顶显示 */
}

.welcome-card {
  margin-bottom: 20px;
  background-color: #f9fafc;
  border-left: 5px solid #409EFF;
  padding: 20px;
}

/* 侧边栏样式，确保它显示在页面左边 */
.dashboard-content > .el-card {
  margin-top: 20px; /* 保持卡片顶部的间距 */
}

/* 确保侧边栏和内容区域都在顶端 */
.dashboard-content,
.AppSidebar {
  align-items: flex-start; /* 将内容区域置顶 */
}
</style>
