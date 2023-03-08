import {PageComposer} from '../page-object/pageComposer';
import {PickerGrid} from '../page-object/pickerGrid';
import {getComponentByRole} from "@jahia/cypress";

const sitekey = 'contentMultiLanguage';
describe('Create multi language content and verify that it is different in all languages', () => {
    let pageComposer: PageComposer;

    before(function () {
        cy.executeGroovy('contentMultiLanguageSite.groovy', {SITEKEY: sitekey});
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
        contentSection.expand();
        contentSection.get().find('input[id="jnt:news_jcr:title"]').type('My news');
        contentSection.get().find('.cke_button__source.cke_button_off').should('be.visible').click();
        contentSection.get().find('textarea').should('have.value', '').type('Multi language test en');
        contentSection.get().find('[data-sel-field-picker-action="openPicker"]').click();
        const picker = getComponentByRole(PickerGrid, 'picker-dialog');
        picker.uploadFile('cypress/fixtures/snowbearHome.jpeg');
        picker.wait(1000);
        picker.select();
        contentEditor.save();
        pageComposer.refresh().shouldContain('Multi language test en');
    })
});
