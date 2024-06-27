import {ContentEditor, JContent} from '../page-object';
import {BaseComponent, Dropdown, getComponentByRole} from '@jahia/cypress';

describe('Create content tests', () => {
    let jcontent: JContent;

    before(function () {
        cy.apollo({mutationFile: 'usages/createUsages.graphql'});
    });

    after(function () {
        cy.apollo({
            mutationFile: 'usages/jcrDeleteNode.graphql',
            variables: {
                pathOrId: '/sites/digitall/contents/ce-usages-contents'
            }
        });
    });

    beforeEach(() => {
        cy.login();
        jcontent = JContent.visit('digitall', 'en', 'media/files/images/backgrounds');
    });

    afterEach(() => {
        cy.logout();
    });

    it('display 16 usages', () => {
        jcontent.switchToListMode().getTable().getRowByLabel('boy-father.jpg').contextMenu().select('Edit');
        const contentEditor = new ContentEditor();
        const advancedOptions = contentEditor.switchToAdvancedOptions();
        advancedOptions.checkOption('Usages', '16');
        advancedOptions.switchToOption('Usages');
        cy.get('table[data-cm-role="table-usages-list"]').as('usagesTable').should('be.visible');
        cy.get('@usagesTable').find('tbody > tr').should('have.length', 10);
        const usagesPaperComponent = getComponentByRole(BaseComponent, 'usages');
        usagesPaperComponent.get().should('be.visible');
        const pagination = getComponentByRole(Dropdown, 'table-pagination-dropdown-rows-per-page', usagesPaperComponent);
        pagination.select('20');
        cy.get('table[data-cm-role="table-usages-list"]').as('usagesTable2').should('be.visible');
        cy.get('@usagesTable2').find('tbody > tr').should('have.length', 16);
        contentEditor.cancel();
    });
});
