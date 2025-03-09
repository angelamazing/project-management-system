/*
 * @Author: Jerry Han angelamazing@163.com
 * @Date: 2024-10-22 15:44:18
 * @LastEditors: Jerry Han angelamazing@163.com
 * @LastEditTime: 2024-11-16 17:12:14
 * @FilePath: \project-management-system\src\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/auth'
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'

// 设置请求头，确保请求体为 JSON 格式


const app = createApp(App)
app.use(router)
app.use(store)
app.use(ElementPlus, {
    locale: zhCn,
  });
app.mount('#app')

