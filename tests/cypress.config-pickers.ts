import {defineConfig} from 'cypress';
import {baseConfig} from './cypress.config.common';

baseConfig.e2e.specPattern = ['cypress/e2e/pickers/**.cy.ts'];

export default defineConfig(baseConfig);
