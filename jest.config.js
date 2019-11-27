const jestConfig = require('@jahia/test-framework').jestConfig;

module.exports = {
    ...jestConfig,
    moduleNameMapper: {
        ...jestConfig.moduleNameMapper,
        '\\.(svg)$': '<rootDir>/node_modules/@jahia/test-framework/build/js/__mocks__/styleMock.js',
        '~/(.*)': '<rootDir>/src/javascript/$1'
    }
};
