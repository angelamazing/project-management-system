<template>
  <div>
    <el-form-item label="施工工艺" required>
      <el-radio-group v-model="localForm.constructionType" @change="handleConstructionTypeChange">
        <el-radio value="地灾治理和矿山生态修复类">地灾治理和矿山生态修复类</el-radio>
        <el-radio value="地质勘查钻探类">地质勘查钻探类</el-radio>
        <el-radio value="地质调查、测量测绘类">地质调查、测量测绘类</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-row v-if="localForm.constructionType === '地灾治理和矿山生态修复类'" :gutter="20">
      <el-col v-for="(item, index) in localForm.disasterItems" :key="index" :span="12" class="disaster-col">
        <el-form-item :label="item.label">
          <el-select v-model="item.model" placeholder="请选择" style="width: 100%; max-width: 300px;" @change="emitUpdate">
            <el-option v-for="(option, idx) in item.options" :key="idx" :label="option.label" :value="option.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <template v-if="localForm.constructionType === '地质勘查钻探类'">
      <el-form-item label="大型钻探设备">
        <el-select v-model="localForm.largeDrillingEquipment" placeholder="请选择" @change="emitUpdate">
          <el-option label="无大型钻探设备 (0分)" value="0"></el-option>
          <el-option label="大型钻探设备或中深孔钻探超过20% (16分)" value="大型钻探设备或中深孔钻探超过20% (16分)"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="是否存在安全威胁">
        <el-checkbox-group v-model="localForm.safetyThreats" @change="emitUpdate">
          <el-checkbox v-for="(threat, idx) in safetyThreatOptions" :key="idx" :value="threat.label">
            {{ threat.label }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </template>

    <el-form-item label="施工工艺总分">
      <el-input :value="calculateScore()" disabled></el-input>
    </el-form-item>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import cloneDeep from 'lodash/cloneDeep';

export default {
  props: {
    initialData: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['updateData'],
  setup(props, { emit }) {
    const localForm = ref(cloneDeep(props.initialData));

    const safetyThreatOptions = [
      { label: '地上/地下管线安全距离不符合要求 (1分)' },
      { label: '作业区域存在滑坡、崩塌、滚石、洪水、危房等安全威胁 (1分)' },
      { label: '未按规定设置围挡和安全警示标志标牌 (1分)' },
      { label: '作业区域坑洞、临边等未采取安全防护措施 (1分)' },
      { label: '水上、铁路、公路等特殊地区未采取必要的施工安全防护措施 (1分)' },
      { label: '设备安装不稳固 (1分)' },
      { label: '机械传（转）动部位安全防护不符合要求 (1分)' },
      { label: '钢丝绳、绳卡安装不符合规范要求 (1分)' },
      { label: '临时用电电缆未按要求搭设 (1分)' },
      { label: '用电设备未落实接地保护和"一机一闸一箱一漏"要求 (1分)' },
      { label: '劳动防护用品穿戴不规范 (1分)' },
      { label: '药品配备不齐全 (1分)' },
      { label: '未按要求配置消防器材 (1分)' },
      { label: '超龄人员 (1分)' },
    ];

    const calculateScore = () => {
      if (localForm.value.constructionType === '地灾治理和矿山生态修复类') {
        let mainScore = 0;
        let structureScore = 0;
        let drainageScore = 0;

        (localForm.value.disasterItems || []).forEach(item => {
          const value = Number(item.model || 0);
          switch (item.label) {
            case '爆破方量':
            case '抗滑桩桩长':
            case '清危方量':
            case '脚手架连续搭设长度':
              mainScore += value;
              break;
            case '格构护坡坡度':
            case '主、被动防护网高度':
              structureScore += value;
              break;
            case '挡墙高度':
            case '截、排水沟连续长度':
              drainageScore += value;
              break;
          }
        });

        mainScore = Math.min(mainScore, 15);
        structureScore = Math.min(structureScore, 10);
        drainageScore = Math.min(drainageScore, 5);

        return mainScore + structureScore + drainageScore;
      } else if (localForm.value.constructionType === '钻探类') {
        const baseScore = Number(localForm.value.largeDrillingEquipment || 0);
        const threatScore = (localForm.value.safetyThreats || []).length;
        return Math.min(baseScore + threatScore, 30); // 最高分为 30 分
      } else {
        // 地质调查、测量测绘类
        return 0; // 或者根据需求设置一个默认分数
      }
    };

    const emitUpdate = () => {
      emit('updateData', cloneDeep(localForm.value));
    };

    const handleConstructionTypeChange = () => {
      // 重置相关字段
      if (localForm.value.constructionType === '钻探类') {
        localForm.value.largeDrillingEquipment = '0';
        localForm.value.safetyThreats = [];
      } else if (localForm.value.constructionType === '地灾治理和矿山生态修复类') {
        if (!localForm.value.disasterItems) {
          localForm.value.disasterItems = getDefaultDisasterItems();
        } else {
          localForm.value.disasterItems = localForm.value.disasterItems.map(item => ({...item, model: '0'}));
        }
      }
      // 清除其他类型特有的字段
      if (localForm.value.constructionType !== '钻探类') {
        delete localForm.value.largeDrillingEquipment;
        delete localForm.value.safetyThreats;
      }
      if (localForm.value.constructionType !== '地灾治理和矿山生态修复类') {
        delete localForm.value.disasterItems;
      }
      emitUpdate();
    };

    const getDefaultDisasterItems = () => [
      {
        label: '爆破方量',
        model: '0',
        options: [
          { label: '0m³ (0分)', value: '0' },
          { label: '0m³＜＜50m³ (4分)', value: '4' },
          { label: '50m³≤＜100m³ (8分)', value: '8' },
          { label: '≥100m³ (15分)', value: '15' },
        ],
      },
      {
        label: '抗滑桩桩长',
        model: '0',
        options: [
          { label: '0m (0分)', value: '0' },
          { label: '0m＜＜5m (4分)', value: '4' },
          { label: '5m≤＜10m (8分)', value: '8' },
          { label: '≥10m (15分)', value: '15' },
        ],
      },
      {
        label: '清危方量',
        model: '0',
        options: [
          { label: '0m³ (0分)', value: '0' },
          { label: '0m³＜＜1000m³ (2分)', value: '2' },
          { label: '1000m³≤＜3000m³ (3分)', value: '3' },
          { label: '≥3000m³ (5分)', value: '5' },
        ],
      },
      {
        label: '脚手架连续搭设长度',
        model: '0',
        options: [
          { label: '0m (0分)', value: '0' },
          { label: '0m＜＜15m (4分)', value: '4' },
          { label: '15m≤＜24m (8分)', value: '8' },
          { label: '≥24m (15分)', value: '15' },
        ],
      },
      {
        label: '格构护坡坡度',
        model: '0',
        options: [
          { label: '0° (0分)', value: '0' },
          { label: '0°＜＜30° (2分)', value: '2' },
          { label: '30°≤＜45° (4分)', value: '4' },
          { label: '≥45° (10分)', value: '10' },
        ],
      },
      {
        label: '主被动防护网高度',
        model: '0',
        options: [
          { label: '0m (0分)', value: '0' },
          { label: '0m＜＜10m (2分)', value: '2' },
          { label: '10m≤＜15m (4分)', value: '4' },
          { label: '≥15m (10分)', value: '10' },
        ],
      },
      {
        label: '挡墙高度',
        model: '0',
        options: [
          { label: '0m (0分)', value: '0' },
          { label: '0m＜＜3m (1分)', value: '1' },
          { label: '≥3m (5分)', value: '5' },
        ],
      },
      {
        label: '截、排水沟连续长度',
        model: '0',
        options: [
          { label: '0m (0分)', value: '0' },
          { label: '0m＜＜30m (1分)', value: '1' },
          { label: '≥30m (5分)', value: '5' },
        ],
      },
    ];

    watch(() => props.initialData, (newValue) => {
      localForm.value = cloneDeep(newValue);
    }, { deep: true });

    onMounted(() => {
      if (Object.keys(localForm.value).length === 0) {
        // Initialize with default values if empty
        localForm.value = {
          constructionType: '',
        };
      }
      handleConstructionTypeChange(); // 确保初始状态正确
    });

    return {
      localForm,
      safetyThreatOptions,
      calculateScore,
      emitUpdate,
      handleConstructionTypeChange,
    };
  },
};
</script>

<style scoped>
.el-form-item {
  margin-bottom: 15px;
}

.el-form-item__label {
  min-width: 150px;
  white-space: nowrap;
}

.el-input {
  width: 100%;
}

.disaster-col {
  margin-bottom: 20px;
}
</style>