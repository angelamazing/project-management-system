/*
 * @Author: Jerry Han angelamazing@163.com
 * @Date: 2024-10-27 17:29:30
 * @LastEditors: Jerry Han angelamazing@163.com
 * @LastEditTime: 2024-10-29 10:16:12
 * @FilePath: \project-management-system\src\composables\useUnsubmittedProjects.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ref } from 'vue';

export function useUnsubmittedProjects() {
  const unsubmittedProjects = ref([
    {
      id: 1,
      project_name: "山区滑坡治理项目",
      project_type: "地灾治理和矿山生态修复类",
      repair_scale: "治理项目规模 100~300 万 (7分)",
      surrounding_risks: "存在三项风险 (8分)",
      internal_conditions: ["场地平整", "消防设施齐全", "临时防护安全有效"],
      management_experience: "从事过类似项目管理 1 个 (5分)",
      professional_structure: "工程类对口专业 (0分)",
      education_level: "本科及以上学历 (地质院校) (0分)",
      subcontract_avg_age: "30 岁~40 岁 (6分)",
      subcontract_experience: "从事过类似业绩 2 个 (6分)",
      subcontract_education: "初中及以下低于 20% (6 分)",
      start_date: "2023-06-01",
      end_date: "2023-12-31",
      status: "未提交",
      creatorId: 1
    },
    {
      id: 2,
      project_name: "城市地质勘探项目",
      project_type: "地质勘查钻探类",
      drill_machine_count: "钻机数量 6~9 台 (7分)",
      surrounding_risks: "存在两项风险 (7分)",
      internal_conditions: ["空间宽阔", "机械设备性能良好", "办公环境安全良好"],
      management_experience: "从事过类似项目管理 2 个 (3分)",
      professional_structure: "工程类对口专业 (0分)",
      education_level: "本科及以上学历 (非地质院校) (1分)",
      subcontract_avg_age: "40 岁~50 岁 (8分)",
      subcontract_experience: "从事过类似业绩 1 个 (8分)",
      subcontract_education: "全部为初中以上 (0 分)",
      start_date: "2023-07-15",
      end_date: "2024-03-31",
      status: "未提交",
      creatorId: 1
    },
    {
      id: 3,
      project_name: "矿区地质调查项目",
      project_type: "地质调查、测量测绘类",
      field_investigator_count: "同时野外调查人员 6 人 (6分)",
      surrounding_risks: "存在四项风险 (9分)",
      internal_conditions: ["消防通道畅通", "临时水电设施安全规范", "材料堆放区规划合理"],
      management_experience: "未从事过类似项目管理 (8分)",
      professional_structure: "工程类非对口专业 (1分)",
      education_level: "本科以下学历 (2分)",
      subcontract_avg_age: "超过 50 岁 (10分)",
      subcontract_experience: "未从事过类似项目 (10分)",
      subcontract_education: "初中及以下超过 20% (10 分)",
      start_date: "2023-08-01",
      end_date: "2024-02-29",
      status: "未提交",
      creatorId: 1
    }
  ]);

  const addProject = (project) => {
    const newProjectId = unsubmittedProjects.value.length + 1;
    unsubmittedProjects.value.push({ ...project, id: newProjectId });
    console.log(JSON.stringify(project, null, 2));
  };

  const updateProject = (updatedProject) => {
    const index = unsubmittedProjects.value.findIndex(p => p.id === updatedProject.id);
    console.log(JSON.stringify(updatedProject, null, 2));

    if (index !== -1) {
      unsubmittedProjects.value[index] = { ...updatedProject };
    }
  };

  const deleteProject = (projectToDelete) => {
    unsubmittedProjects.value = unsubmittedProjects.value.filter(p => p.id !== projectToDelete.id);
  };

  return {
    unsubmittedProjects,
    addProject,
    updateProject,
    deleteProject,
  };
}
