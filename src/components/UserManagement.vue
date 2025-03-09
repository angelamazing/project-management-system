<template>
  <div class="user-management">
    <el-card>
      <div class="header">
        <h2>用户管理</h2>
        <div style="display: flex; gap: 10px;"> <!-- 添加一个容器并设置间距 -->
          <el-button type="primary" @click="importUsers">批量导入用户</el-button>
          <el-button type="primary" @click="openAddUserDialog">添加用户</el-button>
        </div>
      </div>

      <!-- 添加筛选功能 -->
      <div class="filters">
        <el-input v-model="filter.username" placeholder="筛选用户名" style="width: 200px; margin-right: 10px;"></el-input>
        <el-select v-model="filter.departmentId" placeholder="筛选部门" style="width: 200px; margin-right: 10px;">
          <el-option label="所有" :value="''" />
          <el-option
            v-for="dept in departments"
            :key="dept.id"
            :label="dept.name"
            :value="dept.id"
          />
        </el-select>
        <el-select v-model="filter.permission" placeholder="筛选角色" style="width: 200px;">
          <el-option label="所有" :value="''" />
          <el-option
            v-for="item in permissionOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>

      <el-table :data="filteredUsers" style="width: 100%">
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="permission" label="角色"></el-table-column>
        <el-table-column prop="departmentName" label="部门"></el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button @click="editUser(scope.row)" size="small">编辑</el-button>
            <el-button @click="deleteUser(scope.row)" type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <el-pagination
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="totalUsers"
        layout="total, prev, pager, next, jumper"
      />
    </el-card>

    <!-- 编辑角色对话框 -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="'编辑角色'" 
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="editForm.departmentId">
            <el-option
              v-for="dept in departments"
              :key="dept.id"
              :label="dept.name"
              :value="dept.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="角色">
          <el-select 
            v-model="editForm.permission"
            placeholder="请先选择部门"
            :disabled="!editForm.departmentId"
            style="width: 100%"
          >
            <el-option
              v-for="item in currentPermissionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="性别">
          <el-radio-group v-model="editForm.gender">
            <el-radio :value="1">男</el-radio>
            <el-radio :value="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleUpdate">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加用户对话框 -->
    <el-dialog 
      v-model="addDialogVisible" 
      title="添加用户" 
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form :model="addForm" :rules="rules" ref="addFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="departmentId">
          <el-select 
            v-model="addForm.departmentId" 
            @change="handleDepartmentChange"
            placeholder="请选择部门" 
            style="width: 100%"
          >
            <el-option
              v-for="dept in departments"
              :key="dept.id"
              :label="dept.name"
              :value="dept.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="角色" prop="permission">
          <el-select 
            v-model="addForm.permission" 
            placeholder="请先选择部门" 
            :disabled="!addForm.departmentId"
            style="width: 100%"
          >
            <el-option
              v-for="item in currentPermissionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="addForm.gender">
            <el-radio :value="1">男</el-radio>
            <el-radio :value="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAdd">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import axios from '@/axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { mapGetters } from 'vuex';
import departmentMapping from '@/constants/departmentMapping'
import * as XLSX from 'xlsx';


