<template>
  <div>
    <!-- 查看未提交项目列表 -->
    <el-card>
      <h2>未提交项目列表</h2>
      <el-table :data="unsubmittedProjects" style="width: 100%">
        <el-table-column prop="project_name" label="项目名称"></el-table-column>
        <el-table-column prop="project_type" label="项目类型"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button @click="openEditDialog(row)" type="primary" size="small">查看详情</el-button>
            <el-button @click="deleteProject(row)" type="danger" size="small" style="margin-left: 10px;">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 录入项目按钮 -->
    <el-button type="primary" @click="openCreateDialog" style="margin-top: 20px;">
      录入新项目
    </el-button>

    <!-- 录入/修改项目信息的弹窗 -->
    <el-dialog title="项目信息" v-model="showDialog" width="60%" @close="resetForm">
      <el-form :model="projectForm" @submit.prevent="handleSave" label-width="120px">
        <!-- 项目信息 -->
        <el-form-item label="项目名称" required>
          <el-input v-model="projectForm.project_name"></el-input>
        </el-form-item>

        <el-form-item label="项目类型" required>
          <el-select v-model="projectForm.project_type" placeholder="请选择项目类型" @change="onProjectTypeChange">
            <el-option
              v-for="type in projectTypes"
              :key="type"
              :label="type"
              :value="type"
            />
          </el-select>
        </el-form-item>

        <!-- 动态表单项 -->
        <el-form-item v-if="isRepairProject" label="治理项目规模" required>
          <el-select v-model="projectForm.repair_scale" placeholder="请选择治理项目规模">
            <el-option v-for="(scale, index) in repairScales" :key="index" :label="scale.label" :value="scale.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="isDrillingProject" label="钻机数量" required>
          <el-select v-model="projectForm.drill_machine_count" placeholder="请选择钻机数量">
            <el-option v-for="(drill, index) in drillCounts" :key="index" :label="drill.label" :value="drill.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="isSurveyProject" label="同时野外调查人员" required>
          <el-select v-model="projectForm.field_investigator_count" placeholder="请选择同时野外调查人员数量">
            <el-option v-for="(investigator, index) in investigatorCounts" :key="index" :label="investigator.label" :value="investigator.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="周边环境" required>
          <el-select v-model="projectForm.surrounding_risks" placeholder="请选择周边环境">
            <el-option
              v-for="risk in surroundingRisks"
              :key="risk.value"
              :label="risk.label"
              :value="risk.value"
            />
          </el-select>
        </el-form-item>

        <!-- 场地内部环境 -->
        <el-form-item label="场地内部环境">
          <el-checkbox-group v-model="projectForm.internal_conditions">
            <el-checkbox
              v-for="condition in internalConditions"
              :key="condition"
              :label="condition"
            />
          </el-checkbox-group>
        </el-form-item>

        <!-- 引入施工工艺组件 -->
        <construction-techniques 
          :initialData="projectForm.construction" 
          @updateData="updateConstructionData" 
        />

        <!-- 团队管理信息 -->
        <el-form-item label="管理经验" required>
          <el-select v-model="projectForm.management_experience" placeholder="请选择管理经验">
            <el-option
              v-for="(experience, index) in managementExperiences"
              :key="index"
              :label="experience.label"
              :value="experience.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="专业结构" required>
          <el-select v-model="projectForm.professional_structure" placeholder="请选择专业结构">
            <el-option
              v-for="(structure, index) in professionalStructures"
              :key="index"
              :label="structure.label"
              :value="structure.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="学历层次" required>
          <el-select v-model="projectForm.education_level" placeholder="请选择学历">
            <el-option
              v-for="(education, index) in educationLevels"
              :key="index"
              :label="education.label"
              :value="education.value"
            />
          </el-select>
        </el-form-item>

        <!-- 分包队伍信息 -->
        <el-form-item label="队伍平均年龄" required>
          <el-select v-model="projectForm.subcontract_avg_age" placeholder="请选择平均年龄">
            <el-option
              v-for="(age, index) in subcontractAges"
              :key="index"
              :label="age.label"
              :value="age.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="经验" required>
          <el-select v-model="projectForm.subcontract_experience" placeholder="请选择经验">
            <el-option
              v-for="(exp, index) in subcontractExperiences"
              :key="index"
              :label="exp.label"
              :value="exp.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="学历" required>
          <el-select v-model="projectForm.subcontract_education" placeholder="请选择学历">
            <el-option
              v-for="(edu, index) in subcontractEducationLevels"
              :key="index"
              :label="edu.label"
              :value="edu.value"
            />
          </el-select>
        </el-form-item>

        <!-- 开工和完工日期 -->
        <el-form-item label="开工日期" required>
          <el-date-picker v-model="projectForm.start_date" type="date" placeholder="选择开始日期"></el-date-picker>
        </el-form-item>

        <el-form-item label="完工日期" required>
          <el-date-picker v-model="projectForm.end_date" type="date" placeholder="选择结束日期"></el-date-picker>
        </el-form-item>

        <!-- 保存和提交按钮 -->
        <el-form-item>
          <el-button type="primary" @click="handleSave">保存项目</el-button>
          <el-button type="success" @click="handleSubmit">提交审核</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import cloneDeep from 'lodash/cloneDeep';
