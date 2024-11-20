<template>
  <div class="user-management">
    <el-card>
      <div class="header">
        <h2>用户管理</h2>
        <el-button type="primary" @click="openAddUserDialog">添加用户</el-button>
      </div>

      <el-table :data="users" style="width: 100%">
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="permission" label="角色"></el-table-column>
          
        <el-table-column label="操作">
          <template #default="scope">
            <el-button @click="editUser(scope.row)" size="small">编辑</el-button>
            <el-button @click="deleteUser(scope.row)" type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑用户对话框 -->
    <el-dialog v-model="userDialogVisible" :title="isEditMode ? '编辑用户' : '添加用户'">
      <el-form :model="userForm" ref="userForm" :rules="rules" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" placeholder="请选择角色">
            <el-option label="普通用户" value="普通用户"></el-option>
            <el-option label="安全员" value="安全员"></el-option>
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

      <template #footer>
        <el-button @click="userDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="isEditMode ? updateUser() : addUser()">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import axios from '@/axios';
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
  name: 'UserManagement',
  setup() {
    const users = ref([]);
    const userDialogVisible = ref(false);
    const isEditMode = ref(false);
    const userForm = reactive({
      id: null,
      username: '',
      role: '',
      permissions: [],
    });
    const rules = {
      username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
      role: [{ required: true, message: '请选择角色', trigger: 'change' }],
      permissions: [{ required: true, message: '请选择至少一个权限', trigger: 'change' }],
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get('/users/finds');
        if (response.data.code === 1) {
          users.value = response.data.data.rows;
        } else {
          ElMessage.error(response.data.msg);
        }
      } catch (error) {
        ElMessage.error('Failed to fetch users');
      }
    };

    const openAddUserDialog = () => {
      isEditMode.value = false;
      Object.assign(userForm, {
        id: null,
        username: '',
        role: '',
        permissions: [],
      });
      userDialogVisible.value = true;
    };

    const editUser = (user) => {
      isEditMode.value = true;
      Object.assign(userForm, user);
      userDialogVisible.value = true;
    };

    const addUser = async () => {
      const formRef = userForm;
      formRef.validate(async (valid) => {
        if (valid) {
          try {
            const response = await axios.post('/users/add', userForm);
            if (response.data.code === 1) {
              fetchUsers();
              userDialogVisible.value = false;
              ElMessage.success('用户添加成功');
            } else {
              ElMessage.error(response.data.msg);
            }
          } catch (error) {
            ElMessage.error('Failed to add user');
          }
        }
      });
    };

    const updateUser = async () => {
      const formRef = userForm;
      formRef.validate(async (valid) => {
        if (valid) {
          try {
            const response = await axios.put('/users/update', userForm);
            if (response.data.code === 1) {
              fetchUsers();
              userDialogVisible.value = false;
              ElMessage.success('用户更新成功');
            } else {
              ElMessage.error(response.data.msg);
            }
          } catch (error) {
            ElMessage.error('Failed to update user');
          }
        }
      });
    };

    const deleteUser = (user) => {
      ElMessageBox.confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const response = await axios.delete(`/users/delete/${user.id}`);
          if (response.data.code === 1) {
            fetchUsers();
            ElMessage.success('用户删除成功');
          } else {
            ElMessage.error(response.data.msg);
          }
        } catch (error) {
          ElMessage.error('Failed to delete user');
        }
      }).catch(() => {
        ElMessage.info('已取消删除');
      });
    };

    onMounted(() => {
      fetchUsers();
    });

    return {
      users,
      userDialogVisible,
      isEditMode,
      userForm,
      rules,
      fetchUsers,
      openAddUserDialog,
      editUser,
      addUser,
      updateUser,
      deleteUser,
    };
  }
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