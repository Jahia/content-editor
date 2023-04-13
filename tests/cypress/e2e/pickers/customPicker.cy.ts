import {contentTypes} from '../../fixtures/pickers/contentTypes';
import {assertUtils} from '../../utils/assertUtils';
import {AccordionItem} from '../../page-object/accordionItem';
import {JContent} from '../../page-object/jcontent';
import gql from 'graphql-tag';

describe('Picker tests - custom picker', {waitForAnimations: true, retries: 3}, () => {
    const siteKey = 'digitall';
    let jcontent: JContent;

    before(() => {
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

    it('should use a custom picker with different root path', () => {
        const picker = jcontent
            .createContent(contentTypes.customPicker.typeName)
            .getPickerField(contentTypes.customPicker.fieldNodeType, contentTypes.customPicker.multiple)
            .open();

        // Assert components are visible
        assertUtils.isVisible(picker.get());
        picker.assertHasNoSiteSwitcher();
        picker.assertHasNoTree();

        picker
            .getTable()
            .getRows()
            .getCellByRole('name')
            .should(elems => {
                expect(elems).to.have.length(5);
                const texts = elems.get().map(e => e.textContent);
                expect(texts.sort()).to.deep.eq(['Goods', 'Healthcare', 'Media', 'Retail', 'Technology']);
            });
    });

    it('should use an override on editorial picker with different root path and constraints', () => {
        const picker = jcontent
            .createContent(contentTypes.pickerWithOverride.typeName)
            .getPickerField(contentTypes.pickerWithOverride.fieldNodeType, contentTypes.pickerWithOverride.multiple)
            .open();

        // Assert components are visible
        assertUtils.isVisible(picker.get());
        assertUtils.isVisible(picker.getSiteSwitcher());
        assertUtils.isVisible(picker.getAccordion());

        cy.log('assert content accordion is visible');
        const contentAccordion: AccordionItem = picker.getAccordionItem('picker-content-folders');
        contentAccordion.click().getHeader()
            .should('be.visible')
            .and('contain', 'My items content-folder')
            .and('have.attr', 'aria-expanded')
            .and('equal', 'true');
        picker.wait();
        picker.navigateTo(contentAccordion, 'ce-picker-custom-contents');

        cy.log('check table components in Structured mode');
        picker.getTable().should('be.visible');
        picker
            .getTable()
            .getRows()
            .getCellByRole('name')
            .should(elems => {
                expect(elems).to.have.length(2);
                const texts = elems.get().map(e => e.textContent);
                expect(texts.sort()).to.deep.eq(['content-folder1', 'test 5']);
            });
    });
});
