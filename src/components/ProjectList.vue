<template>
  <div class="project-list-container">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input
        v-model="searchQuery.name"
        placeholder="搜索项目名称"
        prefix-icon="el-icon-search"
        clearable
        @input="handleSearchChange"
      />
      <el-select v-model="searchQuery.type" placeholder="选择项目类型" clearable @change="handleSearchChange">
        <el-option label="所有" value="" />
        <el-option label="地灾治理和矿山生态修复类" value="地灾治理和矿山生态修复类" />
        <el-option label="地质勘察钻探类" value="地质勘察钻探类" />
        <el-option label="地质调查、测量测绘类" value="地质调查、测量测绘类" />
      </el-select>
      <el-select v-model="searchQuery.status" placeholder="选择审核状态" clearable @change="handleSearchChange">
        <el-option label="所有" value="" />
        <el-option label="未提交" value="未提交" />
        <el-option label="待审核" value="待审核" />
        <el-option label="部门安全员已审核" value="部门安全员已审核" />
        <el-option label="部门安全主管已审核" value="部门安全主管已审核" />
        <el-option label="安全主管已审核" value="安全管已审核" />
      </el-select>
      <el-select v-model="searchQuery.departmentName" placeholder="选择部门" clearable @change="handleSearchChange">
        <el-option label="所有" value="" />
        <el-option
          v-for="dept in departments"
          :key="dept"
          :label="dept"
          :value="dept"
        />
      </el-select>
    </div>

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
      <el-table-column prop="departmentName" label="部门名称" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            class="custom-button"
            @click="fetchProjectDetails(row.id)"
            type="primary"
            size="small"
          >查看详情</el-button>
          <el-button
            v-if="isAdmin"
            class="delete-button"
            @click="handleDelete(row)"
            type="danger"
            size="small"
          >删除</el-button>
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
import { ref, onMounted, computed } from 'vue';
import axios from '@/axios';
import ProjectDetailsTemplate from './Form/ProjectDetailsTemplate.vue';
import { nextTick } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useStore } from 'vuex';

const store = useStore();

const paginatedProjects = ref([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const sortProp = ref('name');
const sortOrder = ref('ascending');
const searchQuery = ref({ 
  name: '', 
  type: '', 
  status: '', 
  completion: '',
  departmentName: ''
});

const projectDetails = ref({});
const isDialogVisible = ref(false);

// 添加部门列表和搜索查询参数
const departments = ref([]);

// 使用 computed 属性判断是否为管理员
const isAdmin = computed(() => {
  const userRole = store.getters.userRole;
  return userRole === '管理员'; // 根据实际的管理员角色值进行判断
});

// 处理页码变更
const handlePageChange = (page) => {
  currentPage.value = page;
  fetchProjects();
};

// 处理排序变更
const handleSortChange = ({ prop, order }) => {
  sortProp.value = prop;
  sortOrder.value = (order === 'ascending') ? 'ascending' : 'descending';
  fetchProjects();
};

// 获取项目详情
const fetchProjectDetails = async (projectId) => {
  try {
    const response = await axios.get(`/projectApprovals/find/${projectId}`);
    const data = response.data;
    // console.log(data) 

    if (data.code !== 1) {
      throw new Error(data.msg || '获取项目详情失败');
    }

    projectDetails.value = data.data;
    nextTick(() => {
      isDialogVisible.value = true;
    });
  } catch (error) {
    console.error('获取项目详情错误:', error);
  }
};

// 获取部门列表
const fetchDepartments = async () => {
  try {
    const response = await axios.get('/departments/finds');
    if (response.data.code === 1) {
      // 过滤掉特定部门
      const excludeDepartments = ['安全科', '队领导', '管理员'];
      departments.value = response.data.data
        .map(dept => dept.name)
        .filter(deptName => !excludeDepartments.includes(deptName));
    }
  } catch (error) {
    console.error('获取部门列表失败:', error);
  }
};

// 修改 fetchProjects 函数
async function fetchProjects() {
  try {
    const params = {
      creator: '',
      projectName: searchQuery.value.name,
      projectType: searchQuery.value.type,
      status: searchQuery.value.status,
      departmentName: searchQuery.value.departmentName,
      begin: '',
      end: '',
      page: currentPage.value,
      pageSize: pageSize.value,
    };

    const response = await axios.get('/projectMessages/views', { params });

    const data = response.data;
    // console.log(data)
    if (data.code !== 1) {
      throw new Error(data.msg || '获取项目数据失败');
    }

    paginatedProjects.value = data.data.rows;
    total.value = data.data.total;
  } catch (error) {
    console.error('获取项目数据错误:', error);
  }
}

// 添加新的处理函数
const handleSearchChange = () => {
  currentPage.value = 1;
  fetchProjects();
};

// 修改删除处理函数
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除该项目吗？此操作不可恢复！',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );

    const response = await axios.post(`/projectMessages/delete/${row.id}`);

    if (response.data.code === 1) {
      ElMessage.success('删除成功');
      fetchProjects(); // 重新加载项目列表
    } else {
      throw new Error(response.data.msg || '删除失败');
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败');
    }
  }
};

// 初始化
onMounted(() => {
  fetchDepartments(); // 获取部门列表
  fetchProjects();    // 获取项目列表
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
  margin-right: 8px;
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

.delete-button {
  margin-right: 8px;
  background-color: #f56c6c;
  border-color: #f56c6c;
  color: white;
}

.delete-button:hover {
  background-color: #f78989;
  border-color: #f78989;
}
</style>