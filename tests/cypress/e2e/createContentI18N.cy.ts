import {PageComposer} from '../page-object/pageComposer';

const sitekey = 'contentEditorSiteI18N';
describe('Create content tests in I18N site', () => {
    let pageComposer: PageComposer;

    before(function () {
        cy.executeGroovy('createSiteI18N.groovy', {SITEKEY: sitekey});
    });

    after(function () {
        cy.logout();
        cy.executeGroovy('deleteSite.groovy', {SITEKEY: sitekey});
    });

    beforeEach(() => {
        cy.loginEditor();
        pageComposer = PageComposer.visit(sitekey, 'en', 'home.html');
    });

    it('Can create content', {retries: 0}, function () {
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
        const contentSection = contentEditor.openSection('Content');
        contentEditor.openSection('Options').get().find('input[type="text"]').clear().type('cypress-test-multiple-1');
        contentSection.expand();
        contentEditor.getRichTextField('jnt:bigText_text').type('Cypress Multiple Content Test 1');
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
        // CKEditor will stay in source mode so no need to click on source again
        contentSection.expand();
        contentEditor.getRichTextField('jnt:bigText_text').getData().should('be.empty');
        contentEditor.getRichTextField('jnt:bigText_text').type('Cypress Multiple Content Test 2');
        contentEditor.removeAnotherContent();
        contentEditor.save();
        pageComposer.refresh().shouldContain('Cypress Multiple Content Test 1');
        pageComposer.shouldContain('Cypress Multiple Content Test 2');
    });

    it('Can create work in progress content for all properties', {retries: 0}, function () {
        const contentEditor = pageComposer
            .openCreateContent()
            .getContentTypeSelector()
            .searchForContentType('Rich Text')
            .selectContentType('Rich text')
            .create();
        cy.get('#contenteditor-dialog-title').should('be.visible').and('contain', 'Create Rich text');
        // Activate Work in progress
        contentEditor.activateWorkInProgressMode('ALL');
        const contentSection = contentEditor.openSection('Content');
        contentEditor.openSection('Options').get().find('input[type="text"]').clear().type('cypress-wip-all-test');
        contentSection.expand().get().find('.cke_button__source').click();
        contentSection.get().find('textarea').should('have.value', '').type('Cypress Work In Progress ALL Test');
        contentEditor.save();
        pageComposer.refresh().shouldContain('Cypress Work In Progress ALL Test');
        pageComposer.shouldContainWIPOverlay();
    });

    it('Can create work in progress content for en/fr properties', {retries: 0}, function () {
        const contentEditor = pageComposer
            .openCreateContent()
            .getContentTypeSelector()
            .searchForContentType('Rich Text')
            .selectContentType('Rich text')
            .create();
        cy.get('#contenteditor-dialog-title').should('be.visible').and('contain', 'Create Rich text');
        // Activate Work in progress
        contentEditor.activateWorkInProgressMode('en,fr');
        const contentSection = contentEditor.openSection('Content');
        contentEditor.openSection('Options').get().find('input[type="text"]').clear().type('cypress-wip-en_fr-test');
        contentSection.expand().get().find('.cke_button__source').click();
        contentSection.get().find('textarea').type('Cypress Work In Progress EN/FR Test');
        // Switch to French
        contentEditor.getLanguageSwitcher().select('Français');
        cy.get('[data-sel-role="wip-info-chip"]', {timeout: 1000}).should('contain', 'WIP - FR');
        cy.focused().frameLoaded('iframe.cke_wysiwyg_frame');
        contentSection.expand().get().find('.cke_button__source').click();
        contentSection.get().find('textarea').should('have.value', '').type('Cypress Work In Progress FR/EN Test');
        contentEditor.save();
        pageComposer.refresh().shouldContain('Cypress Work In Progress EN/FR Test');
        pageComposer.shouldContainWIPOverlay();
        PageComposer.visit(sitekey, 'fr', 'home.html');
        pageComposer.refresh().shouldContain('Cypress Work In Progress FR/EN Test');
        pageComposer.shouldContainWIPOverlay();
    });

    it('keeps "create another" checkbox state when switching languages ', () => {
        const contentEditor = pageComposer
            .openCreateContent()
            .getContentTypeSelector()
            .searchForContentType('Rich Text')
            .selectContentType('Rich text')
            .create();
        cy.get('#contenteditor-dialog-title')
            .should('be.visible')
            .and('contain', 'Create Rich text');

        contentEditor.getLanguageSwitcher().selectLang('English');
        contentEditor.addAnotherContent();
        contentEditor.getLanguageSwitcher().selectLang('Français');
        cy.get('#createAnother').should('have.attr', 'aria-checked', 'true');

        contentEditor.cancel();
    });

    it('Can create a news in en -> fr and then create a new one in en only ', {retries: 0}, function () {
        const contentEditor = pageComposer
            .openCreateContent()
            .getContentTypeSelector()
            .searchForContentType('News entry')
            .selectContentType('News entry')
            .create();
        cy.get('#contenteditor-dialog-title').should('be.visible').and('contain', 'Create News entry');
        const contentSection = contentEditor.openSection('Content');
        contentSection.get().find('#jnt\\:news_jcr\\:title').clear({force: true}).type('Cypress news title', {force: true});
        contentEditor.getRichTextField('jnt:news_desc').type('Cypress news content');
        contentSection.get().find('#jnt\\:news_jcr\\:title').focus().click({force: true});
        // Switch to French
        contentEditor.getLanguageSwitcher().select('Français');
        contentEditor.addAnotherContent();
        contentSection.get().find('#jnt\\:news_jcr\\:title').clear({force: true}).type('Cypress titre actualite', {force: true});
        contentEditor.getRichTextField('jnt:news_desc').type('Cypress contenu actualite');
        contentSection.get().find('#jnt\\:news_jcr\\:title').focus().click({force: true});
        contentEditor.save();
        contentSection.get().find('#jnt\\:news_jcr\\:title').click({force: true}).focus();
        contentEditor.getLanguageSwitcher().select('English');
        cy.get('#contenteditor-dialog-content').should('not.contain.text', 'Invalid form');
        contentSection.get().find('#jnt\\:news_jcr\\:title').clear({force: true}).type('Cypress news title 2', {force: true});
        contentEditor.getRichTextField('jnt:news_desc').type('Cypress news content 2');
        contentSection.get().find('#jnt\\:news_jcr\\:title').focus().click({force: true});
        contentEditor.save();
        contentEditor.getLanguageSwitcher().select('Français');
        cy.get('#contenteditor-dialog-content', {timeout: 1000}).should('not.contain.text', 'Invalid form');
        contentSection.get().find('#jnt\\:news_jcr\\:title').clear({force: true}).type('Cypress titre actualite 3', {force: true});
        contentEditor.save();
        contentEditor.cancelAndDiscard();
        pageComposer.refresh().shouldContain('Cypress news content');
        pageComposer.shouldContain('Cypress news content 2');
    });
});
