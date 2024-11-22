<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-10-04 16:06:48
 * @LastEditors: Jerry House angelamazing@163.com
 * @LastEditTime: 2024-11-22 16:46:33
 * @FilePath: \project-management-system\src\components\ReviewProjects.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE%E8%AE%BE%E8%AE%BE
-->
<template>
  <div class="review-projects">
    <el-table :data="projects" style="width: 100%">
      <el-table-column prop="projectName" label="项目名称"></el-table-column>
      <el-table-column prop="projectType" label="项目类型"></el-table-column>
      <el-table-column prop="status" label="状态"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" size="small" @click="reviewProject(scope.row)">审核</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="reviewDialogVisible"
      title="项目审核"
      :close-on-click-modal="false"
      width="80%"
    >
      <div class="dialog-content">
        <div class="project-details">
          <h3>项目基础信息</h3>
          <p><strong>项目名称:</strong> {{ currentProject.projectName }}</p>
          <p><strong>创建人:</strong> {{ currentProject.creator }}</p>
          <p><strong>状态:</strong> {{ currentProject.status }}</p>
          <p><strong>项目类型:</strong> {{ currentProject.projectType }}</p>
          <p><strong>项目规模:</strong> {{ currentProject.projectScale }}</p>
          <p><strong>周边环境:</strong> {{ currentProject.surroundingRisks }}</p>
          <p><strong>内部环境:</strong> {{ currentProject.internalConditions }}</p>
          <p><strong>其他说明:</strong> {{ currentProject.customSurroundingRisks }}</p>

          <h3>施工工艺</h3>
          <ul>
            <li v-for="item in formattedConstructionProcess" :key="item.label">
              <strong>{{ item.label }}:</strong> {{ item.selectedLabel }}
            </li>
          </ul>

          <h3>团队管理信息</h3>
          <p><strong>管理经验:</strong> {{ currentProject.managementExperience }}</p>
          <p><strong>专业构:</strong> {{ currentProject.professionalStructure }}</p>
          <p><strong>学历层次:</strong> {{ currentProject.educationLevel }}</p>

          <h3>分包队伍信息</h3>
          <p><strong>队伍平均年龄:</strong> {{ currentProject.subcontractAvgAge }}</p>
          <p><strong>队伍经验:</strong> {{ currentProject.subcontractExperience }}</p>
          <p><strong>队伍学历:</strong> {{ currentProject.subcontractEducation }}</p>
        </div>

        <div class="review-section">
          <div class="review-scores">
            <el-divider>初始得分信息</el-divider>
            <h4>项目基础信息得分: {{ partialScores[0] }}</h4>
            <h4>施工工艺得分: {{ partialScores[1] }}</h4>
            <h4>团队管理信息得分: {{ partialScores[2] }}</h4>
            <h4>分包队伍信息得分: {{ partialScores[3] }}</h4>
          </div>

          <div class="review-inputs">
            <el-divider>审核信息</el-divider>
            <el-form>
              <el-form-item label="项目基础信息得分" class="review-form-item">
                <el-input-number v-model="adjustedScores.constructionTechnique" :min="0" :max="100" :step="1"></el-input-number>
              </el-form-item>
              <el-form-item label="施工工艺得分" class="review-form-item">
                <el-input-number v-model="adjustedScores.projectManagement" :min="0" :max="100" :step="1"></el-input-number>
              </el-form-item>
              <el-form-item label="团队管理信息得分" class="review-form-item">
                <el-input-number v-model="adjustedScores.safetyMeasures" :min="0" :max="100" :step="1"></el-input-number>
              </el-form-item>
              <el-form-item label="分包队伍信息得分" class="review-form-item">
                <el-input-number v-model="adjustedScores.subcontractTeam" :min="0" :max="100" :step="1"></el-input-number>
              </el-form-item>
              <el-form-item label="评审意见" class="review-form-item">
                <el-input v-model="reviewComment" type="textarea"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="reviewDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitReview">审核</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import axios from '@/axios';

