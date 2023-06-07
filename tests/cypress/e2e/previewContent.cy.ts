import {PageComposer} from '../page-object/pageComposer';
import {addNode, deleteNode} from '@jahia/cypress';

describe('Preview tests', () => {
    const siteKey = 'digitall';
    let pageComposer: PageComposer;

    it('It shows correctly preview of edited page even if not the one currently rendered in PageComposer', () => {
        cy.loginEditor();
        pageComposer = PageComposer.visit(siteKey, 'en', 'home.html');
        const contentEditor = pageComposer.editPage('Our Companies');
        contentEditor.switchToAdvancedMode();
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(5000);
        contentEditor.validateContentIsVisibleInPreview('Making a Difference');
    });

    it('It shows correctly preview of edited page even if the parent node name have special character', () => {
        cy.loginEditor();
        const variables = {
            parentPathOrId: '/sites/' + siteKey + '/home',
            name: 'chocolate,-sweets,-cakes',
            title: 'chocolate,-sweets,-cakes',
            primaryNodeType: 'jnt:page',
            template: 'home',
            properties: [
                {name: 'jcr:title', value: 'chocolate,-sweets,-cakes', language: 'en'},
                {name: 'j:templateName', type: 'STRING', value: 'home'}
            ],
            children: [{
                name: 'area-main',
                primaryNodeType: 'jnt:contentList',
                children: [{
                    name: 'text',
                    primaryNodeType: 'jnt:text',
                    properties: [{language: 'en', name: 'text', type: 'STRING', value: 'This is a simple text'}]
                }]
            }]
        };
        addNode(variables);

        pageComposer = PageComposer.visit(siteKey, 'en', 'home.html');
        pageComposer.navigateToPage('chocolate,-sweets,-cakes');
        const contentEditor = pageComposer.editComponentByText('This is a simple text');

        contentEditor.switchToAdvancedMode();

        contentEditor.validateContentIsVisibleInPreview('This is a simple text');

        deleteNode('/sites/' + siteKey + '/home/chocolate,-sweets,-cakes');
    });
});
