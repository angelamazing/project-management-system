<template>
  <div class="user-management">
    <el-card>
      <div class="header">
        <h2>用户管理</h2>
        <el-button type="primary" @click="openAddUserDialog">添加用户</el-button>
      </div>

      <el-table :data="users" style="width: 100%">
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="role" label="角色"></el-table-column>
        <el-table-column prop="permissions" label="额外权限">
          <template v-slot="scope">
            <el-tag
              v-for="permission in scope.row.permissions"
              :key="permission"
              type="info"
              style="margin-right: 4px"
            >
              {{ permission }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button @click="editUser(scope.row)" size="mini">编辑</el-button>
            <el-button @click="deleteUser(scope.row)" type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑用户对话框 -->
    <el-dialog v-model:visible="userDialogVisible" :title="isEditMode ? '编辑用户' : '添加用户'">
      <el-form :model="userForm" ref="userForm" :rules="rules" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" placeholder="请选择角色">
            <el-option label="普通用户" value="普通用户"></el-option>
            <el-option label="审核人员" value="审核人员"></el-option>
            <el-option label="管理员" value="管理员"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限" prop="permissions">
          <el-select v-model="userForm.permissions" multiple placeholder="请选择权限">
            <el-option label="查看项目" value="查看项目"></el-option>
            <el-option label="新建项目" value="新建项目"></el-option>
            <el-option label="审核项目" value="审核项目"></el-option>
            <el-option label="查看系统日志" value="查看系统日志"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <template v-slot:footer>
        <el-button @click="userDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="isEditMode ? updateUser() : addUser()">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UserManagement',
  data() {
    return {
      users: [
        {
          id: 1,
          username: 'admin',
          role: '管理员',
          permissions: ['删除项目'],
        },
        {
          id: 2,
          username: 'user',
          role: '普通用户',
          permissions: ['查看项目总览'],
        },
      ],
      userDialogVisible: false,
      isEditMode: false,
      userForm: {
        id: null,
        username: '',
        role: '',
        permissions: [],
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        role: [{ required: true, message: '请选择角色', trigger: 'change' }],
        permissions: [{ required: true, message: '请选择至少一个权限', trigger: 'change' }],
      },
    };
  },
  methods: {
    openAddUserDialog() {
      this.isEditMode = false;
      this.userForm = {
        id: null,
        username: '',
        role: '',
        permissions: [],
      };
      this.userDialogVisible = true;
    },
    editUser(user) {
      this.isEditMode = true;
      this.userForm = { ...user };
      this.userDialogVisible = true;
    },
    addUser() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          this.userForm.id = this.users.length + 1;
          this.users.push({ ...this.userForm });
          this.userDialogVisible = false;
          this.$message.success('用户添加成功');
        }
      });
    },
    updateUser() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          const index = this.users.findIndex(user => user.id === this.userForm.id);
          if (index !== -1) {
            this.users.splice(index, 1, { ...this.userForm });
            this.userDialogVisible = false;
            this.$message.success('用户更新成功');
          }
        }
      });
    },
    deleteUser(user) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users.splice(index, 1);
          this.$message.success('用户删除成功');
        }
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
  },
};
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
</style>
