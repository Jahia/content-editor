const jestConfig = require('@jahia/test-framework').jestConfig;

module.exports = {
    ...jestConfig,
    moduleNameMapper: {
        ...jestConfig.moduleNameMapper,
        '~design-system(.*)': '<rootDir>/src/javascript/DesignSystem/$1'
    }
};
