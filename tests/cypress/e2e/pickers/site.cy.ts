import {JContent} from '../../page-object/jcontent';

describe('Picker tests - Site', () => {
    const siteKey = 'digitall';
    let jcontent: JContent;

    before(() => {
        cy.executeGroovy('createSite.groovy', {SITEKEY: 'site1'});
        cy.executeGroovy('createSite.groovy', {SITEKEY: 'site2'});
        cy.executeGroovy('createSite.groovy', {SITEKEY: 'site3'});
    });

    after(() => {
        cy.executeGroovy('deleteSite.groovy', {SITEKEY: 'site1'});
        cy.executeGroovy('deleteSite.groovy', {SITEKEY: 'site2'});
        cy.executeGroovy('deleteSite.groovy', {SITEKEY: 'site3'});
    });

    beforeEach(() => {
        cy.loginAndStoreSession();
        jcontent = JContent.visit(siteKey, 'en', 'content-folders/contents');
    });

    afterEach(() => {
        cy.logout();
    });

    it('Site Picker - base display', () => {
        const contentEditor = jcontent.createContent('Pickers');
        const picker = contentEditor.getPickerField('qant:pickers_sitepicker').open();
        const firstRow = picker.getTable().getRowByIndex(1);
        firstRow.get().find('td').should('have.length', 1);
        picker.assertHasNoTree();
        picker.assertHasNoSiteSwitcher();
        picker.getTable().getRows().should('have.length', 5);
    });

    it('Site Picker - select site', () => {
        const contentEditor = jcontent.createContent('Pickers');
        const pickerField = contentEditor.getPickerField('qant:pickers_sitepicker');
        const picker = pickerField.open();

        picker.getTableRow('site1').click();
        picker.select();
        pickerField.assertValue('site1');
        pickerField.open();
        picker.getTableRow('site1').should('have.class', 'moonstone-TableRow-highlighted');
    });

    it('Site Picker - select site - multiple', () => {
        const contentEditor = jcontent.createContent('Pickers Multiple');
        const pickerField = contentEditor.getPickerField('qant:pickersMultiple_sitepicker', true);
        const picker = pickerField.open();

        const count = 3;
        picker.getTable().selectItems(count);
        cy.get('[data-cm-role="selection-table-collapse-button"] span')
            .should('be.visible').and('contain', `${count} items selected`);
        picker.select();

        contentEditor.getPickerField('qant:pickersMultiple_sitepicker', true).get().scrollIntoView();
        pickerField.assertValue('Digitall');
        pickerField.assertValue('site1');
        pickerField.assertValue('site2');
        pickerField.open();
        picker.getTable().getSelectedRows().should('have.length', 3);
    });
});
