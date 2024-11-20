<template>
  <div class="project-list-container">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input
        v-model="searchQuery.name"
        placeholder="搜索项目名称"
        prefix-icon="el-icon-search"
        clearable
        @input="updatePaginatedProjects"
      />
      <el-select v-model="searchQuery.type" placeholder="选择项目类型" clearable @change="updatePaginatedProjects">
        <el-option label="所有" value="" />
        <el-option label="地灾治理和矿山生态修复类" value="地灾治理和矿山生态修复类" />
        <el-option label="地质勘察钻探类" value="地质勘察钻探类" />
        <el-option label="地质调查、测量测绘类" value="地质调查、测量测绘类" />
      </el-select>
      <el-select v-model="searchQuery.status" placeholder="选择审核状态" clearable @change="updatePaginatedProjects">
        <el-option label="所有" value="" />
        <el-option label="待审核" value="待审核" />
        <el-option label="已审核" value="已审核" />
      </el-select>
    </div>

    <!-- 手动获取项目数据按钮 -->
    <el-button type="success" @click="fetchProjects">获取项目数据</el-button>

    <!-- 表格 -->
    <el-table
      class="custom-table"
      :data="paginatedProjects"
      :default-sort="{ prop: sortProp, order: sortOrder }"
      @sort-change="handleSortChange"
      highlight-current-row
    >
      <el-table-column prop="projectName" label="项目名称" sortable />
      <el-table-column prop="projectType" label="项目类型" sortable />
      <el-table-column prop="status" label="状态" sortable />

      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            class="custom-button"
            @click="viewProjectDetails(row)"
            type="primary"
            size="small"
          >查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 项目详情对话框 -->
    <ProjectDetailsTemplate v-if="isDialogVisible" :project="projectDetails" v-model="isDialogVisible" />

    <!-- 分页器 -->
    <el-pagination
      class="custom-pagination"
      @current-change="handlePageChange"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      layout="prev, pager, next"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/axios';
import ProjectDetailsTemplate from './Form/ProjectDetailsTemplate.vue';
import { nextTick } from 'vue';

const paginatedProjects = ref([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const sortProp = ref('name');
const sortOrder = ref('ascending');
const searchQuery = ref({ name: '', type: '', status: '', completion: '' });

const projectDetails = ref({});
const isDialogVisible = ref(false);

// 计算分页数据
const updatePaginatedProjects = () => {
  try {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = currentPage.value * pageSize.value;

    // 根据搜索条件过滤项目
    const filteredProjects = paginatedProjects.value.filter(project => {
      return (
        (!searchQuery.value.name || project.projectName.includes(searchQuery.value.name)) &&
        (!searchQuery.value.type || project.projectType === searchQuery.value.type) &&
        (!searchQuery.value.status || project.status === searchQuery.value.status)
      );
    });

    // 排序
    filteredProjects.sort((a, b) => {
      return (a[sortProp.value] < b[sortProp.value] ? -1 : 1) * (sortOrder.value === 'ascending' ? 1 : -1);
    });

    // 更新分页数据
    paginatedProjects.value = filteredProjects.slice(start, end);
    total.value = filteredProjects.length;
  } catch (error) {
    console.error("更新分页项目时出错:", error);
  }
};

// 处理页码变更
const handlePageChange = (page) => {
  currentPage.value = page;
  updatePaginatedProjects();
};

// 处理排序变更
const handleSortChange = ({ prop, order }) => {
  sortProp.value = prop;
  sortOrder.value = (order === 'ascending') ? 'ascending' : 'descending';
  updatePaginatedProjects();
};

// 查看项目详情
const viewProjectDetails = (project) => {
  projectDetails.value = { ...project };
  nextTick(() => {
    isDialogVisible.value = true;
  });
};

async function fetchProjects() {
  try {
    // Construct query parameters
    const params = {
      creator: '', // Set this if needed
      projectName: searchQuery.value.name,
      projectType: searchQuery.value.type,
      status: searchQuery.value.status,
      begin: '', // Set this if needed
      end: '', // Set this if needed
      page: 1, // Start from the first page
      pageSize: 1000, // Set a large number to attempt fetching all data
    };

    // Fetch data using axios
    const response = await axios.get('/projectMessages/finds', { params });
    const data = response.data;
    console.log('data', data);
    if (data.code !== 1) {
      throw new Error(data.msg || 'Failed to fetch project data');
    }

    // Update project list and pagination
    paginatedProjects.value = data.data.rows;
    total.value = data.data.total;
    currentPage.value = 1; // Reset to first page if needed

    // Recalculate paginated projects
    updatePaginatedProjects();
  } catch (error) {
    console.error('Error fetching project data:', error);
  }
}

// 初始化
onMounted(() => {
  fetchProjects(); // Fetch projects when the component is mounted
});
</script>

<style scoped>
.project-list-container {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.custom-table {
  margin-bottom: 20px;
  background-color: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.custom-button {
  background-color: #409eff;
  color: white;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.custom-button:hover {
  background-color: #66b1ff;
}

.custom-pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.el-table th {
  background-color: #f2f6fc;
  font-weight: bold;
  color: #333;
}

.el-table-column--sortable .caret-wrapper {
  color: #409eff;
}
</style>
