import {JContent} from '../page-object/jcontent';
import {Field, SmallTextField} from '../page-object/fields';
import {Button, Dropdown, getComponentByRole, getComponentBySelector} from '@jahia/cypress';
import gql from 'graphql-tag';

describe('Content editor form', () => {
    let jcontent: JContent;
    const siteKey = 'contentEditorSite';

    before(function () {
        cy.executeGroovy('createSite.groovy', {SITEKEY: siteKey});
    });

    after(function () {
        cy.logout();
        cy.executeGroovy('deleteSite.groovy', {SITEKEY: siteKey});
    });

    beforeEach(() => {
        cy.loginAndStoreSession();
        jcontent = JContent.visit('contentEditorSite', 'en', 'content-folders/contents');
    });

    function setDefaultSiteTemplate(templateName) {
        cy.apollo({
            mutation: gql`
                mutation setDefaultTemplate {
                    jcr {
                        mutateNode(pathOrId:"/sites/${siteKey}") {
                            mutateProperty(name:"j:defaultTemplateName") {
                                setValue(value:"${templateName}")
                            }
                        }
                    }
                }`
        }).should(resp => {
            // eslint-disable-next-line  no-unused-expressions
            expect(resp?.data?.jcr?.mutateNode.mutateProperty.setValue).to.be.true;
        });
    }

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

    it('Should use site default template value', () => {
        const contentTypeName = 'testDefaultTemplate';
        const templateName = 'events';
        const fieldName = 'cent:testDefaultTemplate_j:templateName';

        cy.log('Set default template value for site');
        setDefaultSiteTemplate(templateName);

        cy.log('verify default template is shown in new component');
        const contentEditor = jcontent.createContent(contentTypeName);
        const field = contentEditor.getField(Field, fieldName);
        field.get().find('[role="dropdown"]')
            .should('contain', templateName)
            .and('have.class', 'moonstone-disabled'); // Read-only
        contentEditor.create(); // No errors on create
    });

    it.only('Should display hidden property with overridden hide flag', () => {
        const contentEditor = jcontent.createContent('contentRetrievalCETest');
        const field = contentEditor.getField(SmallTextField, 'cent:contentRetrievalCETest_j:invalidLanguages', true);
        field.addNewValue('fr', true);
        field.addNewValue('de', true);
        contentEditor.create();
        jcontent.editComponentByText('contentRetrievalCETest');
        const fieldEdit = contentEditor.getField(SmallTextField, 'cent:contentRetrievalCETest_j:invalidLanguages', true);
        fieldEdit.checkValues(['fr', 'de']);
    });
});
