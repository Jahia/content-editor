import {contentTypes} from '../../fixtures/pickers/contentTypes';
import {assertUtils} from '../../utils/assertUtils';
import {JContent} from '../../page-object/jcontent';

describe('Picker tests - Trees', () => {
    const siteKey = 'digitall';
    let jcontent: JContent;

    beforeEach(() => {
        // I have issues adding these to before()/after() so have to add to beforeEach()/afterEach()
        cy.loginAndStoreSession(); // Edit in chief
        cy.apollo({mutationFile: 'pickers/createContent.graphql'});

        // BeforeEach()
        jcontent = JContent.visit(siteKey, 'en', 'content-folders/contents');
    });

    afterEach(() => {
        cy.apollo({mutationFile: 'pickers/deleteContent.graphql'});
        cy.logout();
    });

    // Tests

    it('should display a folder picker without tree', () => {
        const pickerField = jcontent
            .createContent(contentTypes.folderpicker.typeName)
            .getPickerField(contentTypes.folderpicker.fieldNodeType, contentTypes.folderpicker.multiple);
        const picker = pickerField.open();

        // Assert components are visible
        assertUtils.isVisible(picker.get());
        assertUtils.isVisible(picker.getSiteSwitcher());
        picker.assertHasNoTree();
    });

    it('should display root folder opened', () => {
        const pickerField = jcontent
            .createContent(contentTypes.folderpicker.typeName)
            .getPickerField(contentTypes.folderpicker.fieldNodeType, contentTypes.folderpicker.multiple);
        const picker = pickerField.open();

        picker.getTable().getRowByIndex(1).get().find('span').first().should('contain', 'files');

        picker.getTable().getRowByIndex(2).get().find('span').first().should('contain', 'ce-picker-files');
    });

    it('should be able to open and close folder', () => {
        const pickerField = jcontent
            .createContent(contentTypes.folderpicker.typeName)
            .getPickerField(contentTypes.folderpicker.fieldNodeType, contentTypes.folderpicker.multiple);
        const picker = pickerField.open();

        picker.getTable().getRowByIndex(1).get().find('svg').first().click();

        picker.getTable().getRows(el => expect(el).to.have.length(1));

        picker.getTable().getRowByIndex(1).get().find('svg').first().click();

        picker.getTable().getRows(el => expect(el).to.have.length.of.at.least(2));
    });

    it('should be able to select a folder', () => {
        const pickerField = jcontent
            .createContent(contentTypes.folderpicker.typeName)
            .getPickerField(contentTypes.folderpicker.fieldNodeType, contentTypes.folderpicker.multiple);
        let picker = pickerField.open();

        picker.getTable().getRowByIndex(2).get().find('span').first().should('contain', 'ce-picker-files').click();

        picker.select();
        pickerField.assertValue('ce-picker-files');
        picker = pickerField.open();
        picker.getTableRow('ce-picker-files').should('have.class', 'moonstone-TableRow-highlighted');
    });

    it('should be able to switch site', () => {
        const pickerField = jcontent
            .createContent(contentTypes.folderpicker.typeName)
            .getPickerField(contentTypes.folderpicker.fieldNodeType, contentTypes.folderpicker.multiple);
        const picker = pickerField.open();

        picker.getTable().getRowByIndex(2).get().find('span').first().should('contain', 'ce-picker-files').click();
        picker.getSiteSwitcher().should('contain', 'Digitall');
        picker.switchToSite('System Site');
        picker.getSiteSwitcher().should('contain', 'System Site');
        picker.getTable().getRows(el => expect(el).to.have.length(1));
        picker.switchToSite('Digitall');
        picker.getTableRow('ce-picker-files').should('have.class', 'moonstone-TableRow-highlighted');
    });
});
