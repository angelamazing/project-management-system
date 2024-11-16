<template>
  <div>
    <!-- 未提交项目列表 -->
    <el-card>
      <h2>未提交项目列表</h2>
      <el-table :data="unsubmittedProjects" style="width: 100%">
        <el-table-column prop="project_name" label="项目名称"></el-table-column>
        <el-table-column prop="project_type" label="项目类型"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button @click="openEditDialog(row)" type="primary" size="small">查看详情</el-button>
            <el-button @click="confirmDelete(row)" type="danger" size="small" style="margin-left: 10px;">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 录入项目按钮 -->
    <el-button type="primary" @click="openCreateDialog" style="margin-top: 20px;">
      录入新项目
    </el-button>

    <!-- 录入/修改项目信息的弹窗 -->
    <el-dialog :title="dialogTitle" v-model="showDialog" width="60%" @close="resetForm">
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

        <el-form-item v-if="isRepairProject" label="治理项目规模" required>
          <el-select v-model="projectForm.repair_scale" placeholder="请选择治理项目规模">
            <el-option v-for="scale in repairScales" :key="scale.value" :label="scale.label" :value="scale.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="isDrillingProject" label="钻机数量" required>
          <el-select v-model="projectForm.drill_machine_count" placeholder="请选择钻机数量">
            <el-option v-for="drill in drillCounts" :key="drill.value" :label="drill.label" :value="drill.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="isSurveyProject" label="同时野外调查人员" required>
          <el-select v-model="projectForm.field_investigator_count" placeholder="请选择同时野外调查人员数量">
            <el-option v-for="investigator in investigatorCounts" :key="investigator.value" :label="investigator.label" :value="investigator.value"></el-option>
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
          <el-input
            v-if="projectForm.surrounding_risks === 'custom'"
            v-model="projectForm.custom_surrounding_risks"
            placeholder="请描述周边环境并给出分数（0-10分）"
            style="margin-top: 10px;"
          ></el-input>
          <div class="risk-description">
            注：风险项包括临水、临边、临电、临近交通要道、山区环境。
            若不存在上述风险，可选择"其他"并根据施工对周边居民影响、场地平整程度、交通便利情况等在0~10分内酌情打分。
          </div>
        </el-form-item>

        <!-- 场地内部环境 -->
        <el-form-item label="场地内部环境" required>
          <el-checkbox-group v-model="projectForm.internal_conditions">
            <el-checkbox
              v-for="condition in internalConditions"
              :key="condition"
              :value="condition"
            >
              {{ condition }}
            </el-checkbox>
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
              v-for="experience in managementExperiences"
              :key="experience.value"
              :label="experience.label"
              :value="experience.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="专业结构" required>
          <el-select v-model="projectForm.professional_structure" placeholder="请选择专业结构">
            <el-option
              v-for="structure in professionalStructures"
              :key="structure.value"
              :label="structure.label"
              :value="structure.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="学历层次" required>
          <el-select v-model="projectForm.education_level" placeholder="请选择学历">
            <el-option
              v-for="education in educationLevels"
              :key="education.value"
              :label="education.label"
              :value="education.value"
            />
          </el-select>
        </el-form-item>

        <!-- 分包队伍信息 -->
        <el-form-item label="队伍平均年龄" required>
          <el-select v-model="projectForm.subcontract_avg_age" placeholder="请选择平均年龄">
            <el-option
              v-for="age in subcontractAges"
              :key="age.value"
              :label="age.label"
              :value="age.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="经验" required>
          <el-select v-model="projectForm.subcontract_experience" placeholder="请选择经验">
            <el-option
              v-for="exp in subcontractExperiences"
              :key="exp.value"
              :label="exp.label"
              :value="exp.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="学历" required>
          <el-select v-model="projectForm.subcontract_education" placeholder="请选择学历">
            <el-option
              v-for="edu in subcontractEducationLevels"
              :key="edu.value"
              :label="edu.label"
              :value="edu.value"
            />
          </el-select>
        </el-form-item>

        <!-- 保存和提交按钮 -->
        <el-form-item>
          <el-button type="primary" @click="handleSave">保存项目</el-button>
          <el-button type="success" @click="handleSubmit">提交审核</el-button>
          <el-button type="info" @click="testBackendInteraction">测试后端交互</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useStore } from 'vuex';
import ConstructionTechniques from './Form/ConstructionTechniques.vue';
import { useProjectForm } from '@/composables/useProjectForm';
import { useUnsubmittedProjects } from '@/composables/useUnsubmittedProjects';
// 项目表单选项
import {
  projectTypes,
  repairScales,
  drillCounts,
  investigatorCounts,
  surroundingRisks,
  internalConditions,
  managementExperiences,
  professionalStructures,
  educationLevels,
  subcontractAges,
  subcontractExperiences,
  subcontractEducationLevels
} from '@/constants/projectFormOptions';

const {
  projectForm,
  resetForm,
  isProjectComplete,
  updateConstructionData,
  onProjectTypeChange,
  isRepairProject,
  isDrillingProject,
  isSurveyProject
} = useProjectForm();

const {
  unsubmittedProjects,
  addProject,
  updateProject,
  deleteProject
} = useUnsubmittedProjects();

// 状态管理
const store = useStore();
const userId = computed(() => store.getters.userId);

// 弹窗状态
const showDialog = ref(false);
const currentAction = ref('');

// 弹窗标题
const dialogTitle = computed(() => currentAction.value === 'create' ? '新建项目' : '编辑项目');

// 弹窗操作
const openCreateDialog = () => {
  resetForm();
  currentAction.value = 'create';
  showDialog.value = true;
};
const openEditDialog = (project) => {
  resetForm();
  currentAction.value = 'edit';
  Object.assign(projectForm.value, project);
  showDialog.value = true;
};
const handleSave = () => {
    try {
      if (currentAction.value === 'create') {
        addProject({ ...projectForm.value, creatorId: userId.value,})
      } else {
        updateProject(projectForm.value);
      }
      showDialog.value = false;
      resetForm();
      ElMessage.success('项目保存成功');
    } catch (error) {
      ElMessage.error(`保存项目错误: ${error.message}`);
    }
};
const handleSubmit = () => {
  if (isProjectComplete()) {
    deleteProject(projectForm.value);
    projectForm.value.status = '提交审核';
    showDialog.value = false;
    resetForm();
    ElMessage.success('项目已成功提交审核');
  } else {
    ElMessage.warning('请填写所有必填信息后再提交审核');
  }
};
const confirmDelete = (project) => {
  ElMessageBox.confirm(
    `确定要删除项目 "${project.project_name}" 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      deleteProject(project);
      ElMessage.success('删除成功');
    })
    .catch(() => {
      ElMessage.info('已取消删除');
    });
};

async function testBackendInteraction() {
  try {
    const response = await fetch('http://localhost:3000/api/project');
    if (!response.ok) {
      throw new Error('网络响应不是 OK');
    }
    const data = await response.json();
    projectForm.value = data
    console.log('获取到的项目数据:', data);
    // 在这里处理获取到的数据
  } catch (error) {
    console.error('获取项目数据时出错:', error);
  }
}
</script>

<style scoped>
.risk-description {
  font-size: 12px;
  color: #606266;
  margin-top: 5px;
}
</style>
