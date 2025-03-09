<!--
 * @Author: Jerry House angelamazing@163.com
 * @Date: 2024-11-20 11:23:00
 * @LastEditors: Jerry House angelamazing@163.com
 * @LastEditTime: 2024-12-09 10:17:42
 * @FilePath: \project-management-system\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: Jerry Han angelamazing@163.com
 * @Date: 2024-10-04 16:06:48
 * @LastEditors: Jerry House angelamazing@163.com
 * @LastEditTime: 2024-11-22 14:48:31
 * @FilePath: \project-management-system\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    try {
      // 可以添加一些初始化时的逻辑
      // console.log('应用已挂载');
    } catch (error) {
      console.error('应用挂载时发生错误:', error);
    }
  }
}

//防止ResizeObserver loop
const debounce = (fn, delay) => {
  let timer
   return (...args) => {
     if (timer) {
       clearTimeout(timer)
     }
     timer = setTimeout(() => {
       fn(...args)
     }, delay)
   }
}
  
const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver{
   constructor(callback) {
     callback = debounce(callback, 200);
     super(callback);
   }
}


</script>

<style>
/* 全局样式可以在这里定义 */
</style>
