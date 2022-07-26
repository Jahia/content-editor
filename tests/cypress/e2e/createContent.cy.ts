import { ContentEditor } from '../page-object'
import { Button, getComponentByRole } from '@jahia/cypress'

describe('Create content tests', { retries: 10 }, () => {
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
        contentSection.get().find('textarea').should('have.value', '').type('Cypress Test')
        contentEditor.save()
        pageComposer.refresh().shouldContain('Cypress Test')
    })

    it('Can create multiple content in same modal', { retries: 0 }, function () {
        const pageComposer = contentEditor.getPageComposer()
        pageComposer
            .openCreateContent()
            .getContentTypeSelector()
            .searchForContentType('Rich Text')
            .selectContentType('Rich text')
            .create()
        cy.get('#contenteditor-dialog-title').should('be.visible').and('contain', 'Create Rich text')
        let contentSection = contentEditor.openSection('Content')
        contentEditor.openSection('Options').get().find('input[type="text"]').clear().type('cypress-test-multiple-1')
        contentSection.expand().get().find('.cke_button__source').click()
        contentSection.get().find('textarea').should('have.value', '').type('Cypress Multiple Content Test 1')
        contentEditor.addAnotherContent()
        contentEditor.save()
        contentEditor.closeSection('Content')
        contentEditor
            .openSection('Options')
            .get()
            .find('input[type="text"]')
            .should('have.value', 'rich-text')
            .clear()
            .type('cypress-test-multiple-2')
        contentSection = contentEditor.openSection('Content')
        //CKEditor will stay in source mode so no need to click on source again
        contentSection.expand().get().find('.cke_button__source').click()
        contentSection.get().find('textarea').should('have.value', '').type('Cypress Multiple Content Test 2')
        contentEditor.removeAnotherContent()
        contentEditor.save()
        pageComposer.refresh().shouldContain('Cypress Multiple Content Test 1')
        pageComposer.shouldContain('Cypress Multiple Content Test 2')
    })

    it('Can create work in progress content', { retries: 0 }, function () {
        const pageComposer = contentEditor.getPageComposer()
        pageComposer
            .openCreateContent()
            .getContentTypeSelector()
            .searchForContentType('Rich Text')
            .selectContentType('Rich text')
            .create()
        cy.get('#contenteditor-dialog-title').should('be.visible').and('contain', 'Create Rich text')
        // Activate Work in progress
        contentEditor.activateWorkInProgressMode()
        const contentSection = contentEditor.openSection('Content')
        contentEditor.openSection('Options').get().find('input[type="text"]').clear().type('cypress-wip-test')
        contentSection.expand().get().find('.cke_button__source').click()
        contentSection.get().find('textarea').should('have.value', '').type('Cypress Work In Progress Test')
        contentEditor.save()
        pageComposer.refresh().shouldContain('Cypress Work In Progress Test')
        pageComposer.shouldContainWIPOverlay()
    })

    it('Can create a news and edit it from the successful alert', { retries: 0 }, function () {
        const pageComposer = contentEditor.getPageComposer()
        pageComposer
            .openCreateContent()
            .getContentTypeSelector()
            .searchForContentType('News entry')
            .selectContentType('News entry')
            .create()
        cy.get('#contenteditor-dialog-title').should('be.visible').and('contain', 'Create News entry')
        const contentSection = contentEditor.openSection('Content')
        contentSection.get().find('#jnt\\:news_jcr\\:title').clear().type('Cypress news titlez')
        contentSection.expand().get().find('.cke_button__source').click()
        contentSection.get().find('textarea').type('Cypress news content')
        contentEditor.save()
        contentEditor.editSavedContent()
        contentSection
            .get()
            .find('#jnt\\:news_jcr\\:title')
            .should('have.value', 'Cypress news titlez')
            .clear()
            .type('Cypress news title')
        getComponentByRole(Button, 'submitSave').click()
        // getComponentByRole(Button, 'backButton').click()
        pageComposer.refresh().shouldContain('Cypress news title')
    })
})
