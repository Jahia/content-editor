import {JContent} from '../../page-object/jcontent';

describe('Picker tests - Constraints', {retries: 3}, () => {
    const siteKey = 'digitall';
    let jcontent: JContent;

    before(() => {
        cy.apollo({
            mutationFile: 'graphql/jcr/mutation/addNode.graphql',
            variables: {
                parentPathOrId: '/sites/digitall/contents',
                name: 'constraintsTest',
                primaryNodeType: 'jnt:contentFolder',
                children: [
                    {
                        name: 'employee1',
                        primaryNodeType: 'qant:employee'
                    },
                    {
                        name: 'employee2',
                        primaryNodeType: 'qant:employee'
                    },
                    {
                        name: 'news1',
                        primaryNodeType: 'jnt:news'
                    }
                ]
            }
        });
    });

    after(() => {
        cy.apollo({
            mutationFile: 'graphql/jcr/mutation/deleteNode.graphql',
            variables: {
                pathOrId: '/sites/digitall/contents/constraintsTest'
            }
        });
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
