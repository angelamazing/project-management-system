<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-10-06 11:07:40
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-10-08 09:26:43
 * @FilePath: \project-management-system\src\components\Form\ProjectDetailsTemplate.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <el-dialog title="项目详情" v-model="visible" @close="closeDialog" width="50%">
      <p><strong>项目名称:</strong> {{ project.name }}</p>
      <p><strong>项目类型:</strong> {{ project.type }}</p>
      <p><strong>状态:</strong> {{ project.status }}</p>
      <p><strong>完成状态:</strong> {{ project.completion }}</p>
      <p><strong>描述:</strong> {{ project.description }}</p>
      
    </el-dialog>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  import { ElDialog,  } from 'element-plus';
  import 'element-plus/dist/index.css';
  
  defineProps({ project: Object, isVisible: Boolean });
  
  const emit = defineEmits(['update:isVisible']);
  
  const closeDialog = () => {
    emit('update:isVisible', false);
  };
  </script>
  
  <style scoped>
  .el-dialog {
    border-radius: 8px;
  }
  </style>