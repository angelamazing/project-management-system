<template>
  <div class="logs">
    <el-card>
      <div class="header">
        <h2>系统日志</h2>
        <el-form :inline="true" :model="filters" class="filter-form">
          <el-form-item label="用户">
            <el-input v-model="filters.user" placeholder="输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="操作类型">
            <el-select v-model="filters.action" placeholder="选择操作类型">
              <el-option label="登录" value="登录"></el-option>
              <el-option label="登出" value="登出"></el-option>
              <el-option label="添加用户" value="添加用户"></el-option>
              <el-option label="删除用户" value="删除用户"></el-option>
              <el-option label="修改项目" value="修改项目"></el-option>
              <!-- 其他操作类型 -->
            </el-select>
          </el-form-item>
          <el-form-item label="时间">
            <el-date-picker
              v-model="filters.date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="filterLogs">筛选</el-button>
            <el-button @click="resetFilters">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="filteredLogs" style="width: 100%">
        <el-table-column prop="timestamp" label="时间" width="180"></el-table-column>
        <el-table-column prop="user" label="用户" width="150"></el-table-column>
        <el-table-column prop="action" label="操作类型" width="150"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'SystemLogs',
  data() {
    return {
      logs: [
        {
          id: 1,
          timestamp: '2024-08-30 10:30:00',
          user: 'admin',
          action: '登录',
          description: '管理员登录系统',
        },
        {
          id: 2,
          timestamp: '2024-08-30 10:45:00',
          user: 'user',
          action: '修改项目',
          description: '用户修改了项目A的信息',
        },
        {
          id: 3,
          timestamp: '2024-08-30 11:00:00',
          user: 'admin',
          action: '添加用户',
          description: '管理员添加了用户B',
        },
        // 更多日志数据...
      ],
      filters: {
        user: '',
        action: '',
        date: null,
      },
      filteredLogs: []
    };
  },
  created() {
    this.filteredLogs = this.logs; // 默认显示所有日志
  },
  methods: {
    filterLogs() {
      this.filteredLogs = this.logs.filter(log => {
        const matchesUser = this.filters.user === '' || log.user.includes(this.filters.user);
        const matchesAction = this.filters.action === '' || log.action === this.filters.action;
        const matchesDate = !this.filters.date || (
          new Date(log.timestamp) >= new Date(this.filters.date[0]) &&
          new Date(log.timestamp) <= new Date(this.filters.date[1])
        );
        return matchesUser && matchesAction && matchesDate;
      });
    },
    resetFilters() {
      this.filters = {
        user: '',
        action: '',
        date: null,
      };
      this.filteredLogs = this.logs;
    }
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
  justify-content: space-between;
  flex-wrap: wrap;
}

.filter-form .el-form-item {
  margin-right: 20px;
  margin-bottom: 10px;
}
</style>
