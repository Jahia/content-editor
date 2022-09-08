import {contentTypes} from '../../fixtures/pickers/contentTypes';
import {PageComposer} from '../../page-object/pageComposer';

describe('Picker - Editorial link', () => {
    const siteKey = 'digitall';
    let pageComposer: PageComposer;

    // Helper

    // setup

    beforeEach(() => {
        cy.login();
        pageComposer = PageComposer.visit(siteKey, 'en', 'home.html');
    });

    afterEach(() => {
        cy.logout();
    });

    it('should display editorial link picker', () => {
        const contentType = contentTypes.editoriallinkpicker;
        const picker = pageComposer
            .createContent(contentType.typeName)
            .getPickerField(contentType.fieldNodeType, contentType.multiple)
            .open();
        picker.wait();

        picker.getSiteSwitcher().should('be.visible');

        cy.log('Verify tabs');
        picker.getTab('content')
            .should('be.visible');
        picker.getTab('pages')
            .should('be.visible')
            .and('have.class', 'moonstone-selected'); // default selected

        // Select pages tab; verify types
        cy.log('Verify content types in pages tab');
        picker
            .getTable()
            .getRows()
            .get()
            .find('[data-cm-role="table-content-list-cell-type"]')
            .should(elems => {
                const texts = elems.get().map(e => e.textContent);
                const allTypes = texts.sort().filter((f, i) => texts.indexOf(f) === i);
                expect(allTypes).to.contain('Page');
                expect(allTypes).to.contain('Company');
                expect(allTypes).to.contain('Person portrait');
            });

        // Select content tab; verify types
        cy.log('Verify content types in content tab');
        picker.selectTab('content');
        picker
            .getTable()
            .getRows()
            .get()
            .find('[data-cm-role="table-content-list-cell-type"]')
            .should(elems => {
                const texts = elems.get().map(e => e.textContent);
                const allTypes = texts.sort().every(content => ['Content Folder', 'Person portrait'].includes(content));
                expect(allTypes).to.be.true;
            });
    });

    it('should expand selection and restore tab', () => {
        const contentType = contentTypes.editoriallinkpicker;
        const contentEditor = pageComposer.createContent(contentType.typeName);
        const picker = contentEditor
            .getPickerField(contentType.fieldNodeType, contentType.multiple)
            .open();

        cy.log('select newsroom > news-entry > all organic in pages tab');
        picker.selectTab('pages');
        picker.getTable().getRowByName('newsroom').get().scrollIntoView();
        picker.getTable().getRowByName('news-entry').expand().should('be.visible');
        picker.getTable().getRowByName('all-organic-foods-network-gains').should('be.visible').click();

        picker.selectTab('content'); // switch tabs
        picker.select();

        cy.log('verify tab is restored and selection is expanded')
        contentEditor.getPickerField(contentType.fieldNodeType, contentType.multiple).open();
        picker.getTab('pages').should('have.class', 'moonstone-selected');
        picker.getTable().getRowByName('all-organic-foods-network-gains').get().scrollIntoView();
        picker.getTable().getRowByName('all-organic-foods-network-gains')
            .should('be.visible') // expanded
            .and('have.class', 'moonstone-TableRow-highlighted') // selected
    })
});
