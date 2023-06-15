import {JContent} from '../page-object/jcontent';

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
        const contentEditor = jcontent.editComponentByText('Events');
        contentEditor.closeSection('Content list & ordering');
    });
});