export default {
  name: 'UserManagement',
  setup() {
    const users = ref([])
    const totalUsers = ref(0)
    const currentPage = ref(1)
    const pageSize = ref(10)
    const dialogVisible = ref(false)
    const editForm = reactive({
      id: '',
      username: '',
      permission: '',
      departmentId: '',
      gender: 1
    })

    const addDialogVisible = ref(false)
    const addFormRef = ref(null)
    const addForm = reactive({
      username: '',
      permission: '',
      departmentId: '',
      gender: 1
    })
    
    const rules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
      ],
      permission: [
        { required: true, message: '请选择角色', trigger: 'change' }
      ],
      departmentId: [
        { required: true, message: '请选择部门', trigger: 'change' }
      ],
      gender: [
        { required: true, message: '请选择性别', trigger: 'change' }
      ]
    }

    const departments = ref([])

    const filter = reactive({
      username: '',
      departmentId: '',
      permission: ''
    });

    // 计算属性：过滤后的用户列表
    const filteredUsers = computed(() => {
      return users.value.filter(user => {
        return (
          (!filter.username || user.username.includes(filter.username)) &&
          (!filter.departmentId || user.departmentId === filter.departmentId) &&
          (!filter.permission || user.permission === filter.permission)
        );
      });
    });

    // 计算属性：可选角色列表
    const permissionOptions = computed(() => {
      // 这里可以根据需要返回角色选项
      return [
        { label: '普通用户', value: '普通用户' },
        { label: '部门安全员', value: '部门安全员' },
        { label: '部门安全主管', value: '部门安全主管' },
        { label: '安全主管', value: '安全主管' },
        { label: '队领导', value: '队领导' },
        { label: '管理员', value: '管理员' }
      ];
    });

    // 获取部门列表
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('/departments/finds')
        if (response.data.code === 1) {
          departments.value = response.data.data
          
        }
      } catch (error) {
        ElMessage.error('获取部门列表失败')
      }
    }

    // 获取用户列表
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/users/finds', {
          params: {
            username: filter.username,
            gender: addForm.gender,
            departmentId: filter.departmentId,
            page: currentPage.value,
            pageSize: pageSize.value
          }
        });
        if (response.data.code === 1) {
          users.value = response.data.data.rows.map(user => {
            // 检查 departmentId 是否存在
            if (user.departmentId === undefined || user.departmentId === null) {
              console.warn('用户缺少 departmentId:', user);
              user.departmentName = '未知部门';
            } else {
              // 确保 departmentId 是数字类型
              const departmentId = Number(user.departmentId);
              // 检查 departmentMapping 是否包含该 departmentId
              if (departmentMapping[departmentId]) {
                
                user.departmentName = departmentMapping[departmentId].name;
              } else {
                console.warn('未找到对应的部门名称，departmentId:', departmentId);
                user.departmentName = '未知部门';
              }
            }
            return user;
          });
          totalUsers.value = response.data.data.total; // 更新总用户数
        } else {
          ElMessage.error('获取用户列表失败，错误代码: ' + response.data.code);
        }
      } catch (error) {
        console.error('获取用户列表时发生错误:', error);
        ElMessage.error('获取用户列表失败');
      }
    };

    // 打开编辑对话框
    const editUser = (row) => {
      editForm.id = row.id;
      editForm.username = row.username;
      editForm.permission = row.permission;
      editForm.departmentId = row.departmentId;
      editForm.gender = row.gender;
      
      dialogVisible.value = true;
    }

    // 更新用户角色
    const handleUpdate = async () => {
      try {
        const response = await axios.post('/users/update', {
          id: editForm.id,
          username: editForm.username,
          permission: editForm.permission,
          departmentId: editForm.departmentId
        });
        
        if (response.data.code === 1) {
          ElMessage.success('更新成功');
          dialogVisible.value = false;
          fetchUsers(); // 刷新列表
        } else {
          ElMessage.error(response.data.msg);
        }
      } catch (error) {
        ElMessage.error('更新失败');
      }
    };

    // 删除用户
    const deleteUser = (user) => {
      ElMessageBox.confirm('确认删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const response = await axios.post(`/users/delete/${user.id}`)
          if (response.data.code === 1) {
            ElMessage.success('删除成功')
            fetchUsers()
          } else {
            ElMessage.error(response.data.msg)
          }
        } catch (error) {
          ElMessage.error('删除失败')
        }
      }).catch(() => {
        // 添加catch块来处理取消操作
        ElMessage({
          type: 'info',
          message: '已取消删除'
        })
      })
    }

    // 打开添加用户对话框
    const openAddUserDialog = () => {
      addDialogVisible.value = true
      if (addFormRef.value) {
        addFormRef.value.resetFields()
      }
    }

    // 添加用户
    const handleAdd = async () => {
      if (!addFormRef.value) return
      
      await addFormRef.value.validate(async (valid) => {
        if (valid) {
          try {
            const response = await axios.post('/users/add', addForm)
            if (response.data.code === 1) {
              ElMessage.success('添加成功')
              addDialogVisible.value = false
              fetchUsers() // 刷新列表
            } else {
              ElMessage.error(response.data.msg)
            }
          } catch (error) {
            ElMessage.error('添加失败')
          }
        }
      })
    }

    // 根据部门ID获取可选角色
    const getPermissionsByDepartment = (departmentId) => {
      const department = departments.value.find(d => d.id === departmentId)
      if (!department) return []
      
      // 特殊部门的角色限制
      switch (department.name) {
        case '安全科':
          return [{ label: '安全主管', value: '安全主管' }]
        case '队领导':
          return [{ label: '队领导', value: '队领导' }]
        case '管理员':
          return [{ label: '管理员', value: '管理员' }]
        default:
          // 其他部门可以选择除了上述三个角色之外的角色
          return [
            { label: '普通用户', value: '普通用户' },
            { label: '部门安全员', value: '部门安全员' },
            { label: '部门安全主管', value: '部门安全主管' }
          ]
      }
    }

    // 统一处理部门变化
    const handleDepartmentChange = (departmentId) => {
      console.log('部门变化:', departmentId)
      const currentForm = addDialogVisible.value ? addForm : editForm
      currentForm.permission = ''
      
      // 打印当前部门和可选角色，用于调试
      const department = departments.value.find(d => d.id === departmentId)
      console.log('当前选择的部门:', department)
      // console.log('可选角色:', getPermissionsByDepartment(departmentId))
    }

    // 计算属性：当前可选的角色列表
    const currentPermissionOptions = computed(() => {
      const currentForm = addDialogVisible.value ? addForm : editForm
      const departmentId = currentForm.departmentId
      // console.log('计算属性 - 当前部门ID:', departmentId)
      // console.log('计算属性 - 是否为添加对话框:', addDialogVisible.value)
      
      if (!departmentId) return []
      const options = getPermissionsByDepartment(departmentId)
      // console.log('计算属性 - 当前可选角色:', options)
      return options
    })

    // 处理页码变化
    const handlePageChange = (page) => {
      currentPage.value = page;
      fetchUsers(); // 重新获取用户列表
    };

    // 导入用户方法
    const importUsers = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.xlsx, .xls';
      input.onchange = async (event) => {
        const file = event.target.files[0];
        if (!file) {
          console.error('未选择文件');
          return;
        }

        try {
          const data = await file.arrayBuffer();
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const users = XLSX.utils.sheet_to_json(firstSheet);

          // 转换用户数据
          const formattedUsers = users.map(user => ({
            username: user['用户名'],
            gender: user['性别'] === '男' ? 1 : 2, // 根据性别转换为1或2
            permission: user['角色'],
            departmentId: user['部门ID']
          }));

          // 发送数据到后端
          console.log('formattedUsers', formattedUsers);
          const response = await axios.post('/users/adds', JSON.stringify(formattedUsers), {
            headers: {
              'Content-Type': 'application/json' // 设置请求头为 JSON
            }
          });

          if (response.data.code === 1) {
            ElMessage.success('用户导入成功');
            console.log('formattedUsers', formattedUsers);
            fetchUsers(); // 刷新用户列表
          } else {
            ElMessage.error(response.data.msg);
          }
        } catch (error) {
          console.error('导入过程中发生错误:', error);
          ElMessage.error('导入失败');
        }
      };
      input.click();
    }

    onMounted(() => {
      fetchDepartments()
      fetchUsers()
    })

    return {
      users,
      totalUsers,
      currentPage,
      pageSize,
      dialogVisible,
      editForm,
      editUser,
      handleUpdate,
      deleteUser,
      addDialogVisible,
      addFormRef,
      addForm,
      rules,
      openAddUserDialog,
      handleAdd,
      departments,
      fetchDepartments,
      currentPermissionOptions,
      handleDepartmentChange,
      filter,
      filteredUsers,
      permissionOptions,
      fetchUsers,
      handlePageChange,
      importUsers
    }
  },
  computed: {
    ...mapGetters(['userId']) // 映射 userId getter
  },
  mounted() {
    // console.log('当前用户ID:', this.userId); // 在组件挂载时获取用户ID
 
  }

}
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-select) {
  width: 100%;
}

.filters {
  margin-bottom: 20px;
}
</style>