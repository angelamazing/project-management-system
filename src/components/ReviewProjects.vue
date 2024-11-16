<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-10-04 16:06:48
 * @LastEditors: Jerry Han angelamazing@163.com
 * @LastEditTime: 2024-11-16 15:44:55
 * @FilePath: \project-management-system\src\components\ReviewProjects.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE%E8%AE%BE%E8%AE%BE
-->
<template>
  <div class="review-projects">
    <el-table :data="projects" style="width: 100%">
      <el-table-column prop="name" label="项目名称"></el-table-column>
      <el-table-column prop="type" label="项目类型"></el-table-column>
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
      <el-form :model="currentProject" label-width="120px">
        <el-form-item label="项目名称">
          <el-input v-model="currentProject.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="项目类型">
          <el-input v-model="currentProject.type" disabled></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-input v-model="currentProject.status" disabled></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="currentProject.description" disabled></el-input>
        </el-form-item>
        
        <!-- 添加更多项目详情字段 -->

        <el-divider>审核评分</el-divider>

        <el-form-item label="施工工艺评分">
          <el-input-number v-model="reviewScores.constructionTechnique" :min="0" :max="100"></el-input-number>
        </el-form-item>
        <el-form-item label="项目管理评分">
          <el-input-number v-model="reviewScores.projectManagement" :min="0" :max="100"></el-input-number>
        </el-form-item>
        <el-form-item label="安全措施评分">
          <el-input-number v-model="reviewScores.safetyMeasures" :min="0" :max="100"></el-input-number>
        </el-form-item>

        <el-form-item label="审核意见">
          <el-input type="textarea" v-model="reviewComment" :rows="4"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="reviewDialogVisible = false">取消</el-button>
          <el-button type="warning" @click="returnProject">退回修改</el-button>
          <el-button type="primary" @click="submitReview">通过审核</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
  name: 'ReviewProjects',
  setup() {
    const projects = ref([
      { id: 1, name: '项目A', type: '地灾治理和矿山生态修复类', status: '待审核', description: '这是项目A的描述' },
      { id: 2, name: '项目B', type: '地质勘察钻探类', status: '待审核', description: '这是项目B的描述' },
      { id: 3, name: '项目C', type: '地灾治理和矿山生态修复类', status: '待审核', description: '这是项目C的描述' },
    ]);

    const reviewDialogVisible = ref(false);
    const currentProject = ref({});
    const reviewScores = reactive({
      constructionTechnique: 0,
      projectManagement: 0,
      safetyMeasures: 0,
    });
    const reviewComment = ref('');

    const reviewProject = (project) => {
      currentProject.value = { ...project };
      reviewDialogVisible.value = true;
      // 重置评分和评论
      Object.keys(reviewScores).forEach(key => reviewScores[key] = 0);
      reviewComment.value = '';
    };

    const submitReview = () => {
      // 计算总分
      const totalScore = Object.values(reviewScores).reduce((sum, score) => sum + score, 0) / 3;
      
      // 更新项目状态
      const index = projects.value.findIndex(p => p.id === currentProject.value.id);
      if (index !== -1) {
        projects.value[index].status = totalScore >= 60 ? '审核通过' : '审核未通过';
        projects.value[index].reviewScore = totalScore;
        projects.value[index].reviewComment = reviewComment.value;
        
        ElMessage.success(`项目审核完成，总分：${totalScore.toFixed(2)}`);
        reviewDialogVisible.value = false;
      } else {
        ElMessage.error('项目未找到，无法更新状态');
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
    };
  }
};
</script>

<style scoped>
.review-projects {
  padding: 20px;
}

.dialog-footer {
  text-align: right;
}
</style>
