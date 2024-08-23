import {JContent} from '../../page-object';
import {addNode, deleteNode} from '@jahia/cypress';

describe('Picker tests - Constraints', {retries: 3}, () => {
    const siteKey = 'digitall';
    let jcontent: JContent;

    before(() => {
        addNode({
            parentPathOrId: `/sites/${siteKey}/contents`,
            name: 'constraintsTest',
            primaryNodeType: 'jnt:contentFolder',
            children: [
                {name: 'employee1', primaryNodeType: 'qant:employee'},
                {name: 'employee2', primaryNodeType: 'qant:employee'},
                {name: 'news1', primaryNodeType: 'jnt:news'}
            ]
        });
    });

    after(() => {
        deleteNode(`/sites/${siteKey}/contents/constraintsTest`);
    });

    beforeEach(() => {
        cy.login();
        jcontent = JContent.visit(siteKey, 'en', 'content-folders/contents');
    });

    afterEach(() => {
        cy.logout();
    });

    it('should see one employee', () => {
        const contentEditor = jcontent.createContent('employee');
        const pickerField = contentEditor.getPickerField('qant:employee_supervisor');
        const picker = pickerField.open();
        picker.wait();
        const accordionItem = picker.getAccordionItem('picker-content-folders');
        accordionItem.click();
        picker.wait();
        picker.navigateTo(accordionItem, 'contents/constraintsTest');
        picker.getTable().getRows().should('have.length', 2);
        picker.getTable().getRows().get().contains('employee1').click();
        picker.getTable().getRows().get().contains('news1').should('not.exist');
        picker.select();
        pickerField.assertValue('employee1');
    });
});
