// src/components/Form/__tests__/ConstructionTechniques.spec.js
import { mount } from '@vue/test-utils';
import ConstructionTechniques from '../ConstructionTechniques.vue';

describe('ConstructionTechniques.vue', () => {
  let wrapper;
  
  beforeEach(() => {
    wrapper = mount(ConstructionTechniques, {
      props: {
        initialData: {
          constructionType: '',
          disasterItems: [],
          largeDrillingEquipment: '0',
          safetyThreats: []
        }
      }
    });
  });

  it('renders correctly with initial data', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('updates construction type and resets dependent fields', async () => {
    // 模拟选择施工工艺为“钻探类”
    await wrapper.findAll('input[type="radio"]')[1].setChecked();
    
    expect(wrapper.vm.localForm.constructionType).toBe('钻探类');
    expect(wrapper.vm.localForm.largeDrillingEquipment).toBe('0');
    expect(wrapper.vm.localForm.safetyThreats).toEqual([]);

    // 模拟选择“地灾治理和矿山生态修复类”
    await wrapper.findAll('input[type="radio"]')[0].setChecked();
    
    expect(wrapper.vm.localForm.constructionType).toBe('地灾治理和矿山生态修复类');
    expect(wrapper.vm.localForm.disasterItems.length).toBeGreaterThan(0);
  });

  it('calculates the correct score for disasterItems in 地灾治理和矿山生态修复类', async () => {
    // 设置施工工艺为“地灾治理和矿山生态修复类”
    await wrapper.setProps({
      initialData: {
        constructionType: '地灾治理和矿山生态修复类',
        disasterItems: [
          { label: '爆破方量', model: '4', options: [{ label: '0m³＜＜50m³ (4分)', value: '4' }] },
          { label: '清危方量', model: '3', options: [{ label: '1000m³≤＜3000m³ (3分)', value: '3' }] },
        ],
      }
    });

    expect(wrapper.vm.calculateScore()).toBe(7);
  });

  it('calculates the correct score for 钻探类 with threats', async () => {
    // 设置施工工艺为“钻探类”
    await wrapper.setProps({
      initialData: {
        constructionType: '钻探类',
        largeDrillingEquipment: '16',
        safetyThreats: [
          '地上/地下管线安全距离不符合要求 (1分)',
          '作业区域存在滑坡、崩塌、滚石、洪水、危房等安全威胁 (1分)'
        ]
      }
    });

    expect(wrapper.vm.calculateScore()).toBe(18); // 检查是否符合预期的总分
  });

  it('emits updateData with correct values when form is updated', async () => {
    const emitSpy = jest.spyOn(wrapper.vm, '$emit');

    // Debug: Log the HTML to see if radio buttons are rendered
    console.log(wrapper.html());

    const radioButtons = wrapper.findAll('input[type="radio"]');
    expect(radioButtons.length).toBeGreaterThan(0); // Ensure radio buttons are found

    await radioButtons[0].setChecked(); // 设置施工工艺为“地灾治理和矿山生态修复类”
    await wrapper.find('select').setValue('8'); // 设置一个 disasterItems 的值

    expect(emitSpy).toHaveBeenCalledWith('updateData', expect.any(Object)); // 检查是否正确触发更新事件
  });
});
