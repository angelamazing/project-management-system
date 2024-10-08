<template>
  <div class="login-page">
    <el-card class="login-card" shadow="hover">
      <h2 class="login-title">系统登录</h2>
      <el-form @submit.prevent="handleLogin" :model="loginForm" ref="loginForm" :rules="rules" label-width="0">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" name="username" placeholder="用户名" required></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" name="password" placeholder="密码" required></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin">登录</el-button>
        </el-form-item>
        <el-form-item>
          <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'LoginPage',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      errorMessage: '', // 错误信息存储
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    };
  },
  methods: {
    ...mapActions(['login']), // 使用 Vuex 的 login action
    async handleLogin() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          const response = await this.login({
            username: this.loginForm.username,
            password: this.loginForm.password
          });

          if (response.success) {
            this.$router.push('/dashboard'); // 登录成功后跳转
          } else {
            this.errorMessage = response.message || '用户名或密码错误';
          }
        } else {
          this.errorMessage = '请填写完整的登录信息';
        }
      });
    }
  }
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.login-card {
  width: 400px;
  padding: 30px;
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
}
</style>
