let jestConfig = require('@jahia/test-framework').jestConfig;

module.exports = {
    ...jestConfig,
    setupFilesAfterEnv: [
        '<rootDir>/force-gc'
    ]
};
