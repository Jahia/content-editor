import { contentTypes } from '../../fixtures/pickers/contentTypes'
import { Picker } from '../../page-object/picker'
import { assertUtils } from '../../utils/assertUtils'
import { AccordionItem } from '../../page-object/accordionItem'
import { ContentEditor } from '../../page-object'

describe('Picker tests', () => {
    const siteKey = 'digitall'
    let picker: Picker

    // helper

    // setup

    before (() => {
    })

    after(() => {
        cy.logout()
    })

    beforeEach(() => {
        cy.login()
        const pageComposer = ContentEditor.visit(siteKey, 'en', 'home.html').getPageComposer()
        picker = new Picker(pageComposer)
    })

    afterEach(() => {
    })

    // tests

    it('should display content reference picker', () => {
        const pickerDialog = picker.open(contentTypes['fileMultipleReference'])

    })

})
