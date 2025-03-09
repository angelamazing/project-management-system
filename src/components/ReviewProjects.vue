<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-10-04 16:06:48
 * @LastEditors: Jerry House angelamazing@163.com
 * @LastEditTime: 2024-12-09 19:19:20
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
        <div class="left-column">
          <!-- 基本信息 -->
          <section>
            <h3>基本信息</h3>
            <p><strong>项目名称:</strong> {{ currentProject.projectName }}</p>
            <p><strong>创建人:</strong> {{ currentProject.creator }}</p>
            <p><strong>状态:</strong> {{ currentProject.status }}</p>
            <p><strong>项目类型:</strong> {{ currentProject.projectType }}</p>
            <p><strong>项目规模:</strong> {{ currentProject.projectScale }}</p>
            <p><strong>周边环境:</strong> {{ currentProject.surroundingRisks }}</p>
            <p><strong>内部环境:</strong> {{ currentProject.internalConditions }}</p>
            <p><strong>其他说明:</strong> {{ currentProject.customSurroundingRisks }}</p>
          </section>

          <!-- 施工信息 -->
          <section>
            <h3>施工工艺</h3>
            <ul>
              <li v-for="item in formattedConstructionProcess" :key="item.label">
                <strong>{{ item.label }}:</strong> {{ item.selectedLabel }}
              </li>
            </ul>
          </section>

          <!-- 管理信息 -->
          <section>
            <h3>团队管理信息</h3>
            <p><strong>管理经验:</strong> {{ currentProject.managementExperience }}</p>
            <p><strong>专业结构:</strong> {{ currentProject.professionalStructure }}</p>
            <p><strong>学历层次:</strong> {{ currentProject.educationLevel }}</p>
          </section>

          <!-- 队伍信息 -->
          <section>
            <h3>分包队伍信息</h3>
            <p><strong>队伍平均年龄:</strong> {{ currentProject.subcontractAvgAge }}</p>
            <p><strong>队伍经验:</strong> {{ currentProject.subcontractExperience }}</p>
            <p><strong>队伍学历:</strong> {{ currentProject.subcontractEducation }}</p>
          </section>
        </div>

        <div class="right-column">
          <div class="review-section">
            <section class="approval-section">
              <h3>审批信息</h3>
              <div v-for="(part, index) in currentProject.projectApprovalParts" 
                   :key="index" 
                   class="approval-part">
                <h4>{{ part.departmentName || '初始' }}</h4>
                <p><strong>审核人:</strong> {{ part.reviewer || '无' }}</p>
                <p><strong>各部分评审意见:</strong> {{ formatReviewComments(part.reviewComments) || '无' }}</p>
                <p><strong>各部分得分:</strong> {{ part.partialScore || '未评分' }}
                  <span v-if="part.partialScore">(总分: {{ calculatePartTotal(part.partialScore) }})</span>
                </p>
                <p v-if="part.partialReviewComments"><strong>补充意见:</strong> {{ part.partialReviewComments }}</p>
              </div>
              <div class="total-score">
                <p><strong>{{ lastReviewer }}审核总分:</strong> {{ finalScore }}</p>
                <p><strong>风险等级:</strong> {{ finalRiskLevel }}</p>
              </div>
            </section>

            <div class="review-inputs">
              <el-divider>审核信息</el-divider>
              <el-form>
                <el-form-item label="项目基础信息得分" class="review-form-item">
                  <el-input-number v-model="adjustedScores.constructionTechnique" :min="0" :max="100" :step="1"></el-input-number>
                  <el-input v-model="reviewComments.basicInfo" placeholder="该部分评审意见" style="margin-top: 10px;"></el-input>
                </el-form-item>
                <el-form-item label="施工工艺得分" class="review-form-item">
                  <el-input-number v-model="adjustedScores.projectManagement" :min="0" :max="100" :step="1"></el-input-number>
                  <el-input v-model="reviewComments.constructionTechnique" placeholder="该部分评审意见" style="margin-top: 10px;"></el-input>
                </el-form-item>
                <el-form-item label="团队管理信息得分" class="review-form-item">
                  <el-input-number v-model="adjustedScores.safetyMeasures" :min="0" :max="100" :step="1"></el-input-number>
                  <el-input v-model="reviewComments.management" placeholder="该部分评审意见" style="margin-top: 10px;"></el-input>
                </el-form-item>
                <el-form-item label="分包队伍信息得分" class="review-form-item">
                  <el-input-number v-model="adjustedScores.subcontractTeam" :min="0" :max="100" :step="1"></el-input-number>
                  <el-input v-model="reviewComments.subcontract" placeholder="该部分评审意见" style="margin-top: 10px;"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="reviewDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitReview">审核</el-button>
          <el-button type="danger" @click="returnForReassessment">退回重审</el-button>
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
          console.log(response.data.data)

          
          
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
      
      const lastApproval = currentProject.value.projectApprovalParts?.[currentProject.value.projectApprovalParts.length - 1];
      if (lastApproval?.partialScore) {
        const scores = lastApproval.partialScore.split('，').map(Number);
        adjustedScores.constructionTechnique = scores[0] || 0;
        adjustedScores.projectManagement = scores[1] || 0;
        adjustedScores.safetyMeasures = scores[2] || 0;
        adjustedScores.subcontractTeam = scores[3] || 0;
      } else {
        Object.keys(adjustedScores).forEach(key => {
          adjustedScores[key] = 0;
        });
      }
    };

    fetchProjects();

    const reviewDialogVisible = ref(false);
    const currentProject = ref({});
    const reviewScores = reactive({
      constructionTechnique: 0,
      projectManagement: 0,
      safetyMeasures: 0,
    });

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

    const reviewComments = reactive({
      basicInfo: '',
      constructionTechnique: '',
      management: '',
      subcontract: '',
    });

    const submitReview = async () => {
      try {
        // 添加确认对话框
        await ElMessageBox.confirm(
          '请确认审核信息无误，提交后将不可修改',
          '提交确认',
          {
            confirmButtonText: '确认提交',
            cancelButtonText: '返回修改',
            type: 'warning',
          }
        );

        const totalScore = Object.values(adjustedScores).reduce((sum, score) => sum + score, 0);
        const combinedComments = [
          reviewComments.basicInfo,
          reviewComments.constructionTechnique,
          reviewComments.management,
          reviewComments.subcontract
        ].join('~');

        const response = await axios.post('/projectApprovals/add', {
          projectId: currentProject.value.id,
          reviewComments: combinedComments,
          partialScore: Object.values(adjustedScores).join('，'),
          totalScore: totalScore,
          version: currentProject.value.version || 1
          //reject接口多一个，revertToUser：普通用户，部门安全员，部门安全主管
        });
        

        if (response.data.code === 1) {
          ElMessage.success('审核提交成功');
          reviewDialogVisible.value = false;
          fetchProjects(); // Refresh the project list
        } else {
          ElMessage.error(response.data.msg);
        }
      } catch (error) {
        if (error === 'cancel') {
          ElMessage.info('已取消提交');
          return;
        }
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

    const calculatePartTotal = (partialScore) => {
      if (!partialScore) return 0;
      return partialScore.split('，')
        .map(Number)
        .reduce((sum, score) => sum + score, 0);
    };

    const finalScore = computed(() => {
      if (!currentProject.value.projectApprovalParts?.length) return 0;
      
      const lastApproval = currentProject.value.projectApprovalParts[currentProject.value.projectApprovalParts.length - 1];
      if (!lastApproval.partialScore) return 0;
      
      return lastApproval.partialScore.split('，')
        .map(Number)
        .reduce((sum, score) => sum + score, 0);
    });

    const finalRiskLevel = computed(() => {
      if (!currentProject.value.projectApprovalParts?.length) return '未评定';
      
      const lastApproval = currentProject.value.projectApprovalParts[currentProject.value.projectApprovalParts.length - 1];
      return lastApproval.riskLevel || '未评定';
    });

    // 添加格式化评审意见的函数
    const formatReviewComments = (comments) => {
      if (!comments) return '';
      // 使用正则表达式将连续的波浪线替换为单个句号
      return comments.replace(/~+/g, '。');
    };

    const lastReviewer = computed(() => {
      if (!currentProject.value?.projectApprovalParts?.length) return '';
      const validParts = currentProject.value.projectApprovalParts.filter(part => part.departmentName);
      return validParts.length ? validParts[validParts.length - 1].reviewer || '' : '';
    });

    const returnForReassessment = async () => {
      try {
        const totalScore = Object.values(adjustedScores).reduce((sum, score) => sum + score, 0);
        const combinedComments = [
          reviewComments.basicInfo,
          reviewComments.constructionTechnique,
          reviewComments.management,
          reviewComments.subcontract
        ].join('~');

        const response = await axios.post('/projectApprovals/reject', {
          projectId: currentProject.value.id,
          reviewComments: combinedComments,
          partialScore: Object.values(adjustedScores).join('，'),
          totalScore: totalScore,
          version: currentProject.value.version || 1,
          revertToUser: '普通用户' // 根据需要设置此值
        });

        if (response.data.code === 1) {
          ElMessage.success('项目已退回重审');
          reviewDialogVisible.value = false;
          fetchProjects(); // 刷新项目列表
        } else {
          ElMessage.error(response.data.msg);
        }
      } catch (error) {
        ElMessage.error('退回重审失败');
      }
    };

    return {
      projects,
      reviewDialogVisible,
      currentProject,
      reviewScores,
      reviewProject,
      submitReview,
      returnProject,
      formattedConstructionProcess,
      adjustedScores,
      partialScores,
      reviewComments,
      calculatePartTotal,
      finalScore,
      finalRiskLevel,
      formatReviewComments,
      lastReviewer,
      returnForReassessment,
    };
  }
};
</script>

<style scoped>
.review-projects {
  padding: 20px;
}

.dialog-content {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 将内容分为两列 */
  gap: 20px;
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.right-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

section {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
}

h3 {
  margin-bottom: 10px;
  color: #333;
}

p, li {
  margin: 5px 0;
  color: #555;
}

ul {
  list-style-type: none;
  padding: 0;
}

/* 响应式布局 */
@media screen and (max-width: 1200px) {
  .dialog-content {
    grid-template-columns: 1fr; /* 在小屏幕上变为单列 */
  }
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

.approval-section {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
}

.approval-part {
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
  background-color: #fff;
}

.approval-part h4 {
  margin: 0 0 10px 0;
  color: #409EFF;
}

.total-score {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}
</style>
