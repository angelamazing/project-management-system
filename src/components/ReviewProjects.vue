<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-10-04 16:06:48
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-10-05 12:09:05
 * @FilePath: \project-management-system\src\components\ReviewProjects.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="review-projects">
    <el-card>
      <h2>待审核项目列表</h2>
      <el-table :data="projects" style="width: 100%">
        <el-table-column prop="name" label="项目名称"></el-table-column>
        <el-table-column prop="type" label="项目类型"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" size="mini" @click="reviewProject(scope.row, '通过')">通过</el-button>
            <el-button type="danger" size="mini" @click="reviewProject(scope.row, '拒绝')">拒绝</el-button>
            <el-button size="mini" @click="viewDetails(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model:visible="detailDialogVisible" title="项目详情">
      <el-form label-position="left" label-width="120px">
        <el-form-item label="项目名称">
          <el-input v-model="currentProject.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="项目类型">
          <el-input v-model="currentProject.type" disabled></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-input v-model="currentProject.status" disabled></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="currentProject.description" disabled></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ReviewProjects',
  data() {
    return {
      projects: [
        { id: 1, name: '项目A', type: '地灾治理和矿山生态修复类', status: '待审核', description: '这是项目A的描述' },
        { id: 2, name: '项目B', type: '地质勘察钻探类', status: '待审核', description: '这是项目B的描述' },
        { id: 3, name: '项目C', type: '地灾治理和矿山生态修复类', status: '待审核', description: '这是项目C的描述' },
        // 更多模拟项目数据...
      ],
      detailDialogVisible: false,
      currentProject: {}
    };
  },
  methods: {
    reviewProject(project, decision) {
      this.$confirm(`你确定要${decision}这个项目吗?`, '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 更新项目状态
        project.status = decision === '通过' ? '审核通过' : '审核未通过';
        
        // 从项目列表中删除审核的项目
        this.projects = this.projects.filter(p => p.id !== project.id);
        
        this.$message({
          type: 'success',
          message: `项目已${decision}`
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作已取消'
        });
      });
    },
    viewDetails(project) {
      this.currentProject = { ...project };
      this.detailDialogVisible = true;
    }
  }
};
</script>

<style scoped>
.review-projects {
  padding: 20px;
}

.dialog-footer {
  text-align: right;
}
</style>
