   // jest.config.js
   module.exports = {
    moduleFileExtensions: ['js', 'json', 'vue'],
    transform: {
      '^.+\\.vue$': '@vue/vue3-jest',
      '^.+\\.js$': 'babel-jest',
    },
    testEnvironment: 'jest-environment-jsdom', // 确保使用 jest-environment-jsdom
    moduleNameMapper: {
        "^@vue/test-utils": "<rootDir>/node_modules/@vue/test-utils/dist/vue-test-utils.cjs.js"
      }
  };