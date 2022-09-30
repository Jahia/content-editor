import {contentTypes} from '../../fixtures/pickers/contentTypes';
import {PageComposer} from '../../page-object/pageComposer';
import gql from 'graphql-tag';

describe('Picker - Editorial link', () => {
    const siteKey = 'digitall';
    let pageComposer: PageComposer;

    // Helper

    const createNavText = () => {
        // Verify nav text is displayed
        cy.apollo({mutation: gql`
                mutation addNavText {
                    jcr {
                        mutateNode(pathOrId: "/sites/digitall/home/about") {
                            addChild(name: "navMenuText", primaryNodeType: "jnt:navMenuText", properties: [
                                { name: "jcr:title", language: "en", value: "navMenuText" }
                            ]) {uuid}
                        }
                    }
                }
            `});
    };

    const deleteNavText = () => {
        cy.apollo({mutation: gql`
                mutation deleteNavText {
                    jcr {
                        content: deleteNode(pathOrId: "/sites/digitall/home/about/navMenuText")
                    }
                }
            `});
    };

    // Setup

    beforeEach(() => {
        cy.login();
        pageComposer = PageComposer.visit(siteKey, 'en', 'home.html');
        createNavText();
    });

    afterEach(() => {
        deleteNavText();
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
            .and('have.class', 'moonstone-selected'); // Default selected

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
                expect(allTypes).to.contain('Navigation menu - Text (separator)');
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

        picker.selectTab('content'); // Switch tabs
        picker.select();

        cy.log('verify tab is restored and selection is expanded');
        contentEditor.getPickerField(contentType.fieldNodeType, contentType.multiple).open();
        picker.getTab('pages').should('have.class', 'moonstone-selected');
        picker.getTable().getRowByName('all-organic-foods-network-gains').get().scrollIntoView();
        picker.getTable().getRowByName('all-organic-foods-network-gains')
            .should('be.visible') // Expanded
            .and('have.class', 'moonstone-TableRow-highlighted'); // Selected
    });
});
