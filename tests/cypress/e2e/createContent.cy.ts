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

    it('Can create content', { retries: 0 }, function () {
        const pageComposer = contentEditor.getPageComposer()
        pageComposer
            .openCreateContent()
            .getContentTypeSelector()
            .searchForContentType('Rich Text')
            .selectContentType('Rich text')
            .create()
        cy.get('#contenteditor-dialog-title').should('be.visible').and('contain', 'Create Rich text')
        const contentSection = contentEditor.openSection('Content')
        contentEditor.openSection('Options').get().find('input[type="text"]').clear().type('cypress-test')
        contentSection.expand().get().find('.cke_button__source').click()
        contentSection.get().find('textarea').type('Cypress Test')
        contentEditor.save()
        pageComposer.refresh().shouldContain('Cypress Test')
    })
})
