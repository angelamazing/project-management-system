<template>
  <el-form @submit.prevent="handleLogin">
    <el-form-item>
      <el-input v-model="username" placeholder="用户名"></el-input>
    </el-form-item>
    <el-form-item>
      <el-input v-model="password" type="password" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleLogin">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'SystemLogs',
  data() {
    return {
      username: '',
      password: '',
    }
  },
  methods: {
    handleLogin() {
      // 模拟身份验证
      const user = { username: this.username, role: '普通用户' };
      this.$store.dispatch('login', user);
      this.$router.push('/dashboard');
    }
  }
}
</script>
