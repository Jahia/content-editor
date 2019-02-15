module.exports = {
    moduleNameMapper: {
        '@jahia/(.*)': '<rootDir>/node_modules/@jahia/$1/lib/$1.umd.js'
    },
    setupFilesAfterEnv: [
        '<rootDir>/src/javascript/setupTests.js'
    ],
    testPathIgnorePatterns: [
        '<rootDir>/main/resources/javascript/',
        '<rootDir>/node/',
        '<rootDir>/node_modules/',
        '<rootDir>/target/'
    ],
    verbose: true
};
