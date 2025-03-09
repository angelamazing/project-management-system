<template>
  <div>
    <!-- 未提交项目列表 -->
    <el-card>
      <h2>未提交项目列表</h2>
      <el-table :data="unsubmittedProjects" style="width: 100%">
        <el-table-column 
          label="项目名称">
          <template #default="{ row }">
            <span :class="{ 'red-text': row.rollback }">{{ row.projectName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="projectType" label="项目类型"></el-table-column>
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
        <h4 style="text-align: center;">项目基础信息</h4>
        <el-form-item label="项目名称" required>
          <el-input v-model="projectForm.projectName"></el-input>
        </el-form-item>

        <el-form-item label="项目类型" required>
          <el-select v-model="projectForm.projectType" placeholder="请选择项目类型" @change="onProjectTypeChange">
            <el-option
              v-for="type in projectTypes"
              :key="type"
              :label="type"
              :value="type"
            />
          </el-select>
        </el-form-item>

        <el-form-item v-if="isRepairProject" label="治理项目规模" required>
          <el-select v-model="projectForm.projectScale" placeholder="请选择治理项目规模">
            <el-option v-for="scale in repairScales" :key="scale.value" :label="scale.label" :value="scale.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="isDrillingProject" label="钻机数量" required>
          <el-select v-model="projectForm.projectScale" placeholder="请选择钻机数量">
            <el-option v-for="drill in drillCounts" :key="drill.value" :label="drill.label" :value="drill.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="isSurveyProject" label="同时野外调查人员" required>
          <el-select v-model="projectForm.projectScale" placeholder="请选择同时野外调查人员数量">
            <el-option v-for="investigator in investigatorCounts" :key="investigator.value" :label="investigator.label" :value="investigator.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="周边环境" required>
          <el-select v-model="projectForm.surroundingRisks" placeholder="请选择周边环境">
            <el-option
              v-for="risk in surroundingRisks"
              :key="risk.value" 
              :label="risk.label"
              :value="risk.value"
            />
          </el-select>
          <el-input
            v-if="projectForm.surroundingRisks === 'custom'"
            v-model="projectForm.customSurroundingRisks"
            placeholder="请描述周边环境"
            style="margin-top: 10px;"
          ></el-input>
          <div class="risk-description">
            注：风险项包括临水、临边、临电、临近交通要道、山区环境。
            若不存在上述风险，可选择"其他"并根据施工对周边居民影响、场地平整程度、交通便利情况等在0~10分内酌情打分。
          </div>
        </el-form-item>

        <!-- 场地内部环境 -->
        <el-form-item label="场地内部环境" required>
          <el-checkbox-group v-model="projectForm.internalConditions">
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
        <h4 style="text-align: center;">施工工艺</h4>
        <construction-techniques 
          ref="constructionTechniquesRef"
          :initialData="projectForm.constructionProcess" 
          :projectType="projectForm.projectType"
          @updateData="updateConstructionData"
          @updateTotalScore="updateConstructionProcessScore"
        />

        <!-- 团队管理信息 -->
        <h4 style="text-align: center;">团队管理信息</h4>
        <el-form-item label="管理经验" required>
          <el-select v-model="projectForm.managementExperience" placeholder="请选择管理经验">
            <el-option
              v-for="experience in managementExperiences"
              :key="experience.value"
              :label="experience.label"
              :value="experience.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="专业结构" required>
          <el-select v-model="projectForm.professionalStructure" placeholder="请选择专业结构">
            <el-option
              v-for="structure in professionalStructures"
              :key="structure.value"
              :label="structure.label"
              :value="structure.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="学历层次" required>
          <el-select v-model="projectForm.educationLevel" placeholder="请选择学历">
            <el-option
              v-for="education in educationLevels"
              :key="education.value"
              :label="education.label"
              :value="education.value"
            />
          </el-select>
        </el-form-item>

        <!-- 分包队伍信息 -->
        <h4 style="text-align: center;">分包队伍信息</h4>
        <el-form-item label="队伍平均年龄" required>
          <el-select v-model="projectForm.subcontractAvgAge" placeholder="请选择平均年龄">
            <el-option
              v-for="age in subcontractAges"
              :key="age.value"
              :label="age.label"
              :value="age.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="经验" required>
          <el-select v-model="projectForm.subcontractExperience" placeholder="请选择经验">
            <el-option
              v-for="exp in subcontractExperiences"
              :key="exp.value"
              :label="exp.label"
              :value="exp.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="学历" required>
          <el-select v-model="projectForm.subcontractEducation" placeholder="请选择学历">
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
          <el-button type="info" @click="calculateProjectScore">计算项目分数</el-button>
          
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, } from 'vue';
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
// const userId = computed(() => store.getters.userId);
const username = computed(() => store.getters.username);

// 弹窗状态
const showDialog = ref(false);
const currentAction = ref('');

// 标题
const dialogTitle = computed(() => currentAction.value === 'create' ? '新建项目' : '编辑项目');

// 弹窗操作
const openCreateDialog = () => {
  resetForm();
  // console.log('After reset:', JSON.stringify(projectForm.value, null, 2)); // 检查重置后的值
  // console.log('projectForm.constructionProcess:', projectForm.value.constructionProcess);
  
  currentAction.value = 'create';
  showDialog.value = true;
};
const openEditDialog = (project) => {
  resetForm();
  currentAction.value = 'edit';
  console.log('project',project)
  // Ensure internalConditions is initialized 

  Object.assign(projectForm.value, project);
  
  // console.log('project.internalConditions',project.internalConditions)
  
  if(project.internalConditions.length == 1){
    projectForm.value.internalConditions = project.internalConditions[0].split(',')
  }
  // console.log('projectForm.value.internalConditions',projectForm.value.internalConditions)
  showDialog.value = true;
};
const handleSave = () => {
    try {
      if (currentAction.value === 'create') {
        addProject({ ...projectForm.value,creator:username.value})
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
const handleSubmit = async () => {
  // 添加确认提示框
  ElMessageBox.confirm(
    '您确定要提交审核吗？请确保所有信息无误。',
    '确认提交',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    if (isProjectComplete()) {
      try {
        const scores = calculateProjectScore();
        projectForm.value.partialScore = scores.partialScores.join('，');
        projectForm.value.totalScore = scores.totalScore.toString();
        // 将项目状态设置为 '待审核'
        if (currentAction.value === 'create') {
          projectForm.value.status = '待审核';
          if (Array.isArray(projectForm.value.internalConditions)) {
            projectForm.value.internalConditions = projectForm.value.internalConditions.join(',');
          }

          addProject({ ...projectForm.value, creator: username.value })
        } else {
          projectForm.value.status = '待审核';
          updateProject(projectForm.value);
        }
        showDialog.value = false;
        resetForm();
        ElMessage.success('项目已成功提交审核');
      } catch (error) {
        console.error('提交项目时出错:', error);
        ElMessage.error('提交项目时出错: ' + error.message);
      }
    } else {
      ElMessage.warning('请填写所有必填信息后再提交审核');
    }
  }).catch(() => {
    ElMessage.info('已取消提交审核');
  });
};

const constructionProcessScore = ref(0);

const updateConstructionProcessScore = (score) => {
  constructionProcessScore.value = score;
};

const calculateProjectScore = () => {
  const extractScore = (text) => {
    const match = text.match(/(\d+)\s*分/); // 修改正则表达式以处理空格
    return match ? parseInt(match[1], 10) : 0;
  };

  // 计算项目基础信息部分的分数
  const projectScaleScore = extractScore(projectForm.value.projectScale);
  const surroundingRisksScore = extractScore(projectForm.value.surroundingRisks);
  const internalConditionsScore = 10 - (projectForm.value.internalConditions?.length || 0); // 计算internalConditions的分数
  const basicInfoScore = projectScaleScore + surroundingRisksScore + internalConditionsScore;


  // 计算团队管理信息部分的分数
  const managementExperienceScore = extractScore(projectForm.value.managementExperience);
  const professionalStructureScore = extractScore(projectForm.value.professionalStructure);
  const educationLevelScore = extractScore(projectForm.value.educationLevel);
  const managementScore = managementExperienceScore + professionalStructureScore + educationLevelScore;

  // 计算分包队伍信息部分的分数
  const subcontractAvgAgeScore = extractScore(projectForm.value.subcontractAvgAge); 
  const subcontractExperienceScore = extractScore(projectForm.value.subcontractExperience);
  const subcontractEducationScore = extractScore(projectForm.value.subcontractEducation);
  const subcontractScore = subcontractAvgAgeScore + subcontractExperienceScore + subcontractEducationScore;

  const totalScore = basicInfoScore + managementScore + subcontractScore + constructionProcessScore.value;
  ElMessage.info(`项目基础信息分数: ${basicInfoScore}, 施工工艺分数: ${constructionProcessScore.value}, 团队管理信息分数: ${managementScore}, 分包队伍信息分数: ${subcontractScore}, 总分: ${totalScore}`);
  return {
    partialScores: [basicInfoScore, constructionProcessScore.value, managementScore, subcontractScore],
    totalScore: totalScore
  };
};


const confirmDelete = (project) => {
  ElMessageBox.confirm(
    `确定要删除项目 "${project.projectName}" 吗？`,
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
      ElMessage.info('已取消删删除');
    });
};






</script>

<style scoped>
.risk-description {
  font-size: 12px;
  color: #606266;
  margin-top: 5px;
}
.red-text {
  color: red !important; /* 使用 !important 提高优先级 */
}
</style>
