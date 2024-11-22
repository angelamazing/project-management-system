<template>
  <el-dialog
    title="项目详情"
    v-model="visible"
    @close="closeDialog"
    width="60%"
  >
    <div class="project-details">
      <!-- 基本信息 -->
      <section>
        <h3>基本信息</h3>
        <p><strong>项目名称:</strong> {{ project.projectName }}</p>
        <p><strong>创建人:</strong> {{ project.creator }}</p>
        <p><strong>状态:</strong> {{ project.status }}</p>
        <p><strong>项目类型:</strong> {{ project.projectType }}</p>
        <p><strong>项目规模:</strong> {{ project.projectScale }}</p>
      </section>

      <!-- 环境信息 -->
      <section>
        <h3>环境信息</h3>
        <p><strong>周边环境:</strong> {{ project.surroundingRisks }}</p>
        <p><strong>内部环境:</strong> {{ project.internalConditions }}</p>
        <p><strong>其他说明:</strong> {{ project.customSurroundingRisks }}</p>
      </section>

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

      <!-- 审批信息 -->
      <section>
        <h3>审批信息</h3>
        <p><strong>安全员:</strong> {{ project.safetyOfficer }}</p>
        <p><strong>评审意见:</strong> {{ project.reviewComments }}</p>
        <p><strong>各部分得分:</strong> {{ project.partialScore }}</p>
        <p><strong>总分:</strong> {{ project.totalScore }}</p>
        <p><strong>风险等级:</strong> {{ project.riskLevel }}</p>
      </section>
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
</script>

<style scoped>
.project-details {
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
</style>