import ConstructionTechniques from './Form/ConstructionTechniques.vue'; // 子组件
// 引入 lodash 的 cloneDeep


const showDialog = ref(false);
const unsubmittedProjects = ref([
  { id: 1, project_name: '项目1', project_type: '地灾治理和矿山生态修复类', status: '未提交' },
  { id: 2, project_name: '项目2', project_type: '地质勘查钻探类', status: '未提交' },
]);

const projectForm = ref({
  project_name: '',
  project_type: '',
  surrounding_risks: '',
  internal_conditions: [],
  management_experience: '',
  professional_structure: '',
  education_level: '',
  subcontract_avg_age: '',
  subcontract_experience: '',
  subcontract_education: '',
  start_date: '',
  end_date: '',
  status: '未提交',
  construction: {}, // 施工工艺初始数据
});

const currentAction = ref('');

const isRepairProject = computed(() => projectForm.value.project_type === '地灾治理和矿山生态修复类');
const isDrillingProject = computed(() => projectForm.value.project_type === '地质勘查钻探类');
const isSurveyProject = computed(() => projectForm.value.project_type === '地质调查、测量测绘类');

const projectTypes = ['地灾治理和矿山生态修复类', '地质勘查钻探类', '地质调查、测量测绘类'];
const repairScales = [
  { label: '治理项目规模 300 万以上 (8分)', value: '8' },
  { label: '治理项目规模 100~300 万 (7分)', value: '7' },
  { label: '治理项目规模 100 万以下 (6分)', value: '6' },
];
const drillCounts = [
  { label: '钻机数量 10 台及以上 (8分)', value: '8' },
  { label: '钻机数量 6~9 台 (7分)', value: '7' },
  { label: '钻机数量 5 台 (6分)', value: '6' },
  { label: '钻机数量 3~4 台 (5分)', value: '5' },
  { label: '钻机数量 1~2 台 (4分)', value: '4' },
];
const investigatorCounts = [
  { label: '同时野外调查人员 8 人及以上 (8分)', value: '8' },
  { label: '同时野外调查人员 7 人 (7分)', value: '7' },
  { label: '同时野外调查人员 6 人 (6分)', value: '6' },
  { label: '同时野外调查人员 5 人 (5分)', value: '5' },
  { label: '同时野外调查人员 4 人 (4分)', value: '4' },
  { label: '同时野外调查人员 3 人 (3分)', value: '3' },
  { label: '同时野外调查人员 2 人 (2分)', value: '2' },
];
const surroundingRisks = [
  { label: '存在一项风险 (6分)', value: '6' },
  { label: '存在两项风险 (7分)', value: '7' },
  { label: '存在三项风险 (8分)', value: '8' },
  { label: '存在四项风险 (9分)', value: '9' },
  { label: '存在五项风险 (10分)', value: '10' },
  { label: '无风险', value: '0' },
];
const internalConditions = [
  '场地平整',
  '空间宽阔',
  '消防设施齐全',
  '消防通道畅通',
  '机械设备性能良好',
  '临时防护安全有效',
  '临时水电设施安全规范',
  '办公环境安全良好',
  '生活环境安全良好',
  '材料堆放区规划合理',
];
const managementExperiences = [
  { label: '未从事过类似项目管理 (8分)', value: '8' },
  { label: '从事过类似项目管理 1 个 (5分)', value: '5' },
  { label: '从事过类似项目管理 2 个 (3分)', value: '3' },
  { label: '从事过类似项目管理超过 2 个 (0分)', value: '0' },
];
const professionalStructures = [
  { label: '非工程类专业 (2分)', value: '2' },
  { label: '工程类非对口专业 (1分)', value: '1' },
  { label: '工程类对口专业 (0分)', value: '0' },
];
const educationLevels = [
  { label: '本科以下学历 (2分)', value: '2' },
  { label: '本科及以上学历 (非地质院校) (1分)', value: '1' },
  { label: '本科及以上学历 (地质院校) (0分)', value: '0' },
];
const subcontractAges = [
  { label: '超过 50 岁 (10分)', value: '10' },
  { label: '40 岁~50 岁 (8分)', value: '8' },
  { label: '30 岁~40 岁 (6分)', value: '6' },
  { label: '小于 30 岁 (0分)', value: '0' },
];
const subcontractExperiences = [
  { label: '未从事过类似项目 (10分)', value: '10' },
  { label: '从事过类似业绩 1 个 (8分)', value: '8' },
  { label: '从事过类似业绩 2 个 (6分)', value: '6' },
  { label: '从事过类似业绩超过 2 个 (0分)', value: '0' },
];
const subcontractEducationLevels = [
  { label: '初中及以下超过 20% (10 分)', value: '10' },
  { label: '初中及以下低于 20% (6 分)', value: '6' },
  { label: '全部为初中以上 (0 分)', value: '0' },
];

