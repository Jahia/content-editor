import {JContent} from '../../page-object/jcontent';

describe('Picker tests - Usergroup', () => {
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
    it('Usergroup Picker - Search for admin', () => {
        const contentEditor = jcontent.createContent('Pickers');
        const picker = contentEditor.getPickerField('qant:pickers_usergrouppicker').open();
        picker.search('admin');
        picker.verifyResultsLength(3);
    });
    it('Usergroup Picker - Select administrators', () => {
        const contentEditor = jcontent.createContent('Pickers');
        const picker = contentEditor.getPickerField('qant:pickers_usergrouppicker').open();
        picker.getTableRow('site-administrators').click();
        picker.getSelectionCaption().should('be.visible').and('contain.text', 'site-administrators');
    });
});
