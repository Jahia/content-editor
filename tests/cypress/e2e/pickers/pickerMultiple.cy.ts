import { contentTypes } from '../../fixtures/pickers/contentTypes'
import { assertUtils } from '../../utils/assertUtils'
import { AccordionItem } from '../../page-object/accordionItem'
import { PageComposer } from '../../page-object/pageComposer'
import { PickerField } from '../../page-object/pickerField'

describe('Picker tests', () => {
    const siteKey = 'digitall'
    let pageComposer: PageComposer

    // helper

    // setup

    beforeEach(() => {
        cy.login()
        pageComposer = PageComposer.visit(siteKey, 'en', 'home.html')
    })

    afterEach(() => {
        cy.logout()
    })

    it('should allow multi-select', () => {
        const contentType = contentTypes['fileMultipleReference']

        const pickerField = pageComposer
            .createContent(contentType.typeName)
            .getPickerField(contentType.fieldNodeType, contentType.multiple)
        const picker = pickerField.open()
        const pagesAccordion: AccordionItem = picker.getAccordionItem('picker-media')
        assertUtils.isVisible(pagesAccordion.getHeader())

        cy.log('navigate to files > images > companies')
        pagesAccordion.expandTreeItem('images')
        pagesAccordion.getTreeItem('companies').click()

        const numRows = 3
        cy.log(`select the first ${numRows} elements`)
        expect(numRows).gte(1) // need at least one for testing removal
        picker.selectItems(numRows)
        picker.select()

        cy.log('verify selected is listed in CE modal/page')
        pickerField
            .get()
            .find('[data-sel-content-editor-multiple-generic-field]')
            .then((elems) => {
                expect(elems.length).eq(numRows)

                cy.log('verify removed element is reflected in selection')
                cy.wrap(elems.eq(0))
                    .find('button[data-sel-action^="removeField"]')
                    .click()
                    .parent()
                    .parent()
                    .find(PickerField.ADD_FIELD_SEL)
                    .click()
                picker.getSelectedRows().then((rows) => expect(rows.length).eq(numRows - 1))
            })
    })

    it('should display selection table', () => {
        const pickerField = pageComposer
            .createContent(contentTypes['fileMultipleReference'].typeName)
            .getPickerField(
                contentTypes['fileMultipleReference'].fieldNodeType,
                contentTypes['fileMultipleReference'].multiple,
            )
        const picker = pickerField.open()

        const mediaAccordion: AccordionItem = picker.getAccordionItem('picker-media')
        assertUtils.isVisible(mediaAccordion.getHeader())
        picker.wait()

        cy.log('verify no selection caption is displayed')
        picker
            .getSelectionCaption()
            .should('be.visible')
            .invoke('attr', 'data-sel-role')
            .should('eq', 'no-item-selected')

        cy.log('navigate to different folders and select one item')
        const numSelected = 3
        picker.navigateTo(mediaAccordion, 'files/images/banners')
        picker.selectItems(1)
        picker.navigateTo(mediaAccordion, 'files/images/companies')
        picker.selectItems(1)
        picker.navigateTo(mediaAccordion, 'files/images/devices')
        picker.selectItems(1)

        cy.log('toggle open selection table')
        picker
            .getSelectionCaption()
            .should('be.visible')
            .click()
            .invoke('attr', 'data-sel-role')
            .should('eq', `${numSelected}-item-selected`)
        picker.getSelectionTable().get().should('be.visible')
        picker
            .getSelectionTable()
            .getRows()
            .get()
            .then((rows) => expect(rows.length).eq(numSelected))

        cy.log('remove selection through selection table')
        picker
            .getSelectionTable()
            .get()
            .find('tr[data-sel-path*="files/images/devices"]')
            .find('[data-cm-role="actions-cell"] button')
            .click({ force: true })
        picker.navigateTo(mediaAccordion, 'files/images/devices')
        picker.getSelectedRows().should('not.exist')

        cy.log('toggle close selection table')
        cy.get('[data-cm-role="selection-table-container"] [data-cm-role="selection-table-collapse-button"]').click()
        picker.getSelectionTable().get().should('not.be.visible')
    })

    it('should select/unselect all', () => {
        const pickerField = pageComposer
            .createContent(contentTypes['fileMultipleReference'].typeName)
            .getPickerField(
                contentTypes['fileMultipleReference'].fieldNodeType,
                contentTypes['fileMultipleReference'].multiple,
            )
        const picker = pickerField.open()

        const mediaAccordion: AccordionItem = picker.getAccordionItem('picker-media')
        assertUtils.isVisible(mediaAccordion.getHeader())

        const path = 'files/images/backgrounds'
        cy.log(`navigate to ${path}`)
        picker.navigateTo(mediaAccordion, path)

        picker
            .getTable()
            .getRows()
            .get()
            .then((elems) => {
                const rowCount = elems.length
                cy.log(`row count: ${rowCount}`)

                cy.log('test "select all"')
                picker.getHeaderById('selection').click()
                picker.getSelectedRows().then((rows) => expect(rows.length).eq(rowCount))

                cy.log('test "unselect all"')
                picker.getHeaderById('selection').click()
                picker.getSelectedRows().should('not.exist')
            })
    })
})