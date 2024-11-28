<template>
  <div class="dashboard">
    <AppSidebar />
    <div class="dashboard-content">
      <div class="header">
        <el-button 
          class="help-button" 
          type="info" 
          plain 
          @click="showUserManual"
        >
          <i class="el-icon-question"></i> 使用手册
        </el-button>
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
      </div>

      <el-dialog
        v-model="manualVisible"
        title="系统使用手册"
        width="1200px"
        class="manual-dialog"
        :fullscreen="false"
        :close-on-click-modal="false"
      >
        <div class="manual-content">
          <el-tabs type="border-card">
            <el-tab-pane label="系统概述">
              <h3>系统介绍</h3>
              <p>这是一个安全生产风险评价系统，主要功能包括项目管理、风险评价等。</p>
              
              <h3>用户角色</h3>
              <el-descriptions border>
                <el-descriptions-item label="管理员">拥有所有权限，可以管理用户、查看日志、修改系统配置</el-descriptions-item>
                <el-descriptions-item label="安全（审核）员">查看项目，审核项目、项目总览</el-descriptions-item>
                <el-descriptions-item label="普通用户">新建项目，查看项目</el-descriptions-item>
              </el-descriptions>
            </el-tab-pane>

            <el-tab-pane label="功能指南">
              <el-collapse>
                
                
                <el-collapse-item title="新建项目" name="2">
                  <ul>
                    <li>未提交项目列表（只能看到自己提交的项目）</li>
                    <li>录入新项目，可以选择先保存，提交审核，计算分数</li>
                    <li>查看详情，用于修改未提交项目的基本信息</li>
                    <li>删除项目</li>
                  </ul>
                </el-collapse-item>

                <el-collapse-item title="查看项目" name="3">
                  <ul>
                    <li>查看项目（普通用户只能看到自己创建的项目）</li>
                    <li>查看详情，给出项目信息卡片</li>
                  </ul>
                </el-collapse-item>

                <el-collapse-item title="审核项目" name="4">
                  <ul>
                    <li>安全(审核)员可以审核项目，给出审核意见，调整项目风险分数</li>
                  </ul>
                </el-collapse-item>

                <el-collapse-item title="项目总览" name="5">
                  <ul>
                    <li>项目总览：柱状图，饼状图以及已审核项目的列表信息</li>
                  </ul>
                </el-collapse-item>

                <el-collapse-item title="用户管理" name="6">
                  <ul>
                    <li>用户管理：添加用户，删除用户，编辑用户角色</li>
                  </ul>
                </el-collapse-item>

                <el-collapse-item title="系统日志" name="7">
                  <ul>
                    <li>管理员查看操作日志</li>
                  </ul>
                </el-collapse-item>

              </el-collapse>
            </el-tab-pane>

            <el-tab-pane label="常见问题">
              <el-alert
                v-for="(qa, index) in faqs"
                :key="index"
                :title="qa.q"
                :description="qa.a"
                type="info"
                show-icon
                class="faq-item"
              />
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-dialog>

      <el-card v-if="isDashboardRoot" class="welcome-card">
        <h2>欢迎回来, {{ username }}!</h2>
        <p>请选择左侧菜单以开始操作。</p>
      </el-card>

      <el-dialog v-model="dialogVisible" title="登录信息" @close="dialogVisible = false">
        <p>用户名: {{ username }}</p>
        
        <el-form 
          ref="passwordForm" 
          :model="passwordForm" 
          :rules="rules"
          label-width="100px"
          style="margin-top: 20px"
        >
          <el-form-item label="新密码" prop="password">
            <el-input 
              v-model="passwordForm.password" 
              type="password" 
              placeholder="请输入新密码"
              show-password
            />
          </el-form-item>
          
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input 
              v-model="passwordForm.confirmPassword" 
              type="password" 
              placeholder="请再次输入新密码"
              show-password
            />
          </el-form-item>
        </el-form>

        <template #footer>
          <el-button @click="dialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="updatePassword">修改密码</el-button>
        </template>
      </el-dialog>
      
      <router-view></router-view>
    </div>
  </div>
</template>


<script>
import { mapGetters } from 'vuex';
import AppSidebar from '../components/Sidebar/AppSidebar.vue';
import axios from '@/axios'; // 引入 axios


