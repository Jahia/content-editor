const jestConfig = require('@jahia/test-framework').jestConfig;

module.exports = {
    ...jestConfig,
    modulePathIgnorePatterns: ['<rootDir>/tests']
};
