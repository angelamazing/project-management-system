/*
 * @Author: Jerry Han angelamazing@163.com
 * @Date: 2024-10-27 17:29:25
 * @LastEditors: Jerry Han angelamazing@163.com
 * @LastEditTime: 2024-11-18 19:29:31
 * @FilePath: \project-management-system\src\composables\useProjectForm.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
 
import { computed,ref} from 'vue';
import { projectTypes } from '@/constants/projectFormOptions';

export function useProjectForm() {
  const projectForm = ref({
    projectName: '',
    projectType: '',
    projectScale: '',
    surroundingRisks: '',
    customSurroundingRisks: '',
    internalConditions: [],
    managementExperience: '',
    professionalStructure: '',
    educationLevel: '',
    subcontractAvgAge: '',
    subcontractExperience: '',
    subcontractEducation: '',
    status: '未提交',
    constructionProcess: {},
  });

  const resetForm = () => {
    Object.assign(projectForm.value, {
      projectName: '',
      projectType: '',
      projectScale: '',
      surroundingRisks: '',
      customSurroundingRisks: '',
      internalConditions: [],
      managementExperience: '',
      professionalStructure: '',
      educationLevel: '',
      subcontractAvgAge: '',
      subcontractExperience: '',
      subcontractEducation: '',
      status: '未提交',
      constructionProcess: {},
    });
    
  };

  const isProjectComplete = () => {
    const requiredFields = [
      'projectName', 'projectType', 'surroundingRisks', 'internalConditions',
      'managementExperience', 'professionalStructure', 'educationLevel',
      'subcontractAvgAge', 'subcontractExperience', 'subcontractEducation',
    ];

    const basicFieldsComplete = requiredFields.every(field => {
      const value = projectForm.value[field];
      return Array.isArray(value) ? value.length > 0 : Boolean(value);
    });

    const specificFieldComplete = 
      (isRepairProject.value && projectForm.value.projectScale) ||
      (isDrillingProject.value && projectForm.value.projectScale) ||
      (isSurveyProject.value && projectForm.value.projectScale);

    const constructionComplete = Object.keys(projectForm.value.constructionProcess).length > 0;

    return basicFieldsComplete && specificFieldComplete && constructionComplete &&
      !(projectForm.value.surroundingRisks === 'custom' && !projectForm.value.customSurroundingRisks);
  };

  const updateConstructionData = (newData) => {
    projectForm.value.constructionProcess = { ...newData };
  };

  const onProjectTypeChange = (newType) => {
    projectForm.value.projectScale = '';
    projectForm.value.projectType = newType; // 更新 projectType
    console.log('newType', newType);
    // projectForm.value.drill_machine_count = '';
    // projectForm.value.field_investigator_count = '';
  };

  const isRepairProject = computed(() => projectForm.value.projectType === projectTypes[0]);
  const isDrillingProject = computed(() => projectForm.value.projectType === projectTypes[1]);
  const isSurveyProject = computed(() => projectForm.value.projectType === projectTypes[2]);

  return {
    projectForm,
    resetForm,
    isProjectComplete,
    updateConstructionData,
    onProjectTypeChange,
    isRepairProject,
    isDrillingProject,
    isSurveyProject,
  };
}
