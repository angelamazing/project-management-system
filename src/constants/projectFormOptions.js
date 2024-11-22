/*
 * @Author: Jerry House angelamazing@163.com
 * @Date: 2024-11-20 11:23:00
 * @LastEditors: Jerry House angelamazing@163.com
 * @LastEditTime: 2024-11-20 14:40:28
 * @FilePath: \project-management-system\src\constants\projectFormOptions.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
//静态配置选项

export const projectTypes = ['地灾治理和矿山生态修复类', '地质勘察钻探类', '地质调查、测量测绘类'];

export const repairScales = [
  { value: '治理项目规模 300 万以上 (8分)', label: '治理项目规模 300 万以上 (8分)' },
  { value: '治理项目规模 100~300 万 (7分)', label: '治理项目规模 100~300 万 (7分)' },
  { value: '治理项目规模 100 万以下 (6分)', label: '治理项目规模 100 万以下 (6分)' },
];

export const drillCounts = [
  { value: '钻机数量 10 台及以上 (8分)', label: '钻机数量 10 台及以上 (8分)' },
  { value: '钻机数量 6~9 台 (7分)', label: '钻机数量 6~9 台 (7分)' },
  { value: '钻机数量 5 台 (6分)', label: '钻机数量 5 台 (6分)' },
  { value: '钻机数量 3~4 台 (5分)', label: '钻机数量 3~4 台 (5分)' },
  { value: '钻机数量 1~2 台 (4分)', label: '钻机数量 1~2 台 (4分)' },
];

export const investigatorCounts = [
  { value: '同时野外调查人员 8 人及以上 (8分)', label: '同时野外调查人员 8 人及以上 (8分)' },
  { value: '同时野外调查人员 7 人 (7分)', label: '同时野外调查人员 7 人 (7分)' },
  { value: '同时野外调查人员 6 人 (6分)', label: '同时野外调查人员 6 人 (6分)' },
  { value: '同时野外调查人员 5 人 (5分)', label: '同时野外调查人员 5 人 (5分)' },
  { value: '同时野外调查人员 4 人 (4分)', label: '同时野外调查人员 4 人 (4分)' },
  { value: '同时野外调查人员 3 人 (3分)', label: '同时野外调查人员 3 人 (3分)' },
  { value: '同时野外调查人员 2 人 (2分)', label: '同时野外调查人员 2 人 (2分)' },
];

export const surroundingRisks = [
  { value: '存在一项风险 (6分)', label: '存在一项风险 (6分)' },
  { value: '存在两项风险 (7分)', label: '存在两项风险 (7分)' },
  { value: '存在三项风险 (8分)', label: '存在三项风险 (8分)' },
  { value: '存在四项风险 (9分)', label: '存在四项风险 (9分)' },
  { value: '存在五项风险 (10分)', label: '存在五项风险 (10分)' },
  { value: 'custom', label: '其他情况' }, 
];

export const internalConditions = [
  '场地平整',
  '空间宽阔',
  '消防设施齐全',
  '消防通道畅通',
  '机械设备性能良好',
  '临时防护安全有效',
  '临时水电设施安全规范',
  '办公环境安全良好',
  '生活环境安全良好',
  '材料堆放区规划合理',
];

export const managementExperiences = [
  { value: '未从事过类似项目管理 (8分)', label: '未从事过类似项目管理 (8分)' },
  { value: '从事过类似项目管理 1 个 (5分)', label: '从事过类似项目管理 1 个 (5分)' },
  { value: '从事过类似项目管理 2 个 (3分)', label: '从事过类似项目管理 2 个 (3分)' },
  { value: '从事过类似项目管理超过 2 个 (0分)', label: '从事过类似项目管理超过 2 个 (0分)' },
];

export const professionalStructures = [
  { value: '非工程类专业 (2分)', label: '非工程类专业 (2分)' },
  { value: '工程类非对口专业 (1分)', label: '工程类非对口专业 (1分)' },
  { value: '工程类对口专业 (0分)', label: '工程类对口专业 (0分)' },
];

export const educationLevels = [
  { value: '本科以下学历 (2分)', label: '本科以下学历 (2分)' },
  { value: '本科及以上学历 (非地质院校) (1分)', label: '本科及以上学历 (非地质院校) (1分)' },
  { value: '本科及以上学历 (地质院校) (0分)', label: '本科及以上学历 (地质院校) (0分)' },
];

export const subcontractAges = [
  { value: '超过 50 岁 (10分)', label: '超过 50 岁 (10分)' },
  { value: '40 岁~50 岁 (8分)', label: '40 岁~50 岁 (8分)' },
  { value: '30 岁~40 岁 (6分)', label: '30 岁~40 岁 (6分)' },
  { value: '小于 30 岁 (0分)', label: '小于 30 岁 (0分)' },
];

export const subcontractExperiences = [
  { value: '未从事过类似项目 (10分)', label: '未从事过类似项目 (10分)' },
  { value: '从事过类似业绩 1 个 (8分)', label: '从事过类似业绩 1 个 (8分)' },
  { value: '从事过类似业绩 2 个 (6分)', label: '从事过类似业绩 2 个 (6分)' },
  { value: '从事过类似业绩超过 2 个 (0分)', label: '从事过类似业绩超过 2 个 (0分)' },
];

export const subcontractEducationLevels = [
  { value: '初中及以下超过 20% (10 分)', label: '初中及以下超过 20% (10 分)' },
  { value: '初中及以下低于 20% (6 分)', label: '初中及以下低于 20% (6 分)' },
  { value: '全部为初中以上 (0 分)', label: '全部为初中以上 (0 分)' },
];
