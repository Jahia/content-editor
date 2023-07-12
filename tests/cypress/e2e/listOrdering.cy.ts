import {JContent} from '../page-object/jcontent';
import {Collapsible, getComponentBySelector} from '@jahia/cypress';
import {ContentEditor} from '../page-object';

describe('Test list ordering', {retries: 0}, () => {
    const siteKey = 'digitall';
    let jcontent: JContent;
    let contentEditor: ContentEditor;

    beforeEach(() => {
        cy.login(); // Edit in chief
    });

    afterEach(() => {
        cy.logout();
    });

    it('Verifies that list ordering section is available', () => {
        jcontent = JContent.visit(siteKey, 'en', 'pages/home/investors/events');
        jcontent.switchToStructuredView();
        jcontent.editComponentByText('Events');
        getComponentBySelector(Collapsible, '[data-sel-content-editor-fields-group="Content list & ordering"]').get().should('exist');
    });

    it('Activates and deactivates automatic ordering', () => {
        jcontent = JContent.visit(siteKey, 'en', 'pages/home');
        jcontent.switchToStructuredView();
        contentEditor = jcontent.editComponentByText('landing');
        cy.get('p[data-sel-field-picker-name="true"]').should('exist');
        cy.get('input[id="jmix:orderedList"]').click({force: true});
        contentEditor.save();

        contentEditor = jcontent.editComponentByText('landing');
        cy.get('p[data-sel-field-picker-name="true"]').should('not.exist');
        cy.get('div[data-sel-content-editor-field="jmix:orderedList_firstField"]').should('exist');
        cy.get('input[id="jmix:orderedList"]').click({force: true});
        contentEditor.save();

        contentEditor = jcontent.editComponentByText('landing');
        cy.get('p[data-sel-field-picker-name="true"]').should('exist');
    });
});
