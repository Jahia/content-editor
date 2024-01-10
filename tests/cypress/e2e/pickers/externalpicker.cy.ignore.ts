import {JContent} from '../../page-object/jcontent';
import {createSite, deleteSite, Dropdown, enableModule, getComponentByRole} from '@jahia/cypress';

describe('Picker tests', () => {
    let jcontent: JContent;

    before(function () {
        createSite('externalPickerTest', {
            templateSet: 'dx-base-demo-templates',
            serverName: 'localhost',
            locale: 'en'
        });
        enableModule('jcontent-test-module', 'externalPickerTest');
        enableModule('qa-module', 'externalPickerTest');
        cy.loginAndStoreSession(); // Edit in chief
        jcontent = JContent.visit('externalPickerTest', 'en', 'content-folders/contents');
    });

    after(function () {
        deleteSite('externalPickerTest');
    });

    // Tests

    it('should display content reference picker', () => {
        const pickerField = jcontent
            .createContent('Pickers')
            .getPickerField('qant:pickers_filepicker');
        const picker = pickerField.open();
        getComponentByRole(Dropdown, 'picker-selector').select('Custom picker');
        cy.contains('Test picker');
        cy.get('button[data-sel-role="custom-selector"]').click();
        pickerField.assertValue('user.jpg');
    });
});
