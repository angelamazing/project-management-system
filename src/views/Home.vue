<!--
 * @Author: Jerry Han angelamazing@163.com
 * @Date: 2024-10-04 16:06:48
 * @LastEditors: Jerry Han angelamazing@163.com
 * @LastEditTime: 2024-10-17 11:01:14
 * @FilePath: \project-management-system\src\views\Home.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="home">
    <h1>欢迎使用项目管理系统</h1>
    <p>请选择左侧的菜单进入相应模块。</p>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  mounted() {
    this.checkEnvironment();
  },
  methods: {
    checkEnvironment() {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('当前不是生产环境，请注意！');
      }
    }
  }
};
</script>

<style scoped>
.home {
  text-align: center;
  margin-top: 50px;
}

.home h1 {
  font-size: 2em;
  margin-bottom: 20px;
}

.home p {
  font-size: 1.2em;
  color: #666;
}
</style>
