import {contentTypes} from '../../fixtures/pickers/contentTypes';
import {assertUtils} from '../../utils/assertUtils';
import {AccordionItem} from '../../page-object/accordionItem';
import {JContent} from '../../page-object/jcontent';
import gql from 'graphql-tag';

describe('Picker tests - Display actions', () => {
    const siteKey = 'digitall';
    let jcontent: JContent;

    beforeEach(() => {
        // I have issues adding these to before()/after() so have to add to beforeEach()/afterEach()
        cy.login(); // Edit in chief
        cy.apollo({mutationFile: 'pickers/createCustomContent.graphql'});

        // BeforeEach()
        jcontent = JContent.visit(siteKey, 'en', 'content-folders/contents');
    });

    afterEach(() => {
        cy.apollo({mutation: gql`
                mutation deleteContent {
                    jcr {
                        content: deleteNode(pathOrId: "/sites/digitall/contents/ce-picker-custom-contents")
                    }
                }
            `});
        cy.logout();
    });

    // Tests

    it('should refresh picker dialog', () => {
        const picker = jcontent
            .createContent(contentTypes.customPicker.typeName)
            .getPickerField(contentTypes.customPicker.fieldNodeType, contentTypes.customPicker.multiple)
            .open();

        // Assert components are visible
        assertUtils.isVisible(picker.get());
        assertUtils.isVisible(picker.getSiteSwitcher());
        assertUtils.isVisible(picker.getAccordion());

        cy.log('select a component');
        const contentAccordion: AccordionItem = picker.getAccordionItem('picker-content-folders');
        contentAccordion.click().getHeader()
            .should('be.visible')
            .and('have.attr', 'aria-expanded')
            .and('equal', 'true');
        contentAccordion.getTreeItem('ce-picker-custom-contents').click();
        contentAccordion.expandTreeItem('ce-picker-custom-contents');
        picker.getTable().getRowByName('test-loc1').get().should('be.visible').click();

        cy.log('add components in the background');
        cy.apollo({mutation: gql`
                mutation addContent {
                    jcr {
                        addFolder: mutateNode(pathOrId: "/sites/digitall/contents") {
                            addChild(name: "refresh1", primaryNodeType: "jnt:contentFolder") {uuid}
                        }
                        addContent: mutateNode(pathOrId: "/sites/digitall/contents/ce-picker-custom-contents") {
                            addChild(name: "refresh2", primaryNodeType: "qant:location", properties: [
                                { name: "jcr:title", language: "en", value: "refresh2" }
                            ]) {uuid}
                        }
                    }
                }
            `});

        cy.log('assert refresh works for nav tree and table and does not change selection on both');
        picker.getRefreshButton().click();
        picker.wait();
        contentAccordion.getTreeItem('ce-picker-custom-contents')
            .find('div').should('have.class', 'moonstone-selected');
        contentAccordion.getTreeItem('refresh1').should('be.visible');
        picker.getTable().getRowByName('refresh2').should('be.visible');
        picker.getTable().getRowByName('test-loc1')
            .should('be.visible') // Expanded
            .and('have.class', 'moonstone-TableRow-highlighted'); // Selected

        cy.apollo({mutation: gql`
                mutation deleteContent {
                    jcr {folder: deleteNode(pathOrId: "/sites/digitall/contents/refresh1")}
                }
            `});
    });
});
