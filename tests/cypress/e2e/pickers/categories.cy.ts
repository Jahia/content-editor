import {JContent} from '../../page-object/jcontent';

describe('Picker - Categories', () => {
    const siteKey = 'digitall';
    let jcontent: JContent;
    beforeEach(() => {
        // I have issues adding these to before()/after() so have to add to beforeEach()/afterEach()
        cy.loginAndStoreSession(); // Edit in chief

        // beforeEach()
        jcontent = JContent.visit(siteKey, 'en', 'content-folders/contents');
    });

    afterEach(() => {
        cy.logout();
    });

    // Tests
    it('Categories Picker - Search for transportation - letter by letter', () => {
        const contentEditor = jcontent.createContent('Pickers');
        const picker = contentEditor.getPickerField('qant:pickers_categorypicker').open();
        picker.search('transportation');
        picker.verifyResultsLength(1);
    });
    it('Categories Picker - Select Polymer Manufacturing', () => {
        const contentEditor = jcontent.createContent('Pickers');
        const picker = contentEditor.getPickerField('qant:pickers_categorypicker').open();
        picker.getTable().getRowByName('105').expand();
        picker.getTableRow('Chemical And Plastic Industry').find('svg');
        picker.getTableRow('Polymer Manufacturing').click();
        picker.getSelectionCaption().should('be.visible').and('contain.text', 'Polymer Manufacturing');
    });
});
