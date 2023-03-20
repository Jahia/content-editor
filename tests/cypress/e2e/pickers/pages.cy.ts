import {JContent} from '../../page-object/jcontent';

describe('Picker - Pages', () => {
    const siteKey = 'digitall';
    let jcontent: JContent;
    beforeEach(() => {
        // I have issues adding these to before()/after() so have to add to beforeEach()/afterEach()
        cy.loginEditor(); // Edit in chief
        cy.apollo({mutationFile: 'pickers/createContent.graphql'});
        // beforeEach()
        jcontent = JContent.visit(siteKey, 'en', 'content-folders/contents');
    });

    afterEach(() => {
        cy.apollo({mutationFile: 'pickers/deleteContent.graphql'});
        cy.logout();
    });

    // Tests
    it('Categories Picker - Search for transportation - letter by letter', () => {
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
