import { ContentEditor } from '../page-object'

const sitekey = 'contentEditorSiteAddMixin'
describe('Add Mixin by using choice list initializers (Image Reference)', () => {
    let contentEditor: ContentEditor

    before(function () {
        cy.executeGroovy('createSiteI18N.groovy', { SITEKEY: sitekey })
        cy.login() // edit in chief
        ContentEditor.visitJContentMedia(sitekey, 'en')
        cy.wait(5000)
        cy.get('div[data-cm-role="grid-content-list"]')
            .children('div[mode="media"]')
            .selectFile('cypress/fixtures/snowbearHome.jpeg', {
                action: 'drag-drop',
                waitForAnimations: true,
            })
        ContentEditor.visit(sitekey, 'en', 'home.html')
    })

    after(function () {
        cy.logout()
        cy.executeGroovy('deleteSite.groovy', { SITEKEY: sitekey })
    })

    beforeEach(() => {
        Cypress.Cookies.preserveOnce('JSESSIONID')
        contentEditor = new ContentEditor()
    })

    it('Can create a document manager image reference link', () => {
        const pageComposer = contentEditor.getPageComposer()
        pageComposer
            .openCreateContent()
            .getContentTypeSelector()
            .searchForContentType('Document Manager')
            .selectContentType('Document Manager')
            .create()
        cy.get('#contenteditor-dialog-title')
            .should('be.visible')
            .and('contain', 'Create Image (from the Document Manager)')
        cy.get('#select-jnt\\:imageReferenceLink_j\\:linkType')
            .click()
            .find('li[role="option"][data-value="internal"]')
            .click()
        cy.get('[data-sel-content-editor-field="jmix\\:internalLink_j\\:linknode"]')
            .scrollIntoView()
            .should('be.visible')
        contentEditor.getLanguageSwitcher().select('Français')
        cy.get('[data-sel-content-editor-field="jmix\\:internalLink_j\\:linknode"]')
            .as('fr_internal_link')
            .scrollIntoView()
            .should('be.visible')
        cy.get('#select-jnt\\:imageReferenceLink_j\\:linkType')
            .click()
            .find('li[role="option"][data-value="external"]')
            .click()
        cy.get('@fr_internal_link').should('not.exist')
        cy.get('[data-sel-content-editor-field="jmix\\:externalLink_j\\:linkTitle"]')
            .scrollIntoView()
            .should('be.visible')
        cy.get('[data-sel-content-editor-field="jmix\\:externalLink_j\\:url"]').scrollIntoView().should('be.visible')
        contentEditor.getLanguageSwitcher().select('Deutsch')
        cy.get('[data-sel-content-editor-field="jmix\\:internalLink_j\\:linknode"]').should('not.exist')
        cy.get('[data-sel-content-editor-field="jmix\\:externalLink_j\\:linkTitle"]')
            .scrollIntoView()
            .should('be.visible')
        cy.get('[data-sel-content-editor-field="jmix\\:externalLink_j\\:url"]')
            .as('de_external_link_url')
            .scrollIntoView()
            .should('be.visible')
        cy.get('#select-jnt\\:imageReferenceLink_j\\:linkType')
            .click()
            .find('li[role="option"][data-value="none"]')
            .click()
        cy.get('@de_external_link_url').should('not.exist')
        contentEditor.getLanguageSwitcher().select('English')
        cy.get('#select-jnt\\:imageReferenceLink_j\\:linkType')
            .click()
            .find('li[role="option"][data-value="internal"]')
            .click()
        cy.get('[data-sel-content-editor-field="jmix\\:internalLink_j\\:linknode"]')
            .scrollIntoView()
            .should('be.visible')
            .click()
        cy.get('tr[role="checkbox"]').contains('Home').click()
        cy.get('button[data-sel-picker-dialog-action="done"]').click()
        cy.get('[data-sel-content-editor-field="mix\\:title_jcr\\:title"]')
            .scrollIntoView()
            .should('be.visible')
            .type('Cypress document manager image reference link Test')
        cy.get('[data-sel-content-editor-field="jnt\\:imageReferenceLink_j\\:node"]')
            .scrollIntoView()
            .should('be.visible')
            .click()
        cy.get('[data-sel-role-card="snowbearHome.jpeg"]').should('exist').scrollIntoView().should('be.visible').click()
        cy.get('button[data-sel-picker-dialog-action="done"]').click()
        contentEditor.save()
        pageComposer
            .refresh()
            .componentShouldBeVisible(
                `a[href*="/sites/${sitekey}/home.html"] > img[src*="/sites/${sitekey}/files/snowbearHome.jpeg"]`,
            )
    })
})
