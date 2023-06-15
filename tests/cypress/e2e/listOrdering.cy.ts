import {JContent} from '../page-object/jcontent';
import {Collapsible, getComponentBySelector} from '@jahia/cypress';

describe('Test list ordering', {retries: 0}, () => {
    const siteKey = 'digitall';
    let jcontent: JContent;

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
});
