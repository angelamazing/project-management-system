<!--
 * @Author: Jerry Han angelamazing@163.com
 * @Date: 2024-10-04 16:06:48
 * @LastEditors: Jerry Han angelamazing@163.com
 * @LastEditTime: 2024-11-17 10:05:39
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
  text-align: center; /* 内容居中对齐 */
  margin-top: 50px; /* 顶部外边距为 50 像素 */
}

.home h1 {
  font-size: 2em; /* 标题字体大小为 2em */
  margin-bottom: 20px; /* 标题下方外边距为 20 像素 */
}

.home p {
  font-size: 1.2em; /* 段落字体大小为 1.2em */
  color: #666; /* 段落文字颜色为深灰色 */
}
</style>
