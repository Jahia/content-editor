import {JContent} from '../../page-object/jcontent';
import {AccordionItem} from '../../page-object/accordionItem';

describe('Picker - PDF', () => {
    const siteKey = 'digitall';
    let jcontent: JContent;
    beforeEach(() => {
        // I have issues adding these to before()/after() so have to add to beforeEach()/afterEach()
        cy.loginEditor(); // Edit in chief

        // beforeEach()
        jcontent = JContent.visit(siteKey, 'en', 'pages/home/investors/events');
    });

    afterEach(() => {
        cy.logout();
    });

    // Tests
    it('PDF Picker - Only pdf folder display files', () => {
        const contentEditor = jcontent.editComponentByText('CEOs of The Digital Roundtable');
        contentEditor.toggleOption('jdmix:fileAttachment', 'File');
        const picker = contentEditor.getPickerField('jdmix:fileAttachment_pdfVersion').open();
        const pagesAccordion: AccordionItem = picker.getAccordionItem('picker-media');
        pagesAccordion.getHeader().should('be.visible');
        pagesAccordion.expandTreeItem('images');
        pagesAccordion.getTreeItem('pdf').click();
        picker.verifyResultsLength(2);
        picker.getAccordionItem('picker-media').getTreeItem('backgrounds').click();
        picker.assertHasNoTable();
    });

    it('PDF Picker - Only pdf files and folder are found by the search', () => {
        const contentEditor = jcontent.editComponentByText('CEOs of The Digital Roundtable');
        contentEditor.toggleOption('jdmix:fileAttachment', 'pdfVersion');
        const picker = contentEditor.getPickerField('jdmix:fileAttachment_pdfVersion').open();
        picker.get().find('header p').contains('Select a PDF file').should('be.visible');
        const pagesAccordion: AccordionItem = picker.getAccordionItem('picker-media');
        pagesAccordion.getHeader().should('be.visible');

        picker.switchSearchContext('Digitall');
        picker.search('digitall');
        picker.verifyResultsLength(1);
    });
});
