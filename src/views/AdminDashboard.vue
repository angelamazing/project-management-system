<template>
  <div class="dashboard">
    <AppSidebar />
    <div class="dashboard-content">
      <!-- 修改下拉菜单的实现 -->
      <el-dropdown class="dropdown-button">
        <el-button class="login-management-button">
          登录管理 <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="viewProfile">登录信息</el-dropdown-item>
            <el-dropdown-item divided @click="logout">注销登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      
      <el-card v-if="isDashboardRoot" class="welcome-card">
        <h2>欢迎回来, 朋友{{ username }}!</h2>
        <p>请选择左侧菜单以开始操作。</p>
      </el-card>

      <el-dialog v-model="dialogVisible" title="登录信息" @close="dialogVisible = false">
        <p>用户名: {{ username }}</p>
        <template #footer>
          <el-button @click="dialogVisible = false">关闭</el-button>
        </template>
      </el-dialog>
      
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
  data() {
    return {
      dialogVisible: false // 控制弹窗显示状态
    };
  },
  computed: {
    ...mapGetters(['username']),
    isDashboardRoot() {
      return this.$route.path === '/dashboard';
    }
  },
  methods: {
    logout() {
      try {
        this.$store.commit('logout');
        this.$router.push('/');
        this.$message.success('您已成功注销登录');
      } catch (error) {
        this.$message.error('注销登录失败，请稍后重试');
        console.error('Logout error:', error);
      }
    },
    viewProfile() {
      console.log("查看登录信息按钮被点击");
      this.dialogVisible = true; // 打开对话框
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
  padding: 20px; /* 调整整体填充 */
  
}

.dropdown-button {
  margin-bottom: 20px;
  text-align: right;
  top: 10px; /* 添加这行 */
  right: -1350px; /* 添加这行 */
}

.login-management-button {
  background-color: #409EFF;
  color: white;
  display: inline-flex;
  align-items: center;
}

.welcome-card {
  margin-bottom: 20px;
  background-color: #f9fafc;
  border-left: 5px solid #409EFF;
  padding: 20px;
}

.dashboard-content > .el-card {
  margin-top: 20px; /* 保持卡片顶部的间距 */
  
}

.dashboard-content,
.AppSidebar {
  align-items: flex-start; /* 将内容区域置顶 */
}

/* 添加以下样式以确保下拉菜单正确显示 */
.el-dropdown-menu {
  margin-top: 5px;
}

.el-dropdown-menu__item {
  padding: 10px 20px;
}
</style>
