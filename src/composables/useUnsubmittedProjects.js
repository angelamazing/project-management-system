/*
 * @Author: Jerry Han angelamazing@163.com
 * @Date: 2024-10-27 17:29:30
 * @LastEditors: Jerry Han angelamazing@163.com
 * @LastEditTime: 2024-11-19 15:58:04
 * @FilePath: \project-management-system\src\composables\useUnsubmittedProjects.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ref, onMounted } from 'vue';
import axios from '@/axios';
import { useStore } from 'vuex';
import { computed } from 'vue';


export function useUnsubmittedProjects() {
  const unsubmittedProjects = ref([]);

  // 状态管理
  const store = useStore();
  // 设置查询状态creator,status
  const username = computed(() => store.getters.username);
  const status = "未提交" 

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`/projectMessages/finds?creator=${encodeURIComponent(username.value)}&status=${encodeURIComponent(status)} `
        );
      const result = response.data; // 直接获取响应数据      
      const rows = result.data.rows;
      const updatedRows = rows.map(row => {
        // 确保 internalConditions 存在并且是字符串
        if (typeof row.internalConditions === 'string') {
          row.internalConditions = row.internalConditions.split('，'); // 使用中文逗号分隔
        }
        return row;
      });
      unsubmittedProjects.value = updatedRows; // Assuming the data is in response.data.rows
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const addProject = async (project) => {
    try {
      // Ensure internalConditions is a string before sending
      console.log(JSON.stringify(project.internalConditions, null, 2));
      if (Array.isArray(project.internalConditions)) {
        project.internalConditions = project.internalConditions.join(',');
      } 
      
      const response = await axios.post('/projectMessages/add', project);

      // Split back to array after adding
      project.internalConditions = project.internalConditions.split(',');
      project.id = response.data.data;
      
      // Push the project to unsubmittedProjects
      if(project.status === '未提交'){
        unsubmittedProjects.value.push(project);
      }
      console.log('response.data', response.data);
      console.log('Current unsubmittedProjects:', unsubmittedProjects.value);

    } catch (error) {
      console.error('Failed to add project:', error);
    }
  };

  const updateProject = async (updatedProject) => {
    const id = updatedProject.id;

    if (Array.isArray(updatedProject.internalConditions)) {
      updatedProject.internalConditions = updatedProject.internalConditions.join(',');
    }

    if (id !== -1) {
      try {
        const response = await axios.put(`/projectMessages/update`, updatedProject, {
          headers: {
            'Content-Type': 'application/json' // 确保请求头为 JSON 格式
          }
        });

        // 验证响应的 code 是否为 1
        if (response.data.code === 1) {
          const updatedData = response.data.data; // 假设响应包含更新后的项目数据
          
          console.log('updatedData', updatedData);
          // Check if updatedData.internalConditions is a string before splitting
        if (typeof updatedData.internalConditions === 'string') {
          updatedData.internalConditions = updatedData.internalConditions.split(',');
          }
          console.log('updatedData.internalConditions', updatedData.internalConditions);

          // 更新本地的 unsubmittedProjects
          const index = unsubmittedProjects.value.findIndex(p => p.id === id);
          console.log(unsubmittedProjects.value);
          if (index !== -1 && updatedData.status === '未提交') {
            unsubmittedProjects.value[index] = updatedData; // 更新对应的项目
          }
          else{
            // 从 unsubmittedProjects 中删除该项目
            unsubmittedProjects.value = unsubmittedProjects.value.filter(p => p.id !== id);
          }

          console.log('Project updated successfully:', JSON.stringify(updatedData, null, 2));
        } else {
          console.error('Update failed, response code:', response.data.code);
        }
      } catch (error) {
        console.error('Failed to update project:', error);
      }
    }
  };

  const deleteProject = async (projectToDelete) => {
    try {
      await axios.delete(`/projectMessages/delete/${projectToDelete.id}`);
      console.log('删除成功');
      unsubmittedProjects.value = unsubmittedProjects.value.filter(p => p.id !== projectToDelete.id);
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  onMounted(() => {
    fetchProjects();
  });

  return {
    unsubmittedProjects,
    addProject,
    updateProject,
    deleteProject,
  };
}
