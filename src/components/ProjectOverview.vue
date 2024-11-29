<template>
  <div class="project-overview">
    <el-card>
      <h2>项目总览</h2>
      <div class="filters">
        <!-- 主选项选择框 -->
        <el-select v-model="mainOption" placeholder="选择展示指标" style="width: 200px;" @change="updateChart">
          <el-option label="项目风险" value="risk"></el-option>
          <el-option label="项目类型" value="type"></el-option>
          
        </el-select>

        <!-- 副选项筛选框 -->
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
          <v-chart :option="pieChartOptions" style="height: 400px;" ref="pieChart"></v-chart>
        </div>
        
        <!-- 柱状图展示项目状态 -->
        <div class="chart-container">
          <h3>项目状态统计</h3>
          <v-chart :option="barChartOptions" style="height: 400px;"></v-chart>
        </div>
      </div>
      
      <!-- 在charts下方添加项目列表 -->
      <div class="project-list">
        <div class="list-header">
          <h3>项目列表</h3>
          <div class="button-group">
            <el-button type="primary" size="small" @click="resetFilter">显示全部</el-button>
            <el-dropdown @command="handleExport" split-button type="success" size="small">
              导出列表
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="excel">导出到Excel</el-dropdown-item>
                  <el-dropdown-item command="csv">导出到CSV</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
        <el-table :data="filteredProjects" style="width: 100%">
          <el-table-column prop="projectName" label="项目名称" />
          <el-table-column prop="projectType" label="项目类型" />
          <el-table-column prop="riskLevel" label="风险等级">
            <template #default="scope">
              <el-tag :type="getRiskTagType(scope.row.riskLevel)">
                {{ scope.row.riskLevel }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="项目状态">
            <template #default="scope">
              <el-tag :type="getStatusTagType(scope.row.status)">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="totalScore" label="总分" />
        </el-table>
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
import axios from '@/axios'
import * as XLSX from 'xlsx';

use([CanvasRenderer, PieChart, BarChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent]);

export default defineComponent({
  name: 'ProjectOverview',
  components: {
    VChart,
  },
  data() {
    return {
      mainOption: 'risk',
      filterCriteria: {
        type: '',
        risk: '',
      },
      types: ['地灾治理和矿山生态修复类', '地质勘察钻探类', '地质调查、测量测绘类'],
      risks: ['低风险', '中风险', '高风险'],
      projects: [],
      projectStatusCounts: {},
      pieChartOptions: {},
      barChartOptions: {},
      pieChartTitle: '项目分布',
      selectedChartItem: null, // 新增：记录图表点击的项
    };
  },
  computed: {
    filteredProjects() {
      let filtered = this.projects;
      
      // 应用筛选条件
      if (this.filterCriteria.type) {
        filtered = filtered.filter(p => p.projectType === this.filterCriteria.type);
      }
      if (this.filterCriteria.risk) {
        filtered = filtered.filter(p => p.riskLevel === this.filterCriteria.risk);
      }
      
      // 如果有图表项被选中，进一步筛选
      if (this.selectedChartItem) {
        filtered = filtered.filter(p => {
          if (this.mainOption === 'type') {
            return p.projectType === this.selectedChartItem;
          } else if (this.mainOption === 'risk') {
            return p.riskLevel === this.selectedChartItem;
          }
          return true;
        });
      }
      
      return filtered;
    }
  },
  methods: {
    async fetchProjectData() {
      try {
        const { data: response } = await axios.get('/projectOverviews/finds');
        if (response.code === 1) {
          // 直接使用后端返回的数据，不需要转换
          // console.log(response.data);
          this.projects = response.data;
        } else {
          this.$message.error(response.msg || '获取项目数据失败');
        }
      } catch (error) {
        console.error('获取项目数据失败:', error);
        this.$message.error('获取项目数据失败');
      }
    },

    async fetchStatusData() {
      try {
        const { data: response } = await axios.get('/projectOverviews/findStatus');
        if (response.code === 1) {
          this.projectStatusCounts = response.data;
          this.updateChart();
        } else {
          this.$message.error(response.msg || '获取状态统计失败');
        }
      } catch (error) {
        console.error('获取状态统计失败:', error);
        this.$message.error('获取状态统计失败');
      }
    },

    countStatus(status) {
      return this.projectStatusCounts[status] || 0;
    },

    updateChart() {
      // 筛选数据
      let filteredProjects = this.projects.filter(project => {
        return (
          (this.filterCriteria.type === '' || project.projectType === this.filterCriteria.type) &&
          (this.filterCriteria.risk === '' || project.riskLevel === this.filterCriteria.risk)
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
          data: [ '未提交','待审核', '部门安全员已审核','部门安全主管已审核','安全主管已审核'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '项目数量',
            type: 'bar',
            data: [
              this.projectStatusCounts['未提交'] || 0,
              this.projectStatusCounts['待审核'] || 0,
              this.projectStatusCounts['部门安全员已审核'] || 0,
              this.projectStatusCounts['部门安全主管已审核'] || 0,
              this.projectStatusCounts['安全主管已审核'] || 0
            ],
            itemStyle: {
              color: '#5470C6',
            },
          },
        ],
      };
      
      // 在饼图配置中添加点击事件
      this.pieChartOptions.series[0].emphasis = {
        focus: 'series',
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      };
      
      // 添加点击事件处理
      this.pieChartOptions.series[0].select = {
        enabled: true
      };
    },
    getOptionLabel(option) {
      switch(option) {
        case 'type': return '项目类型';
        case 'risk': return '风险等级';
        default: return '';
      }
    },
    calculateChartData(projects, option) {
      const counts = projects.reduce((acc, project) => {
        // 根据 mainOption 选择正确的属性名
        const key = option === 'type' ? project.projectType : project.riskLevel;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(counts).map(([key, value]) => ({ name: key, value }));
    },
    getRiskTagType(risk) {
      const riskMap = {
        '高风险': 'danger',
        '中风险': 'warning',
        '低风险': 'success'
      };
      return riskMap[risk] || 'info';
    },
    
    getStatusTagType(status) {
      const statusMap = {
        '未提交': 'info',
        '待审核': 'warning',
        '已审核': 'success'
      };
      return statusMap[status] || 'info';
    },
    resetFilter() {
      this.selectedChartItem = null;
      this.filterCriteria.type = '';
      this.filterCriteria.risk = '';
      // 重新更新图表
      this.updateChart();
    },
    // 处理导出
    handleExport(type) {
      if (type === 'excel') {
        this.exportToExcel();
      } else if (type === 'csv') {
        this.exportToCSV();
      }
    },

    // 导出到Excel
    exportToExcel() {
      const data = this.formatExportData();
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "项目列表");
      
      // 生成文件名（包含日期时间）
      const fileName = `项目列表_${new Date().toLocaleDateString()}.xlsx`;
      XLSX.writeFile(wb, fileName);
    },    
    
    // 导出到CSV
    exportToCSV() {
      const data = this.formatExportData();
      const ws = XLSX.utils.json_to_sheet(data);
      const csv = XLSX.utils.sheet_to_csv(ws);
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const fileName = `项目列表_${new Date().toLocaleDateString()}.csv`;
      
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, fileName);
      } else {
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(link.href);
      }
    },

    // 格式化导出数据
    formatExportData() {
      return this.filteredProjects.map(project => ({
        '项目名称': project.projectName,
        '项目类型': project.projectType,
        '风险等级': project.riskLevel,
        '项目状态': project.status,
        '总分': project.totalScore
      }));
    }
  },
  watch: {
    mainOption: 'updateChart',
    'filterCriteria.type': 'updateChart',
    'filterCriteria.risk': 'updateChart',
  },
  mounted() {
    Promise.all([
      this.fetchProjectData(),
      this.fetchStatusData()
    ]).then(() => {
      this.updateChart();
      
      // 修改图表点击事件监听方式
      const pieChart = this.$refs.pieChart;
      if (pieChart) {
        // 使用 echarts 的 on 方法绑定事件
        pieChart.chart.on('click', (params) => {
          this.selectedChartItem = params.name;
          // 可选：添加重新筛选
          this.$nextTick(() => {
            this.updateChart();
          });
        });
      }
    });
  },

  // 添加 unmounted 生命周期钩子，清理事件监听
  unmounted() {
    const pieChart = this.$refs.pieChart;
    if (pieChart && pieChart.chart) {
      pieChart.chart.off('click');
    }
  }
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
  justify-content: space-between; /* 横向排列 */
}

.chart-container {
  width: 48%; /* 调整宽度以适应横向排列 */
}

.project-list {
  margin-top: 20px;
  padding: 20px 0;
}

.el-tag {
  width: 90px;
  text-align: center;
}

h3 {
  margin-bottom: 15px;
}

.el-table {
  margin-top: 15px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.list-header h3 {
  margin: 0;
}

.button-group {
  display: flex;
  gap: 10px;
}

/* 确保下拉菜单在其他元素之上 */
.el-dropdown {
  z-index: 1;
}
</style>