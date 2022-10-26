import {JContent} from '../../page-object/jcontent';

describe('Picker tests - User', () => {
    const siteKey = 'digitall';
    let jcontent: JContent;
    beforeEach(() => {
        // I have issues adding these to before()/after() so have to add to beforeEach()/afterEach()
        cy.login(); // Edit in chief

        // beforeEach()
        jcontent = JContent.visit(siteKey, 'en', 'content-folders/contents');
    });

    afterEach(() => {
        cy.logout();
    });

    // Tests
    it('User Picker - base display', () => {
        const contentEditor = jcontent.createContent('Pickers');
        const picker = contentEditor.getPickerField('qant:pickers_userpicker').open();
        const firstRow = picker.getTable().getRowByIndex(1);
        firstRow.get().find('td').should('have.length', 3);
        firstRow.get().find('td:nth-child(1)').should('contain.text', 'anne');
        firstRow.get().find('td:nth-child(2)').should('contain.text', 'System Site');
        firstRow.get().find('td:nth-child(3)').should('contain.text', 'default');
    });

    it('User Picker - search', () => {
        const contentEditor = jcontent.createContent('Pickers');
        const picker = contentEditor.getPickerField('qant:pickers_userpicker').open();
        picker.search('irina');
        picker.verifyResultsLength(1);
        const firstRow = picker.getTable().getRowByIndex(1);
        firstRow.get().find('td').should('have.length', 3);
        firstRow.get().find('td:nth-child(1)').should('contain.text', 'irina');
        firstRow.get().find('td:nth-child(2)').should('contain.text', 'System Site');
        firstRow.get().find('td:nth-child(3)').should('contain.text', 'default');
    });
});
