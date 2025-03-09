<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-10-04 16:06:48
 * @LastEditors: Jerry House angelamazing@163.com
 * @LastEditTime: 2024-12-10 11:03:13
 * @FilePath: \project-management-system\src\components\Sidebar\AppSidebar.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-menu default-active="1" class="el-menu-vertical-demo" @select="handleSelect">
    <el-menu-item index="1">首页</el-menu-item>
    <el-menu-item index="2" v-if="hasRole(['普通用户','管理员' ])">新建项目</el-menu-item>
    <el-menu-item index="3" v-if="hasRole(['普通用户', '管理员','队领导','部门安全主管','部门安全员','安全主管'])">查看项目</el-menu-item>
    <el-menu-item index="7" v-if="hasRole(['部门安全主管','管理员','部门安全员','安全主管'])">审核项目</el-menu-item>
    <!-- <el-menu-item index="4" v-if="hasRole(['普通用户','安全员', '管理员','队领导'])">项目总览</el-menu-item> -->
    <el-menu-item index="5" v-if="hasRole(['管理员'])">用户管理</el-menu-item>
    <el-menu-item index="6" v-if="hasRole(['管理员'])">系统日志</el-menu-item>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'AppSidebar',
  computed: {
    ...mapGetters(['userRole']) // 从 Vuex 获取用户角色
  },
  methods: {
    handleSelect(index) {
      switch (index) {
        case '1':
          this.$router.push('/dashboard/overview');
          break;
        case '2':
          this.$router.push('/dashboard/new-project');
          break;
        case '3':
          this.$router.push('/dashboard/projects');
          break;
        // case '4':
          // this.$router.push('/dashboard/overview');
          // break;
        case '5':
          this.$router.push('/dashboard/users');
          break;
        case '6':
          this.$router.push('/dashboard/logs');
          break;
        case '7':
          this.$router.push('/dashboard/review');
          break;
      }
    },
    hasRole(requiredRoles) {
      return requiredRoles.includes(this.userRole); // 判断用户角色是否有权限访问对应菜单项
    }
  }
}
</script>
