import {PageComposer} from '../page-object/pageComposer';

const sitekey = 'contentMultiLanguage';
describe('Create multi language content and verify that it is different in all languages', () => {
    let pageComposer: PageComposer;

    before(function () {
        cy.executeGroovy('createSiteI18N.groovy', {SITEKEY: sitekey});
        cy.wait(10000)
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
            .searchForContentType('News entry')
            .selectContentType('News entry')
            .create();
        cy.get('#contenteditor-dialog-title').should('be.visible').and('contain', 'Create News entry');
        const contentSection = contentEditor.openSection('Content');
        contentSection.expand().get().find('.cke_button__source').click();
        contentSection.get().find('textarea').should('have.value', '').type('Multi language test en');
        contentEditor.save();
        pageComposer.refresh().shouldContain('Multi language test en');
    })
});
