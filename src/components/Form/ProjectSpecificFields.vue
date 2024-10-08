<template>
    <div>
      <el-form-item v-if="isRepairProject" label="治理项目规模" required>
        <el-select v-model="localForm.repair_scale" placeholder="请选择治理项目规模">
          <el-option v-for="(scale, index) in repairScales" :key="index" :label="scale.label" :value="scale.value"></el-option>
        </el-select>
      </el-form-item>
  
      <el-form-item v-if="isDrillingProject" label="钻机数量" required>
        <el-select v-model="localForm.drill_machine_count" placeholder="请选择钻机数量">
          <el-option v-for="(drill, index) in drillCounts" :key="index" :label="drill.label" :value="drill.value"></el-option>
        </el-select>
      </el-form-item>
  
      <el-form-item v-if="isSurveyProject" label="同时野外调查人员" required>
        <el-select v-model="localForm.field_investigator_count" placeholder="请选择同时野外调查人员数量">
          <el-option v-for="(investigator, index) in investigatorCounts" :key="index" :label="investigator.label" :value="investigator.value"></el-option>
        </el-select>
      </el-form-item>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      projectType: String,
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
      isRepairProject() {
        return this.projectType === '地灾治理和矿山生态修复类';
      },
      isDrillingProject() {
        return this.projectType === '地质勘察钻探类';
      },
      isSurveyProject() {
        return this.projectType === '地质调查、测量测绘类';
      },
      repairScales() {
        return [
          { label: '治理项目规模 300 万以上 (8分)', value: '8' },
          { label: '治理项目规模 100~300 万 (7分)', value: '7' },
          { label: '治理项目规模 100 万以下 (6分)', value: '6' },
        ];
      },
      drillCounts() {
        return [
          { label: '钻机数量 10 台及以上 (8分)', value: '8' },
          { label: '钻机数量 6~9 台 (7分)', value: '7' },
          { label: '钻机数量 5 台 (6分)', value: '6' },
          { label: '钻机数量 3~4 台 (5分)', value: '5' },
          { label: '钻机数量 1~2 台 (4分)', value: '4' },
        ];
      },
      investigatorCounts() {
        return [
          { label: '同时野外调查人员 8 人及以上 (8分)', value: '8' },
          { label: '同时野外调查人员 7 人 (7分)', value: '7' },
          { label: '同时野外调查人员 6 人 (6分)', value: '6' },
          { label: '同时野外调查人员 5 人 (5分)', value: '5' },
          { label: '同时野外调查人员 4 人 (4分)', value: '4' },
          { label: '同时野外调查人员 3 人 (3分)', value: '3' },
          { label: '同时野外调查人员 2 人 (2分)', value: '2' },
        ];
      },
    },
  };
  </script>
  
  <style scoped>
  /* 可根据需要添加样式 */
  </style>