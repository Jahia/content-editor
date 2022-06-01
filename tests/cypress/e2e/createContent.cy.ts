import { ContentEditor } from '../page-object'

describe('Create content tests', () => {
    let contentEditor: ContentEditor

    before(function () {
        cy.executeGroovy('createSite.groovy', { SITEKEY: 'contentEditorSite' })
        cy.login() // edit in chief
        ContentEditor.visit('contentEditorSite', 'en', 'home.html')
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
        contentEditor.openContentModal()
        cy.get('[data-sel-role="content-type-dialog-input"]').type('Rich text')
        cy.get('[data-sel-role="content-type-tree"]').contains('Rich text').click()
        cy.get('[data-sel-role="content-type-dialog-create"]').click()
        cy.get('#contenteditor-dialog-title').should('be.visible').and('contain', 'Create Rich text')
    })
})