export default {
  name: 'ReviewProjects',
  setup() {
    const projects = ref([]);
    
    const fetchProjectDetails = async (id) => {
      try {
        const response = await axios.get(`/projectApprovals/find/${id}`);
        if (response.data.code === 1) {
          currentProject.value = response.data.data;
          currentProject.value.id = id;
          console.log(currentProject.value.id)
          
          
          if (typeof response.data.data.partialScore === 'string') {
            const scores = response.data.data.partialScore.split(',').map(Number);
            reviewScores.constructionTechnique = scores[0] || 0;
            reviewScores.projectManagement = scores[1] || 0;
            reviewScores.safetyMeasures = scores[2] || 0;
          }
        } else {
          ElMessage.error(response.data.msg);
        }
      } catch (error) {
        ElMessage.error('获取项目详细信息失败');
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await axios.get('/projectMessages/finds', {
          params: {
            status: "待审核",
            page: 1,
            pageSize: 10
          }
        });
        if (response.data.code === 1) {
          projects.value = response.data.data.rows;
        } else {
          ElMessage.error(response.data.msg);
        }
      } catch (error) {
        ElMessage.error('获取项目列表失败');
      }
    };

    const reviewProject = async (project) => {
      reviewDialogVisible.value = true;
      await fetchProjectDetails(project.id);
      
      adjustedScores.constructionTechnique = Number(partialScores.value[0]) || 0;
      adjustedScores.projectManagement = Number(partialScores.value[1]) || 0;
      adjustedScores.safetyMeasures = Number(partialScores.value[2]) || 0;
      adjustedScores.subcontractTeam = Number(partialScores.value[3]) || 0;
      reviewComment.value = '';
    };

    fetchProjects();

    const reviewDialogVisible = ref(false);
    const currentProject = ref({});
    const reviewScores = reactive({
      constructionTechnique: 0,
      projectManagement: 0,
      safetyMeasures: 0,
    });
    const reviewComment = ref('');

    const adjustedScores = reactive({
      constructionTechnique: 0,
      projectManagement: 0,
      safetyMeasures: 0,
      subcontractTeam: 0,
    });

    const partialScores = computed(() => {
      return currentProject.value.partialScore ? currentProject.value.partialScore.split('，') : [];
    });

    const formattedConstructionProcess = computed(() => {
      if (!currentProject.value.constructionProcess) {
        return [];
      }

      const result = [];
      
      if (currentProject.value.constructionProcess.disasterItems) {
        const disasterItems = currentProject.value.constructionProcess.disasterItems
          .map(item => {
            const selectedOption = item.options.find(option => option.value === item.model);
            return {
              label: item.label,
              selectedLabel: selectedOption ? selectedOption.label : ''
            };
          })
          .filter(item => item.selectedLabel && !item.selectedLabel.includes('0分'));
        result.push(...disasterItems);
      }

      if (currentProject.value.constructionProcess.constructionType === '地质勘察钻探类') {
        const equipmentValue = currentProject.value.constructionProcess.largeDrillingEquipment;
        const equipmentLabel = equipmentValue === '16' 
          ? '大型钻探设备或中深孔钻探超过20% (16分)'
          : '无大型钻探设备 (0分)';
        
        result.push({
          label: '钻探设备',
          selectedLabel: equipmentLabel
        });

        if (currentProject.value.constructionProcess.safetyThreats?.length > 0) {
          result.push({
            label: '安全威胁',
            selectedLabel: currentProject.value.constructionProcess.safetyThreats.join('、')
          });
        }
      }

      return result;
    });

    const submitReview = async () => {
      try {
        console.log(currentProject.value.id)
        const totalScore = Object.values(adjustedScores).reduce((sum, score) => sum + score, 0);
        const response = await axios.put('/projectApprovals/update', {
          projectId: currentProject.value.id,
          reviewComments: reviewComment.value,
          status: '已审核',
          partialScore: Object.values(adjustedScores).join(','),
          totalScore: totalScore
          
        })
   
        if (response.data.code === 1) {
          ElMessage.success('审核提交成功');
          reviewDialogVisible.value = false;
          fetchProjects(); // Refresh the project list
        } else {
          ElMessage.error(response.data.msg);
        }
      } catch (error) {
        ElMessage.error('提交审核失败');
      }
    };

    const returnProject = () => {
      ElMessageBox.confirm(
        '确定要将项目退回修改吗？',
        '退回确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        const index = projects.value.findIndex(p => p.id === currentProject.value.id);
        if (index !== -1) {
          projects.value[index].status = '退回修改';
          projects.value[index].reviewComment = reviewComment.value;
          
          ElMessage.success('项目已退回修改');
          reviewDialogVisible.value = false;
        } else {
          ElMessage.error('项目未找到，无法退回');
        }
      }).catch(() => {
        ElMessage.info('已取消退回操作');
      });
    };

    return {
      projects,
      reviewDialogVisible,
      currentProject,
      reviewScores,
      reviewComment,
      reviewProject,
      submitReview,
      returnProject,
      formattedConstructionProcess,
      adjustedScores,
      partialScores,
    };
  }
};
</script>

<style scoped>
.review-projects {
  padding: 20px;
}

.dialog-content {
  display: flex;
}

.project-details {
  flex: 1;
  margin-right: 20px;
}

.review-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.review-scores {
  margin-bottom: 20px;
}

.review-inputs {
  margin-top: 20px;
}

.dialog-footer {
  text-align: right;
}

.review-form-item :deep(.el-form-item__label) {
  width: 130px;  /* 设置固定宽度 */
  text-align: right;
  margin-right: 12px;
}

.review-form-item {
  display: flex;
  align-items: center;
}
</style>
