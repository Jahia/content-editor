import * as fs from 'fs';

export const baseConfig = {
    chromeWebSecurity: false,
    defaultCommandTimeout: 60000,
    pageLoadTimeout: 60000,
    requestTimeout: 60000,
    responseTimeout: 60000,
    videoUploadOnPasses: false,
    reporter: 'cypress-multi-reporters',
    reporterOptions: {
        configFile: 'reporter-config.json'
    },
    screenshotsFolder: './results/screenshots',
    videosFolder: './results/videos',
    viewportWidth: 1366,
    viewportHeight: 768,
    watchForFileChanges: false,
    experimentalMemoryManagement: true,
    numTestsKeptInMemory: 20,
    e2e: {
        specPattern: ['**/**.cy.ts'],
        // We've imported your old cypress plugins here.
        // You may want to clean this up later by importing these.
        setupNodeEvents(on, config) {
            on('task', {
                readFileMaybe(filename) {
                    if (fs.existsSync(filename)) {
                        return fs.readFileSync(filename, 'utf8');
                    }

                    return null;
                }
            });
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            return require('./cypress/plugins/index.js')(on, config);
        },
        excludeSpecPattern: ['**/*.ignore.ts', '**/*performance.cy.ts'],
        baseUrl: 'http://localhost:8080'
    }
};
