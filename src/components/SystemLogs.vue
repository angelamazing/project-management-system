<template>
  <div class="logs">
    <el-card>
      <div class="header">
        <h2>系统日志</h2>
        <el-form :inline="true" :model="queryParams" class="filter-form">
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              @change="handleDateChange">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="fetchLogs">查询</el-button>
            <el-button @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="logsList" style="width: 100%" v-loading="loading">
        <el-table-column prop="operateTime" label="操作时间" min-width="30%">
          <template #default="{ row }">
            {{ formatDateTime(row.operateTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="operateUsername" label="操作人" min-width="30%"></el-table-column>
        <el-table-column prop="operateType" label="操作类型" min-width="30%"></el-table-column>

      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import axios from '@/axios';

export default {
  name: 'SystemLogs',
  setup() {
    const loading = ref(false);
    const logsList = ref([]);
    const total = ref(0);
    const dateRange = ref(null);

    const queryParams = reactive({
      begin: '',
      end: '',
      page: 1,
      pageSize: 10
    });

    const fetchLogs = async () => {
      loading.value = true;
      try {
        const response = await axios.get('/operateLogs/finds', {
          params: queryParams
        });
        
        if (response.data.code === 1) {
          logsList.value = response.data.data.rows;
          logsList.value.sort((a, b) => new Date(b.operateTime) - new Date(a.operateTime));
          total.value = response.data.data.total;
        } else {
          ElMessage.error(response.data.msg || '获取日志列表失败');
        }
      } catch (error) {
        console.error('获取日志列表出错:', error);
        ElMessage.error('获取日志列表失败');
      } finally {
        loading.value = false;
      }
    };

    const handleDateChange = (val) => {
      if (val) {
        queryParams.begin = val[0];
        queryParams.end = val[1];
      } else {
        queryParams.begin = '';
        queryParams.end = '';
      }
    };

    const resetQuery = () => {
      dateRange.value = null;
      queryParams.begin = '';
      queryParams.end = '';
      queryParams.page = 1;
      fetchLogs();
    };

    const handleSizeChange = (val) => {
      queryParams.pageSize = val;
      fetchLogs();
    };

    const handleCurrentChange = (val) => {
      queryParams.page = val;
      fetchLogs();
    };

    const formatDateTime = (dateTimeStr) => {
      if (!dateTimeStr) return '';
      return new Date(dateTimeStr).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    };

    // 初始加载
    fetchLogs();

    return {
      loading,
      logsList,
      total,
      dateRange,
      queryParams,
      fetchLogs,
      handleDateChange,
      resetQuery,
      handleSizeChange,
      handleCurrentChange,
      formatDateTime
    };
  }
};
</script>

<style scoped>
.logs {
  padding: 20px;
}

.header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-form {
  display: flex;
  align-items: center;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
