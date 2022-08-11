import { ContentEditor } from '../page-object'

describe('Preview tests', () => {
    const siteKey = 'digitall'
    let contentEditor: ContentEditor
    before(() => {
        cy.login() // edit in chief
        ContentEditor.visit(siteKey, 'en', 'home.html').getPageComposer()
    })

    after(() => {
        cy.logout()
    })

    beforeEach(() => {
        Cypress.Cookies.preserveOnce('JSESSIONID')
        contentEditor = new ContentEditor()
    })

    it('It shows correctly preview of edited page even if not the one currently rendered in PageComposer', () => {
        contentEditor.getPageComposer().editPage('Our Companies')
        contentEditor.switchToAdvancedMode()
        contentEditor.validateContentIsVisibleInPreview('Location and Serenity')
    })
})
