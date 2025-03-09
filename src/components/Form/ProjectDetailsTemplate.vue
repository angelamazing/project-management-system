<template>
  <el-dialog
    title="项目详情"
    v-model="visible"
    @close="closeDialog"
    width="80%"
  >
    <div class="project-details">
      <div class="left-column">
        <!-- 基本信息 -->
        <section>
          <h3>基本信息</h3>
          <p><strong>项目名称:</strong> {{ project.projectName }}</p>
          <p><strong>创建人:</strong> {{ project.creator }}</p>
          <p><strong>状态:</strong> {{ project.status }}</p>
          <p><strong>项目类型:</strong> {{ project.projectType }}</p>
          <p><strong>项目规模:</strong> {{ project.projectScale }}</p>
          <p><strong>周边环境:</strong> {{ project.surroundingRisks }}</p>
          <p><strong>内部环境:</strong> {{ project.internalConditions }}</p>
          <p><strong>其他说明:</strong> {{ project.customSurroundingRisks }}</p>
        </section>

        <!-- 环境信息
        <section>
          <h3>环境信息</h3>

        </section> -->

        <!-- 施工信息 -->
        <section>
          <h3>施工信息</h3>
          <ul>
            <li v-for="item in formattedConstructionProcess" :key="item.label">
              <strong>{{ item.label }}:</strong> {{ item.selectedLabel }}
            </li>
          </ul>
        </section>

        <!-- 管理信息 -->
        <section>
          <h3>管理信息</h3>
          <p><strong>管理经验:</strong> {{ project.managementExperience }}</p>
          <p><strong>专业结构:</strong> {{ project.professionalStructure }}</p>
          <p><strong>学历层次:</strong> {{ project.educationLevel }}</p>
        </section>

        <!-- 队伍信息 -->
        <section>
          <h3>队伍信息</h3>
          <p><strong>队伍平均年龄:</strong> {{ project.subcontractAvgAge }}</p>
          <p><strong>队伍经验:</strong> {{ project.subcontractExperience }}</p>
          <p><strong>队伍学历:</strong> {{ project.subcontractEducation }}</p>
        </section>
      </div>

      <div class="right-column">
        <!-- 审批信息 -->
        <section class="approval-section">
          <h3>审批信息</h3>
          <div v-for="(part, index) in project.projectApprovalParts" :key="index" class="approval-part">
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
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { ElDialog } from 'element-plus';
import 'element-plus/dist/index.css';

const props = defineProps({
  project: Object,
  modelValue: Boolean
});

const emit = defineEmits(['update:modelValue']);

const visible = ref(props.modelValue);

const closeDialog = () => {
  emit('update:modelValue', false);
};

watch(() => props.modelValue, (newValue) => {
  visible.value = newValue;
});

// 格式化施工工艺数据
const formattedConstructionProcess = computed(() => {
  if (!props.project.constructionProcess) {
    return [];
  }

  const result = [];
  
  // 处理地灾治理和矿山生态修复类
  if (props.project.constructionProcess.disasterItems) {
    const disasterItems = props.project.constructionProcess.disasterItems
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

  // 处理地质勘查钻探类
  if (props.project.constructionProcess.constructionType === '地质勘察钻探类') {
    const equipmentValue = props.project.constructionProcess.largeDrillingEquipment;
    const equipmentLabel = equipmentValue === '16' 
      ? '大型钻探设备或中深孔钻探超过20% (16分)'
      : '无大型钻探设备 (0分)';
    
    result.push({
      label: '钻探设备',
      selectedLabel: equipmentLabel
    });

    if (props.project.constructionProcess.safetyThreats?.length > 0) {
      result.push({
        label: '安全威胁',
        selectedLabel: props.project.constructionProcess.safetyThreats.join('、')
      });
    }
  }

  return result;
});

// 计算每个部分的总分
const calculatePartTotal = (scoreString) => {
  if (!scoreString) return 0;
  return scoreString.split('，')
    .reduce((sum, score) => sum + (Number(score) || 0), 0);
};

// 获取最后一个有效的审核信息中的总分和风险等级
const finalScore = computed(() => {
  if (!props.project?.projectApprovalParts?.length) return '未评分';
  const validParts = props.project.projectApprovalParts.filter(part => part.departmentName);
  return validParts.length ? validParts[validParts.length - 1].totalScore || '未评分' : '未评分';
});
  
const finalRiskLevel = computed(() => {
  if (!props.project?.projectApprovalParts?.length) return '未评定';
  const validParts = props.project.projectApprovalParts.filter(part => part.departmentName);
  return validParts.length ? validParts[validParts.length - 1].riskLevel || '未评定' : '未评定';
});

// 添加格式化评审意见的函数
const formatReviewComments = (comments) => {
  if (!comments) return '';
  // 使用正则表达式将连续的波浪线替换为单个句号
  return comments.replace(/~+/g, '。');
};

const lastReviewer = computed(() => {
  if (!props.project?.projectApprovalParts?.length) return '';
  const validParts = props.project.projectApprovalParts.filter(part => part.departmentName);
  return validParts.length ? validParts[validParts.length - 1].reviewer || '' : '';
});
</script>

<style scoped>
.project-details {
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

.approval-section {
  position: sticky;
  top: 20px; /* 设置吸顶距离 */
  height: fit-content;
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
  .project-details {
    grid-template-columns: 1fr; /* 在小屏幕上变为单列 */
  }
}
</style>