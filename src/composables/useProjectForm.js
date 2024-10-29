/*
 * @Author: Jerry Han angelamazing@163.com
 * @Date: 2024-10-27 17:29:25
 * @LastEditors: Jerry Han angelamazing@163.com
 * @LastEditTime: 2024-10-29 09:30:45
 * @FilePath: \project-management-system\src\composables\useProjectForm.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
 
import { ref, computed } from 'vue';
import { projectTypes } from '@/constants/projectFormOptions';

export function useProjectForm() {
  const projectForm = ref({
    project_name: '',
    project_type: '',
    repair_scale: '',
    drill_machine_count: '',
    field_investigator_count: '',
    surrounding_risks: '',
    custom_surrounding_risks: '',
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
    construction: {},
  });

  const resetForm = () => {
    Object.assign(projectForm.value, {
      project_name: '',
      project_type: '',
      repair_scale: '',
      drill_machine_count: '',
      field_investigator_count: '',
      surrounding_risks: '',
      custom_surrounding_risks: '',
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
      construction: {},
    });
  };

  const isProjectComplete = () => {
    const requiredFields = [
      'project_name', 'project_type', 'surrounding_risks', 'internal_conditions',
      'management_experience', 'professional_structure', 'education_level',
      'subcontract_avg_age', 'subcontract_experience', 'subcontract_education',
      'start_date', 'end_date'
    ];

    const basicFieldsComplete = requiredFields.every(field => {
      const value = projectForm.value[field];
      return Array.isArray(value) ? value.length > 0 : Boolean(value);
    });

    const specificFieldComplete = 
      (isRepairProject.value && projectForm.value.repair_scale) ||
      (isDrillingProject.value && projectForm.value.drill_machine_count) ||
      (isSurveyProject.value && projectForm.value.field_investigator_count);

    const constructionComplete = Object.keys(projectForm.value.construction).length > 0;

    return basicFieldsComplete && specificFieldComplete && constructionComplete &&
      !(projectForm.value.surrounding_risks === 'custom' && !projectForm.value.custom_surrounding_risks);
  };

  const updateConstructionData = (newData) => {
    projectForm.value.construction = { ...newData };
  };

  const onProjectTypeChange = () => {
    projectForm.value.repair_scale = '';
    projectForm.value.drill_machine_count = '';
    projectForm.value.field_investigator_count = '';
  };

  const isRepairProject = computed(() => projectForm.value.project_type === projectTypes[0]);
  const isDrillingProject = computed(() => projectForm.value.project_type === projectTypes[1]);
  const isSurveyProject = computed(() => projectForm.value.project_type === projectTypes[2]);

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
