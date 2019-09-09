const jestConfig = require('@jahia/test-framework').jestConfig;

module.exports = {
    ...jestConfig,
    moduleNameMapper: {
        ...jestConfig.moduleNameMapper,
        '~DesignSystem(.*)': '<rootDir>/src/javascript/DesignSystem$1',
        '~Create(.*)': '<rootDir>/src/javascript/Create$1',
        '~Edit(.*)': '<rootDir>/src/javascript/Edit$1'
    }
};
