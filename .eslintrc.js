/*
 * @Author: Jerry House angelamazing@163.com
 * @Date: 2024-11-21 13:29:55
 * @LastEditors: Jerry House angelamazing@163.com
 * @LastEditTime: 2024-11-21 13:30:00
 * @FilePath: \project-management-system\.eslintrc.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
module.exports = {
    env: {
      browser: true,
      es2021: true,
    },
    extends: [
      'plugin:vue/vue3-essential',
      'eslint:recommended',
    ],
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    plugins: [
      'vue',
    ],
    rules: {
      'no-undef': 'off', // 关闭 no-undef 规则
    },
  };