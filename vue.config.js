/*
 * @Author: your name
 * @Date: 2024-08-30 21:24:17
 * @LastEditTime: 2024-11-16 16:20:44
 * @LastEditors: Jerry Han angelamazing@163.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \project-management-system\vue.config.js
 */
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  
  transpileDependencies: true,
  productionSourceMap: false,
  configureWebpack: {
    devtool: 'eval-source-map',},

  devServer: {
    proxy: {
        '/api': {
          target: 'http://localhost:3000', // 后端服务地址
          changeOrigin: true,
        },
        '/projectMessages': {
          target: 'http://192.168.6.116:8080', // 后端服务地址
          changeOrigin: true,
        },
      },
    },
  

})

// vue.config.js
module.exports = {
  chainWebpack: (config) => {
    config.plugin('define').tap((definitions) => {
      Object.assign(definitions[0], {
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false',
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      })
      return definitions
    })
  }
}


module.exports = {
  devServer: {
    proxy: 'http://192.168.6.116:8080'
  }
};

