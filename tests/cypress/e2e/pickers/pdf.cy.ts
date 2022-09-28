import {JContent} from '../../page-object/jcontent';
import {SecondaryNav} from '@jahia/cypress';

describe('Picker - PDF', () => {
    const siteKey = 'digitall';
    let jcontent: JContent;
    beforeEach(() => {
        // I have issues adding these to before()/after() so have to add to beforeEach()/afterEach()
        cy.login(); // Edit in chief

        // beforeEach()
        jcontent = JContent.visit(siteKey, 'en', 'pages/home/investors/events');
    });

    afterEach(() => {
        cy.logout();
    });

    // Tests
    it('PDF Picker - Only pdf folder display files', () => {
        const contentEditor = jcontent.editComponentByText('CEOs of The Digital Roundtable');
        contentEditor.toggleOption('jdmix:fileAttachment', 'pdfVersion');
        const picker = contentEditor.getPickerField('jdmix:fileAttachment_pdfVersion').open();
        picker.getAccordionItem('picker-media').expandTreeItem('images');
        picker.getAccordionItem('picker-media').getTreeItem('pdf').click();
        picker.verifyResultsLength(2);
        picker.getAccordionItem('picker-media').getTreeItem('backgrounds').click();
        picker.getTable().getRowByLabel('Drag and drop').should('have.length', 1);
    });

    it('PDF Picker - Only pdf files and folder are found by the search', () => {
        const contentEditor = jcontent.editComponentByText('CEOs of The Digital Roundtable');
        contentEditor.toggleOption('jdmix:fileAttachment', 'pdfVersion');
        const picker = contentEditor.getPickerField('jdmix:fileAttachment_pdfVersion').open();
        picker.getAccordionItem('picker-media').expandTreeItem('images');
        picker.getAccordionItem('picker-media').getTreeItem('pdf').click();
        picker.verifyResultsLength(2);
        picker.search('digitall');
        picker.switchSearchContext('Digitall');
        picker.verifyResultsLength(1);
    });
});
