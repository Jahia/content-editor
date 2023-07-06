import {JContent} from '../../page-object/jcontent';

describe('Picker - Pages', () => {
    const siteKey = 'digitall';
    let jcontent: JContent;
    beforeEach(() => {
        cy.loginAndStoreSession(); // Edit in chief
        cy.apollo({mutationFile: 'pickers/createContent.graphql'});
        jcontent = JContent.visit(siteKey, 'en', 'content-folders/contents');
    });

    afterEach(() => {
        cy.apollo({mutationFile: 'pickers/deleteContent.graphql'});
        cy.logout();
    });

    // Tests
    it('Page Picker - Ensure we can open navMenuItem like navMenuText element and find sub-pages', () => {
        const contentEditor = jcontent.createContent('Pickers');
        const picker = contentEditor.getPickerField('qant:pickers_pagepicker').open();
        picker.getTable().getRowByName('ce-picker-pages').getCellByRole('name').scrollIntoView({
            offset: {
                left: 0,
                top: 25
            }
        }).should('be.visible').find('svg').first().click({force: true});
        picker.getTable().getRowByName('test-page1').get().scrollIntoView({
            offset: {
                left: 0,
                top: 25
            }
        }).should('be.visible');
        picker.search('Page Test 1');
        picker.verifyResultsLength(1);
    });
});
