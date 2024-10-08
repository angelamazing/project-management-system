/*
 * @Author: your name
 * @Date: 2024-08-30 21:24:17
 * @LastEditTime: 2024-08-30 21:40:34
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \project-management-system\vue.config.js
 */
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  configureWebpack: {
    devtool: 'eval-source-map',}

})
