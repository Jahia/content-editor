import { ContentEditor } from '../page-object'

describe('Create content tests', () => {
    let contentEditor: ContentEditor

    before(function () {
        cy.executeGroovy('createSite.groovy', { SITEKEY: 'contentEditorSite' })
        cy.login() // edit in chief
    })

    after(function () {
        cy.logout()
        cy.executeGroovy('deleteSite.groovy', { SITEKEY: 'contentEditorSite' })
    })

    beforeEach(() => {
        Cypress.Cookies.preserveOnce('JSESSIONID')
        contentEditor = new ContentEditor()
    })

    it('Can create content', function () {
        ContentEditor.visit('contentEditorSite', 'en', 'home.html')
    })
})
