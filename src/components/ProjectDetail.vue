<template>
  <div class="project-review">
    <h2>审核项目</h2>
    <div v-if="project">
      <p><strong>项目名称:</strong> {{ project.name }}</p>
      <p><strong>项目类型:</strong> {{ project.type }}</p>
      <p><strong>团队成员:</strong> {{ project.team }}</p>
      <p><strong>安全需求:</strong> {{ project.security }}</p>
      <button @click="approveProject">通过审核</button>
      <button @click="rejectProject">退回项目</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      project: {
        name: '示例项目',
        type: 'Web 应用',
        team: '开发团队A',
        security: '高安全性要求'
      }
    };
  },
  methods: {
    approveProject() {
      alert('项目已通过审核');
    },
    rejectProject() {
      alert('项目已退回');
    }
  }
};
</script>

<style scoped>
.project-review {
  max-width: 600px;
  margin: 20px auto;
}
</style>
