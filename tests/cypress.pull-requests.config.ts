import {defineConfig} from 'cypress';

export default defineConfig({
    chromeWebSecurity: false,
    defaultCommandTimeout: 10000,
    videoUploadOnPasses: false,
    reporter: 'cypress-multi-reporters',
    reporterOptions: {
        configFile: 'reporter-config.json'
    },
    screenshotsFolder: './results/screenshots',
    videosFolder: './results/videos',
    viewportWidth: 1366,
    viewportHeight: 768,
    trashAssetsBeforeRuns: true,
    watchForFileChanges: false,
    e2e: {
        // We've imported your old cypress plugins here.
        // You may want to clean this up later by importing these.
        setupNodeEvents(on, config) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            return require('./cypress/plugins/index.js')(on, config);
        },
        specPattern: ['**/e2e/createContentI18N.cy.ts',
            '**/e2e/orderableValues.cy.ts',
            '**/e2e/addMixinChoicelistInitializers.cy.ts',
            '**/e2e/pickers/customPicker.cy.ts',
            '**/e2e/pickers/search.cy.ts',
            '**/e2e/pickers/picker*.cy.ts',
            '**/e2e/pickers/constraint.cy.ts'],
        baseUrl: 'http://localhost:8080'
    }
});
