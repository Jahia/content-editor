import {JContent} from '../page-object/jcontent';
import {Field, SmallTextField} from '../page-object/fields';
import {Button, Dropdown, getComponentByRole, getComponentBySelector} from '@jahia/cypress';

describe('Content editor form', () => {
    let jcontent: JContent;

    before(function () {
        cy.executeGroovy('createSite.groovy', {SITEKEY: 'contentEditorSite'});
    });

    after(function () {
        cy.logout();
        cy.executeGroovy('deleteSite.groovy', {SITEKEY: 'contentEditorSite'});
    });

    beforeEach(() => {
        cy.loginAndStoreSession();
        jcontent = JContent.visit('contentEditorSite', 'en', 'content-folders/contents');
    });

    it('Should display custom title label and error message', function () {
        const contentEditor = jcontent.createContent('testOverride');
        const field = contentEditor.getField(SmallTextField, 'cent:testOverride_jcr:title', false);
        field.get().find('label').should('contain', 'My title 1234');
        field.get().find('span').should('contain', 'Custom title');
        field.addNewValue('123456789012', true);
        getComponentByRole(Button, 'createButton').click();
        cy.get('[data-sel-role=dialog-errorBeforeSave]').contains('My title 1234');
        getComponentByRole(Button, 'content-type-dialog-cancel').click();
        cy.contains('My constraint message 1234');
    });

    it('Should display overridden title label for boolean buttons', function () {
        const contentEditor = jcontent.createContent('mesiHeaderBanner');
        const field = contentEditor.getField(Field, 'cemix:mesiBannerStory_buttonTransverse', false);
        field.get().find('label').should('contain', 'Contribuer le bouton transverse Header ?');
    });

    it('Should display overridden property in correct section', function () {
        jcontent.createContent('myComponent');
        cy.get('article').contains('myComponent').parents('article').find('div[data-sel-content-editor-field]').should('have.length', 2);
        cy.get('article').contains('categorizedContent').parents('article').find('div[data-sel-content-editor-field]').should('have.length', 2).as('categorizedContentFields');
        cy.get('@categorizedContentFields').first().should('contain.text', 'category');
        cy.get('@categorizedContentFields').last().should('contain.text', 'subcategory');
    });

    it('Should update dependent property "j:subNodesView" in content retrieval when changing "j:type"', () => {
        const contentEditor = jcontent.createContent('contentRetrievalCETest');
        contentEditor.openSection('Layout');
        getComponentBySelector(Dropdown, '[data-sel-content-editor-field="jmix:renderableList_j:subNodesView"]').get().click();
        getComponentBySelector(Dropdown, '[data-sel-content-editor-field="jmix:renderableList_j:subNodesView"]').get().find('.moonstone-menuItem').should('have.length', 1).first().click();
        getComponentBySelector(Dropdown, '[data-sel-content-editor-field="cent:contentRetrievalCETest_j:type"]').select('News entry');
        getComponentBySelector(Dropdown, '[data-sel-content-editor-field="jmix:renderableList_j:subNodesView"]').get().click();
        getComponentBySelector(Dropdown, '[data-sel-content-editor-field="jmix:renderableList_j:subNodesView"]').get().find('.moonstone-menuItem').should('have.length', 13).first().click();
        getComponentBySelector(Dropdown, '[data-sel-content-editor-field="jmix:renderableList_j:subNodesView"]').select('medium');
        getComponentBySelector(Dropdown, '[data-sel-content-editor-field="cent:contentRetrievalCETest_j:type"]').select('Person portrait');
        getComponentBySelector(Dropdown, '[data-sel-content-editor-field="jmix:renderableList_j:subNodesView"]').get().click();
        getComponentBySelector(Dropdown, '[data-sel-content-editor-field="jmix:renderableList_j:subNodesView"]').get().find('.moonstone-menuItem').should('have.length', 6).first().click();
        getComponentBySelector(Dropdown, '[data-sel-content-editor-field="jmix:renderableList_j:subNodesView"]').select('condensed');
        contentEditor.cancelAndDiscard();
    });
});
