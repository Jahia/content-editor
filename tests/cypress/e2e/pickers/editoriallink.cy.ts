import {contentTypes} from '../../fixtures/pickers/contentTypes';
import gql from 'graphql-tag';
import {JContent} from '../../page-object/jcontent';

describe('Picker - Editorial link', {testIsolation: false}, () => {
    const siteKey = 'digitall';
    let jcontent: JContent;

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
        cy.apollo({mutationFile: 'pickers/createMainResources.graphql'});
    };

    const deleteNavText = () => {
        cy.apollo({mutation: gql`
                mutation deleteNavText {
                    jcr {
                        content: deleteNode(pathOrId: "/sites/digitall/home/about/navMenuText")
                        content2: deleteNode(pathOrId: "/sites/digitall/contents/article")
                    }
                }
            `});
    };

    // Setup

    before(() => {
        cy.login();
        createNavText();
        jcontent = JContent.visit(siteKey, 'en', 'content-folders/contents');
    });

    after(() => {
        deleteNavText();
        cy.logout();
    });

    it('should display editorial link picker', () => {
        const contentType = contentTypes.editoriallinkpicker;
        const contentEditor = jcontent.createContent(contentType.typeName);
        const picker = contentEditor
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
                const allTypes = texts.sort().every(content => ['Content Folder', 'Person portrait', 'Article (title and introduction)'].includes(content));
                // eslint-disable-next-line no-unused-expressions
                expect(allTypes).to.be.true;
            });
        picker.cancel();
        contentEditor.cancel();
    });

    it('should expand selection and restore tab', () => {
        const contentType = contentTypes.editoriallinkpicker;
        const contentEditor = jcontent.createContent(contentType.typeName);
        const picker = contentEditor
            .getPickerField(contentType.fieldNodeType, contentType.multiple)
            .open();

        cy.log('select newsroom > news-entry > all organic in pages tab');
        picker.selectTab('pages');
        picker.getTable().getRowByName('newsroom').get().scrollIntoView();
        picker.getTable().getRowByName('newsroom').expand();
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
        picker.cancel();
        contentEditor.cancel();
        cy.get('[data-sel-role="close-dialog-discard"]').click();
    });

    it('can select main resource and sub-main resource', () => {
        const contentType = contentTypes.editoriallinkpicker;
        const contentEditor = jcontent.createContent(contentType.typeName);
        const picker = contentEditor
            .getPickerField(contentType.fieldNodeType, contentType.multiple)
            .open();

        picker.selectTab('content');

        picker.getTable().getRowByName('article').get().scrollIntoView();
        picker.getTable().getRowByName('article').expand();
        picker.getTable().getRowByName('paragraph').should('be.visible').click();
        picker.select();

        contentEditor.cancel();
        cy.get('[data-sel-role="close-dialog-discard"]').click();
    });
});
