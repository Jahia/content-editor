import {JContent} from '../page-object';
import {createSite, deleteSite, Dropdown, getComponentBySelector} from '@jahia/cypress';

// Override defined in jcontent-test-module, forms/cent_choiceListSelectorTypeOverride.json
describe('Choicelist tests', {defaultCommandTimeout: 10000}, () => {
    let jcontent: JContent;

    const siteKey = 'contentEditorSite';

    before(() => {
        createSite(siteKey);
    });

    beforeEach(() => {
        cy.loginEditor();
    });

    after(() => {
        deleteSite(siteKey);
        cy.logout();
    });

    it('should select from basic static choicelist with no default value', () => {
        jcontent = JContent.visit(siteKey, 'en', 'content-folders/contents');
        jcontent.createContent('choiceListSelectorTypeOverride');
        const field: Dropdown = getComponentBySelector(Dropdown, '[data-sel-content-editor-field="cent:choiceListSelectorTypeOverride_noDefaultList"]');
        field.select('choice1');
        field.get().click();
        field.get().find('.moonstone-menuItem').should('have.length', 2);
    });
});
