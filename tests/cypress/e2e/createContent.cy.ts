import {Button, getComponentByRole} from '@jahia/cypress';
import {PageComposer} from '../page-object/pageComposer';

describe('Create content tests', {retries: 10}, () => {
    let pageComposer: PageComposer;

    before(function () {
        cy.executeGroovy('createSite.groovy', {SITEKEY: 'contentEditorSite'});
        cy.login(); // Edit in chief
        pageComposer = PageComposer.visit('contentEditorSite', 'en', 'home.html');
    });

    after(function () {
        cy.logout();
        cy.executeGroovy('deleteSite.groovy', {SITEKEY: 'contentEditorSite'});
    });

    beforeEach(() => {
        Cypress.Cookies.preserveOnce('JSESSIONID');
    });

    it('Can create content', function () {
        const contentEditor = pageComposer
            .openCreateContent()
            .getContentTypeSelector()
            .searchForContentType('Rich Text')
            .selectContentType('Rich text')
            .create();
        cy.get('#contenteditor-dialog-title').should('be.visible').and('contain', 'Create Rich text');
        const contentSection = contentEditor.openSection('Content');
        contentEditor.openSection('Options').get().find('input[type="text"]').clear().type('cypress-test');
        contentSection.expand().get().find('.cke_button__source').click();
        contentSection.get().find('textarea').should('have.value', '').type('Cypress Test');
        contentEditor.save();
        pageComposer.refresh().shouldContain('Cypress Test');
    });

    it('Can create multiple content in same modal', {retries: 0}, function () {
        const contentEditor = pageComposer
            .openCreateContent()
            .getContentTypeSelector()
            .searchForContentType('Rich Text')
            .selectContentType('Rich text')
            .create();
        cy.get('#contenteditor-dialog-title').should('be.visible').and('contain', 'Create Rich text');
        let contentSection = contentEditor.openSection('Content');
        contentEditor.openSection('Options').get().find('input[type="text"]').clear().type('cypress-test-multiple-1');
        contentSection.expand().get().find('.cke_button__source').click();
        contentSection.get().find('textarea').should('have.value', '').type('Cypress Multiple Content Test 1');
        contentEditor.addAnotherContent();
        contentEditor.save();
        contentEditor.closeSection('Content');
        contentEditor
            .openSection('Options')
            .get()
            .find('input[type="text"]')
            .should('have.value', 'rich-text')
            .clear()
            .type('cypress-test-multiple-2');
        contentSection = contentEditor.openSection('Content');
        // CKEditor will stay in source mode so no need to click on source again
        contentSection.expand().get().find('.cke_button__source').click();
        contentSection.get().find('textarea').should('have.value', '').type('Cypress Multiple Content Test 2');
        contentEditor.removeAnotherContent();
        contentEditor.save();
        pageComposer.refresh().shouldContain('Cypress Multiple Content Test 1');
        pageComposer.shouldContain('Cypress Multiple Content Test 2');
    });

    it('Can create work in progress content', {retries: 0}, function () {
        const contentEditor = pageComposer
            .openCreateContent()
            .getContentTypeSelector()
            .searchForContentType('Rich Text')
            .selectContentType('Rich text')
            .create();
        cy.get('#contenteditor-dialog-title').should('be.visible').and('contain', 'Create Rich text');
        // Activate Work in progress
        contentEditor.activateWorkInProgressMode();
        const contentSection = contentEditor.openSection('Content');
        contentEditor.openSection('Options').get().find('input[type="text"]').clear().type('cypress-wip-test');
        contentSection.expand().get().find('.cke_button__source').click();
        contentSection.get().find('textarea').should('have.value', '').type('Cypress Work In Progress Test');
        contentEditor.save();
        pageComposer.refresh().shouldContain('Cypress Work In Progress Test');
        pageComposer.shouldContainWIPOverlay();
    });

    it('Can create a news and edit it from the successful alert', {retries: 0}, function () {
        const contentEditor = pageComposer
            .openCreateContent()
            .getContentTypeSelector()
            .searchForContentType('News entry')
            .selectContentType('News entry')
            .create();
        cy.get('#contenteditor-dialog-title').should('be.visible').and('contain', 'Create News entry');
        const contentSection = contentEditor.openSection('Content');
        contentSection.get().find('#jnt\\:news_jcr\\:title').clear({force: true}).type('Cypress news titlez', {force: true});
        contentSection.expand().get().find('.cke_button__source').click();
        contentSection.get().find('textarea').type('Cypress news content');
        contentEditor.save();
        contentEditor.editSavedContent();
        contentSection
            .get()
            .find('#jnt\\:news_jcr\\:title')
            .should('have.value', 'Cypress news titlez')
            .clear({force: true})
            .type('Cypress news title', {force: true});
        getComponentByRole(Button, 'submitSave').click();
        // GetComponentByRole(Button, 'backButton').click()
        pageComposer.refresh().shouldContain('Cypress news title');
    });
});