export default {
  name: 'AdminDashboard',
  components: {
    AppSidebar
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value !== this.passwordForm.confirmPassword) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }

    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passwordForm.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }

    return {
      dialogVisible: false,
      passwordForm: {
        password: '',
        confirmPassword: ''
      },
      rules: {
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      manualVisible: false,
      faqs: [
        {
          q: '忘记密码怎么办？',
          a: '请联系系统管理员重置密码'
        },
        {
          q: '如何修改密码',
          a: '移动到右上角登录管理，点击登录信息，输入新密码修改'
        },
        {
          q: '无法登录系统？',
          a: '请检查用户名和密码是否正确，确认网络连接是否正确'
        },
        {
          q: '权限不足？',
          a: '请确认当前用户角色，如需要请联系管理员进行权限调整'
        }
      ]
    };
  },
  computed: {
    ...mapGetters(['username','userId']),
    isDashboardRoot() {
      return this.$route.path === '/dashboard';
    }
  },
  mounted() {
    // 如果是根路径，重定向到 project-overview
    if (this.$route.path === '/dashboard') {
      this.$router.push('/dashboard/overview');
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
    async updatePassword() {
      try {
        await this.$refs.passwordForm.validate()
        console.log(this.userId)

        const response = await axios.put('/users/update', {
          id: this.userId, // 确保你的 store 中有 userId
          password: this.passwordForm.password
        })
        
        if (response.data.code === 1 && response.data.msg != '更新失败！') {
          console.log(response.data)
          this.$message.success('密码修改成功')
          this.dialogVisible = false
          this.$refs.passwordForm.resetFields()
        } else {
          this.$message.error('密码修改失败')
        }
      } catch (error) {
        console.error('修改密码错误:', error)
        this.$message.error('修改密码失败，请重试')
      }
    },
    viewProfile() {
      console.log("查看登录信息按钮被点击")

      this.dialogVisible = true
      // 重置表单
      if (this.$refs.passwordForm) {
        this.$refs.passwordForm.resetFields()
      }
    },
    showUserManual() {
      this.manualVisible = true
    }
  }
}
</script>
<style>
.dashboard {
  display: flex;
  position: relative;
  min-height: 100vh; /* 确保整个页面占满视口高度 */
  background-color: #f0f0f0; /* 背景设为浅灰色 */
}

.dashboard-content {
  flex-grow: 1;
  padding: 20px; /* 调整整体填充 */
  background-color: #ffffff; /* 内容区设为白色以与背景形成对比 */
  border-radius: 8px; /* 添加圆角 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}

.header {
  display: flex;
  justify-content: flex-end; /* 将元素推到右侧 */
  margin-bottom: 20px; /* 下方留一些空间 */
}

.dropdown-button {
  text-align: right; /* 右对齐 */
}

.login-management-button {
  background-color: #409EFF;
  color: white;
  display: inline-flex;
  align-items: center;
}

.welcome-card {
  margin-bottom: 20px;
  border-left: 5px solid #409EFF; /* 左边框设为深灰色 */
  padding: 20px;

}

/* 添加一些新的样式 */
.el-dialog__body {
  padding: 20px 30px;
}

.el-form {
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.help-button {
  margin-right: 16px;
}

.manual-dialog :deep(.el-dialog) {
  margin: 5vh auto !important;
}

.manual-dialog :deep(.el-dialog__body) {
  padding: 30px;
  max-height: 75vh;
  overflow-y: auto;
}

.manual-content {
  line-height: 1.8;
}

.faq-item {
  margin-bottom: 20px;
  padding: 16px;
}

.faq-item :deep(.el-alert__title) {
  font-size: 16px;
  font-weight: bold;
}

.faq-item :deep(.el-alert__description) {
  margin-top: 8px;
  font-size: 14px;
  line-height: 1.6;
}

.el-tabs :deep(.el-tabs__content) {
  padding: 20px;
}

.el-descriptions {
  margin: 20px 0;
  width: 100%;
}

.el-descriptions :deep(.el-descriptions-item__label) {
  width: 120px;
  font-weight: bold;
}

.el-collapse {
  border: none;
  width: 100%;
}

.el-collapse-item {
  margin-bottom: 12px;
  background: #f8f9fa;
  border-radius: 4px;
}

h3 {
  margin: 20px 0 16px;
  color: #303133;
  font-size: 18px;
}

p {
  color: #606266;
  margin-bottom: 16px;
}

ul {
  padding-left: 24px;
  margin: 12px 0;
}

li {
  line-height: 1.8;
  color: #606266;
}

</style>

