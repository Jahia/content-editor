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

    it('should display editorial link picker', () => {
        const contentType = contentTypes['editoriallinkpicker']
        const pickerDialog = pageComposer
            .createContent(contentType.typeName)
            .getPickerField(contentType.fieldNodeType, contentType.multiple)
            .open()
        pickerDialog.wait()

        pickerDialog.getSiteSwitcher().should('be.visible')

        cy.log('Verify tabs')
        pickerDialog.getTab('content')
            .should('be.visible')
        pickerDialog.getTab('pages')
            .should('be.visible')
        //     .should('have.class', 'moonstone-selected')

        // select pages; verify types
        cy.log('Verify types in pages tab')
        pickerDialog
            .getTable()
            .getRows()
            .get()
            .find('[data-cm-role="table-content-list-cell-type"]')
            .should((elems) => {
                const texts = elems.get().map((e) => e.textContent)
                const allTypes = texts.sort().every(content => ['Page'].includes(content))
                expect(allTypes).to.be.true
            })

        // select content tab; verify types
        cy.log('Verify types in content tab')
        pickerDialog.getTab('content').click().then(tabItem => {
            pickerDialog.wait()
            cy.wrap(tabItem).should('have.class', 'moonstone-selected')
        })
        pickerDialog
            .getTable()
            .getRows()
            .get()
            .find('[data-cm-role="table-content-list-cell-type"]')
            .should((elems) => {
                const texts = elems.get().map((e) => e.textContent)
                const allTypes = texts.sort().every(content => ['Content Folder', 'Person portrait'].includes(content))
                expect(allTypes).to.be.true
            })
    })
})
