<!--
 * @Author: Jerry Han angelamazing@163.com
 * @Date: 2024-10-22 15:44:18
 * @LastEditors: Jerry Han angelamazing@163.com
 * @LastEditTime: 2024-11-16 17:09:30
 * @FilePath: \project-management-system\src\views\LoginPage.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
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
import axios from '@/axios'; // 引入 axios

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
    ...mapActions(['login']),
    async handleLogin() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          try {
            const response = await axios.post('/login', { // 发送真实的登录请求
              username: this.loginForm.username,
              password: this.loginForm.password
            }, {
              headers: {
                'Content-Type': 'application/json' // 确保请求体为 JSON 格式
              }
            });
            
            if (response.data.code == 1) {
              console.log(response.data); 
              localStorage.setItem('token',response.data.data)
              this.$router.push('/dashboard'); // 登录成功后跳转
            } else {
              this.errorMessage = response.data.message || '用户名或密码错误';
            }
          } catch (error) {
            this.errorMessage = '登录请求失败，请稍后再试'; // 处理请求错误
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
