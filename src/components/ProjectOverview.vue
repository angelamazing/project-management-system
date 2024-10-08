<template>
  <div class="project-overview">
    <el-card>
      <h2>项目总览</h2>
      <div class="filters">
        <!-- 主选项选择框 -->
        <el-select v-model="mainOption" placeholder="选择展示指标" style="width: 200px;" @change="updateChart">
          <el-option label="项目地点" value="location"></el-option>
          <el-option label="项目类型" value="type"></el-option>
          <el-option label="项目风险" value="risk"></el-option>
        </el-select>

        <!-- 副选项筛选框 -->
        <el-select v-model="filterCriteria.location" placeholder="筛选地点" style="width: 200px;" @change="updateChart">
          <el-option label="不筛选（所有）" value=""></el-option>
          <el-option v-for="location in locations" :key="location" :label="location" :value="location"></el-option>
        </el-select>

        <el-select v-model="filterCriteria.type" placeholder="筛选类型" style="width: 200px;" @change="updateChart">
          <el-option label="不筛选（所有）" value=""></el-option>
          <el-option v-for="type in types" :key="type" :label="type" :value="type"></el-option>
        </el-select>

        <el-select v-model="filterCriteria.risk" placeholder="筛选风险等级" style="width: 200px;" @change="updateChart">
          <el-option label="不筛选（所有）" value=""></el-option>
          <el-option v-for="risk in risks" :key="risk" :label="risk" :value="risk"></el-option>
        </el-select>
      </div>
      
      <div class="charts">
        <!-- 饼状图展示分布 -->
        <div class="chart-container">
          <h3>{{ pieChartTitle }}</h3>
          <v-chart :option="pieChartOptions" style="height: 400px;"></v-chart>
        </div>
        
        <!-- 柱状图展示项目状态 -->
        <div class="chart-container">
          <h3>项目状态统计</h3>
          <v-chart :option="barChartOptions" style="height: 400px;"></v-chart>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart, BarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
import VChart from 'vue-echarts';

use([CanvasRenderer, PieChart, BarChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent]);

export default defineComponent({
  name: 'ProjectOverview',
  components: {
    VChart,
  },
  data() {
    return {
      mainOption: 'location', // 默认展示指标
      filterCriteria: {
        location: '',
        type: '',
        risk: '',
      },
      locations: ['地点A', '地点B', '地点C', '地点D', '地点E'], // 示例地点
      types: ['勘察', '监测', '设计', '施工', '咨询'], // 示例类型
      risks: ['低风险', '中风险', '高风险', '极高风险'], // 示例风险等级
      projects: [
        { location: '地点A', type: '勘察', risk: '高风险' },
        { location: '地点B', type: '施工', risk: '中风险' },
        { location: '地点C', type: '监测', risk: '低风险' },
        { location: '地点D', type: '设计', risk: '高风险' },
        { location: '地点E', type: '咨询', risk: '中风险' },
        { location: '地点A', type: '监测', risk: '低风险' },
        { location: '地点B', type: '设计', risk: '极高风险' },
        { location: '地点C', type: '施工', risk: '低风险' },
        { location: '地点D', type: '勘察', risk: '中风险' },
        { location: '地点E', type: '监测', risk: '高风险' },
        // 更多项目数据
      ],
      pieChartOptions: {},
      barChartOptions: {},
      pieChartTitle: '项目地点分布',
    };
  },
  methods: {
    updateChart() {
      // 筛选数据
      let filteredProjects = this.projects.filter(project => {
        return (
          (this.filterCriteria.location === '' || project.location === this.filterCriteria.location) &&
          (this.filterCriteria.type === '' || project.type === this.filterCriteria.type) &&
          (this.filterCriteria.risk === '' || project.risk === this.filterCriteria.risk)
        );
      });

      // 更新饼状图数据
      let pieData = this.calculateChartData(filteredProjects, this.mainOption);
      this.pieChartOptions = {
        title: {
          text: `按${this.getOptionLabel(this.mainOption)}分布`,
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          bottom: '10%',
          left: 'center',
        },
        series: [
          {
            name: this.getOptionLabel(this.mainOption),
            type: 'pie',
            radius: '50%',
            data: pieData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };

      // 更新柱状图数据
      this.barChartOptions = {
        title: {
          text: '项目状态统计',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: ['待审核', '审核通过', '审核未通过'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '项目数量',
            type: 'bar',
            data: [
              this.countStatus('待审核'),
              this.countStatus('审核通过'),
              this.countStatus('审核未通过')
            ],
            itemStyle: {
              color: '#5470C6',
            },
          },
        ],
      };
    },
    getOptionLabel(option) {
      switch(option) {
        case 'location': return '项目地点';
        case 'type': return '项目类型';
        case 'risk': return '项目风险';
        default: return '';
      }
    },
    calculateChartData(projects, option) {
      const counts = projects.reduce((acc, project) => {
        const key = project[option];
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(counts).map(([key, value]) => ({ name: key, value }));
    },
    countStatus(status) {
      // 根据项目状态统计项目数量
      return this.projects.filter(project => {
        // 这里假设 '待审核' 为默认状态
        // 你可以根据项目的实际状态逻辑来修改
        return project.status === status; 
      }).length;
    },
  },
  watch: {
    mainOption: 'updateChart',
    'filterCriteria.location': 'updateChart',
    'filterCriteria.type': 'updateChart',
    'filterCriteria.risk': 'updateChart',
  },
  mounted() {
    this.updateChart();
  },
});
</script>

<style scoped>
.project-overview {
  padding: 20px;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.charts {
  display: flex;
  justify-content: space-around;
}

.chart-container {
  width: 45%;
}
</style>
