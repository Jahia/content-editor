import {contentTypes} from '../../fixtures/pickers/contentTypes';
import {assertUtils} from '../../utils/assertUtils';
import {AccordionItem} from '../../page-object/accordionItem';
import {JContent} from '../../page-object/jcontent';
import gql from 'graphql-tag';

describe('Picker tests - custom picker', {waitForAnimations: true}, () => {
    const siteKey = 'digitall';
    let jcontent: JContent;

    before(() => {
        // I have issues adding these to before()/after() so have to add to beforeEach()/afterEach()
        cy.login(); // Edit in chief
        cy.apollo({mutationFile: 'pickers/createCustomContent.graphql'});

    });

    after(() => {
        cy.apollo({mutation: gql`
            mutation deleteContent {
                jcr {
                    content: deleteNode(pathOrId: "/sites/digitall/contents/ce-picker-custom-contents")
                }
            }
            `});
        cy.logout();
    });

    beforeEach(() => {
        cy.login(); // Edit in chief
        // BeforeEach()
        jcontent = JContent.visit(siteKey, 'en', 'content-folders/contents');
    });

    afterEach(() => {
        cy.logout();
    });

    // Tests

    it('should display qant:location items in List table', () => {
        const picker = jcontent
            .createContent(contentTypes.customPicker.typeName)
            .getPickerField(contentTypes.customPicker.fieldNodeType, contentTypes.customPicker.multiple)
            .open();


        // Assert components are visible
        assertUtils.isVisible(picker.get());
        assertUtils.isVisible(picker.getSiteSwitcher());
        assertUtils.isVisible(picker.getAccordion());

        cy.log('assert content accordion is visible');
        const contentAccordion: AccordionItem = picker.getAccordionItem('picker-content-folders');
        contentAccordion.click().getHeader()
            .should('be.visible')
            .and('have.attr', 'aria-expanded')
            .and('equal', 'true');
        picker.wait();
        picker.navigateTo(contentAccordion, 'contents/ce-picker-custom-contents');

        cy.log('check table components in List mode');
        picker.switchViewMode('List');
        picker.getTable().should('be.visible');
        picker
            .getTable()
            .getRows()
            .getCellByRole('name')
            .should(elems => {
                expect(elems).to.have.length(4);
                const texts = elems.get().map(e => e.textContent);
                expect(texts.sort()).to.deep.eq(['content-folder1', 'loc 1', 'loc 2', 'loc 3']);
            });
    });

    it('should display qant:location items in Structured table', () => {
        const picker = jcontent
            .createContent(contentTypes.customPicker.typeName)
            .getPickerField(contentTypes.customPicker.fieldNodeType, contentTypes.customPicker.multiple)
            .open();

        // Assert components are visible
        assertUtils.isVisible(picker.get());
        assertUtils.isVisible(picker.getSiteSwitcher());
        assertUtils.isVisible(picker.getAccordion());

        cy.log('assert content accordion is visible');
        const contentAccordion: AccordionItem = picker.getAccordionItem('picker-content-folders');
        contentAccordion.click().getHeader()
            .should('be.visible')
            .and('have.attr', 'aria-expanded')
            .and('equal', 'true');
        picker.wait();
        picker.navigateTo(contentAccordion, 'contents/ce-picker-custom-contents');

        cy.log('check table components in Structured mode');
        picker.switchViewMode('Structured');
        picker.getTable().should('be.visible');
        picker
            .getTable()
            .getRows()
            .getCellByRole('name')
            .should(elems => {
                expect(elems).to.have.length(4);
                const texts = elems.get().map(e => e.textContent);
                expect(texts.sort()).to.deep.eq(['content-folder1', 'loc 1', 'loc 2', 'loc 3']);
            });
    });
});
