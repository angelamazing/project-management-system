<!--
 * @Author: Jerry Han angelamazing@163.com
 * @Date: 2024-10-22 15:44:18
 * @LastEditors: Jerry House angelamazing@163.com
 * @LastEditTime: 2024-11-27 09:11:48
 * @FilePath: \project-management-system\src\views\LoginPage.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="login-page">
    <el-card class="login-card" shadow="hover">
      <h2 class="login-title">平台登录</h2>
      <el-form @submit.prevent="handleLogin" :model="loginForm" ref="loginForm" :rules="rules" label-width="0">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" name="username" placeholder="用户名" required></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" name="password" placeholder="密码" required></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" :loading="loading" :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
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
      },
      loading: false, // 添加loading状态
    };
  },
  methods: {
    ...mapActions(['login', 'logout']),
    async handleLogin() {
      if (this.loading) return;
      this.loading = true;      
      // console.log(`当前登录请求的服务器地址: ${axios.defaults.baseURL}`); // 打印服务器地址

      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          try {

            const response = await axios.post('/login', {
              username: this.loginForm.username,
              password: this.loginForm.password
            }, {
              timeout: 10000, // 设置超时时间为10秒
              headers: {
                'Content-Type': 'application/json'
              }
            });
     
            if (response.status == 200) {
              try {
            
                
                // 使用 Vuex action 处理登录
                const result = await this.$store.dispatch('login', {
                  username: this.loginForm.username,
                  token: response.data.data.jwtToken,
                  role: response.data.data.permission,
                  id:response.data.data.id,
                  departmentId:response.data.data.departmentId,
                });
                
                

                if (result.success) {
                  // console.log('Vuex 登录成功，准备跳转');
                  await this.$router.push('/dashboard');  
                  console.log(response.data)
                 
                  console.log(`当前登录用户部门ID: ${this.$store.state.departmentId}`);
                } else {
                  this.errorMessage = result.message || '登录失败';
                }
                
              } catch (error) {
                console.error('登录处理错误:', error);
                this.errorMessage = '登录失败，请重试';
              }
            } else {
              this.errorMessage = response.data.message || '用户名或密码错误';
            }
          } catch (error) {
            console.error('登录错误详情:', {
              message: error.message,
              status: error.response?.status,
              data: error.response?.data
            });
            this.errorMessage = '登录请求失败，请稍后再试';
          } finally {
            this.loading = false;
          }
        } else {
          this.loading = false;
          console.log('表单验证失败'); // 添加日志
          this.errorMessage = '请填写完整的登录信息';
        }
      });
    },
    handleLogout() {
      this.logout();
      this.$router.push('/login');
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
  background-color: #f0f4f8;
}

.login-card {
  width: 400px;
  max-width: 90%;
  height: auto;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  background-color: white;
  transition: box-shadow 0.3s ease;
}

.login-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.login-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
  color: #2c3e50;
}

.error-message {
  color: #e74c3c;
  text-align: center;
  margin-top: 10px;
  font-size: 14px;
}

.el-input {
  border-radius: 8px;
  background-color: #ecf0f1;
}

.el-button {
  background-color: #2980b9;
  color: white;
  border: none;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.el-button:hover {
  background-color: #1a5276;
}
</style>
