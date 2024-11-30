<!--
 * @Author: Jerry Han angelamazing@163.com
 * @Date: 2024-10-22 15:44:18
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-11-30 20:13:05
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
          <el-checkbox v-model="rememberPassword">记住密码</el-checkbox>
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
      rememberPassword: false,
      errorMessage: '',
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      loading: false,
    };
  },
  created() {
    // 页面加载时尝试加载加密的凭证
    this.loadEncryptedCredentials();
  },
  methods: {
    ...mapActions(['login', 'logout']),
    // 加密方法
    encrypt(text) {
      try {
        // 简单的加密密钥
        const key = 'your-secret-key';
        // 将文本转换为字符数组
        const textChars = text.split('');
        const keyChars = key.split('');
        
        // 对每个字符进行异或操作
        const encryptedChars = textChars.map((char, index) => {
          const keyChar = keyChars[index % keyChars.length];
          return String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0));
        });
        
        // 将加密后的字符串转为 Base64
        return btoa(encryptedChars.join(''));
      } catch (e) {
        console.error('加密失败:', e);
        return null;
      }
    },

    // 解密方法
    decrypt(encryptedText) {
      try {
        const key = 'your-secret-key';
        // 将 Base64 转回字符串
        const decodedText = atob(encryptedText);
        const textChars = decodedText.split('');
        const keyChars = key.split('');
        
        // 对每个字符进行异或操作（解密）
        const decryptedChars = textChars.map((char, index) => {
          const keyChar = keyChars[index % keyChars.length];
          return String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0));
        });
        
        return decryptedChars.join('');
      } catch (e) {
        console.error('解密失败:', e);
        return null;
      }
    },

    // 保存加密后的凭证
    saveEncryptedCredentials() {
      try {
        const credentials = {
          username: this.loginForm.username,
          password: this.encrypt(this.loginForm.password) // 加密密码
        };
        localStorage.setItem('userCredentials', JSON.stringify(credentials));
        console.log('加密凭证已保存');
      } catch (e) {
        console.error('保存加密凭证失败:', e);
      }
    },

    // 读取并解密凭证
    loadEncryptedCredentials() {
      try {
        const savedData = localStorage.getItem('userCredentials');
        if (savedData) {
          const credentials = JSON.parse(savedData);
          this.loginForm.username = credentials.username;
          this.loginForm.password = this.decrypt(credentials.password); // 解密密码
          this.rememberPassword = true;
          console.log('已加载加密凭证');
        }
      } catch (e) {
        console.error('加载加密凭证失败:', e);
      }
    },

    async handleLogin() {
      if (this.loading) return;
      this.loading = true;

      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          try {
            const response = await axios.post('/login', {
              username: this.loginForm.username,
              password: this.loginForm.password
            });

            if (response.status === 200 && response.data.code === 1) {
              // 如果选择记住密码，保存加密的凭证
              if (this.rememberPassword) {
                this.saveEncryptedCredentials();
              } else {
                localStorage.removeItem('userCredentials');
              }

              // 继续处理登录逻辑...
              const result = await this.$store.dispatch('login', {
                username: this.loginForm.username,
                token: response.data.data.jwtToken,
                role: response.data.data.permission,
                id: response.data.data.id,
                departmentId: response.data.data.departmentId,
              });

              if (result.success) {
                await this.$router.push('/dashboard');
              }
            }
          } catch (error) {
            console.error('登录失败:', error);
            this.errorMessage = '登录失败，请重试';
          } finally {
            this.loading = false;
          }
        } else {
          this.loading = false;
        }
      });
    },
    handleLogout() {
      // 如果未勾选记住密码，清除存储的信息
      if (!this.rememberPassword) {
        localStorage.removeItem('userCredentials');
      }
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
  background-image: url('@/assets/backgroun1.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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
