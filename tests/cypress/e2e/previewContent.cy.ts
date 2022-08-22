import { PageComposer } from '../page-object/pageComposer'

describe('Preview tests', () => {
    const siteKey = 'digitall'
    let pageComposer: PageComposer
    before(() => {
        cy.login() // edit in chief
        pageComposer = PageComposer.visit(siteKey, 'en', 'home.html')
    })

    after(() => {
        cy.logout()
    })

    beforeEach(() => {
        Cypress.Cookies.preserveOnce('JSESSIONID')
    })

    it('It shows correctly preview of edited page even if not the one currently rendered in PageComposer', () => {
        const contentEditor = pageComposer.editPage('Our Companies')
        contentEditor.switchToAdvancedMode()
        cy.wait(5000)
        contentEditor.validateContentIsVisibleInPreview('Making a Difference')
    })
})
