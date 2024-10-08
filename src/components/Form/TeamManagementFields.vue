<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-10-06 11:00:47
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-10-06 11:00:53
 * @FilePath: \project-management-system\src\components\Form\TeamManagementFields.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div>
      <!-- 团队管理信息 -->
      <el-form-item label="管理经验" required>
        <el-select v-model="localForm.management_experience" placeholder="请选择管理经验">
          <el-option v-for="(experience, index) in managementExperiences" :key="index" :label="experience.label" :value="experience.value"></el-option>
        </el-select>
      </el-form-item>
  
      <el-form-item label="专业结构" required>
        <el-select v-model="localForm.professional_structure" placeholder="请选择专业结构">
          <el-option v-for="(structure, index) in professionalStructures" :key="index" :label="structure.label" :value="structure.value"></el-option>
        </el-select>
      </el-form-item>
  
      <el-form-item label="学历层次" required>
        <el-select v-model="localForm.education_level" placeholder="请选择学历">
          <el-option v-for="(education, index) in educationLevels" :key="index" :label="education.label" :value="education.value"></el-option>
        </el-select>
      </el-form-item>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      form: Object,
    },
    data() {
      return {
        localForm: { ...this.form },
      };
    },
    watch: {
      form: {
        handler(newValue) {
          this.localForm = { ...newValue };
        },
        deep: true,
      },
      localForm: {
        handler(newValue) {
          this.$emit('update:form', newValue);
        },
        deep: true,
      },
    },
    computed: {
      managementExperiences() {
        return [
          { label: '未从事过类似项目管理 (8分)', value: '8' },
          { label: '从事过类似项目管理 1 个 (5分)', value: '5' },
          { label: '从事过类似项目管理 2 个 (3分)', value: '3' },
          { label: '从事过类似项目管理超过 2 个 (0分)', value: '0' },
        ];
      },
      professionalStructures() {
        return [
          { label: '非工程类专业 (2分)', value: '2' },
          { label: '工程类非对口专业 (1分)', value: '1' },
          { label: '工程类对口专业 (0分)', value: '0' },
        ];
      },
      educationLevels() {
        return [
          { label: '本科以下学历 (2分)', value: '2' },
          { label: '本科及以上学历 (非地质院校) (1分)', value: '1' },
          { label: '本科及以上学历 (地质院校) (0分)', value: '0' },
        ];
      },
    },
  };
  </script>
  
  <style scoped>
  /* 可根据需要添加样式 */
  </style>