const openCreateDialog = () => {
  resetForm();
  currentAction.value = 'create';
  showDialog.value = true;
};

const openEditDialog = (project) => {
  resetForm();
  currentAction.value = 'edit';
  projectForm.value = cloneDeep(project); // 深拷贝整个项目数据
  projectForm.value.construction = cloneDeep(project.construction); // 深拷贝施工工艺部分
  showDialog.value = true;
};

const updateConstructionData = (newData) => {
  projectForm.value.construction = { ...newData }; // 接收并更新施工工艺数据
};

const handleSave = () => {
  console.log('保存的项目数据:', projectForm.value); // 调试输出
  if (currentAction.value === 'create') {
    const newProjectId = unsubmittedProjects.value.length + 1;
    unsubmittedProjects.value.push({ ...projectForm.value, id: newProjectId });
  } else if (currentAction.value === 'edit') {
    const index = unsubmittedProjects.value.findIndex((p) => p.id === projectForm.value.id);
    if (index !== -1) {
      unsubmittedProjects.value.splice(index, 1, cloneDeep(projectForm.value)); // 深拷贝确保数据独立
    }
  }
  showDialog.value = false;
  resetForm();
};

const handleSubmit = () => {
  const index = unsubmittedProjects.value.findIndex((p) => p.project_name === projectForm.value.project_name);
  if (index !== -1) {
    unsubmittedProjects.value.splice(index, 1); // 从未提交列表中移除项目
    projectForm.value.status = '提交审核'; // 更新项目状态
  }
  showDialog.value = false;
  resetForm();
};

const deleteProject = (project) => {
  const index = unsubmittedProjects.value.findIndex((p) => p.project_name === project.project_name);
  if (index !== -1) {
    unsubmittedProjects.value.splice(index, 1);
  }
};

const resetForm = () => {
  projectForm.value = {
    project_name: '',
    project_type: '',
    surrounding_risks: '',
    internal_conditions: [],
    management_experience: '',
    professional_structure: '',
    education_level: '',
    subcontract_avg_age: '',
    subcontract_experience: '',
    subcontract_education: '',
    start_date: '',
    end_date: '',
    status: '未提交',
    repair_scale: '',
    drill_machine_count: '',
    field_investigator_count: '',
    construction: cloneDeep({}), // 确保施工工艺初始值
  };
};

const onProjectTypeChange = () => {
  // 根据项目类型变化逻辑
};
</script>

<style scoped>
/* 样式 */
</style>