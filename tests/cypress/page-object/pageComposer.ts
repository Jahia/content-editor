import { BaseComponent, BasePage, Button, getComponent, getComponentByRole, getElement, MUIInput } from '@jahia/cypress'
import { ContentEditor } from './contentEditor'
import IframeOptions = Cypress.IframeOptions

export class PageComposer extends BasePage {
    jcontent: ContentEditor
    iFrameOptions: IframeOptions
    constructor(jcontent: ContentEditor) {
        super()
        this.jcontent = jcontent
        this.iFrameOptions = { timeout: 90000, log: true }
    }

    openCreateContent(): PageComposer {
        cy.iframe('#page-composer-frame', this.iFrameOptions).within(() => {
            cy.iframe('.gwt-Frame', this.iFrameOptions).within(() => {
                cy.get('.container').contains('Any content').click()
            })
        })
        return this
    }

    refresh() {
        cy.iframe('#page-composer-frame', this.iFrameOptions).within(() => {
            cy.get('.window-actions-refresh').click()
        })
        return this
    }

    shouldContain(text: string) {
        cy.iframe('#page-composer-frame', this.iFrameOptions).within(() => {
            cy.iframe('.gwt-Frame', this.iFrameOptions).within(() => {
                cy.get('.container').should('contain', text)
            })
        })
    }

    componentShouldBeVisible(selector: string) {
        cy.iframe('#page-composer-frame', this.iFrameOptions).within(() => {
            cy.iframe('.gwt-Frame', this.iFrameOptions).within(() => {
                cy.get('.container').find(selector).should('exist').scrollIntoView().should('be.visible')
            })
        })
    }

    getContentTypeSelector(): ContentTypeSelector {
        return getComponent(ContentTypeSelector)
    }

    shouldContainWIPOverlay() {
        cy.iframe('#page-composer-frame', this.iFrameOptions).within(() => {
            cy.iframe('.gwt-Frame', this.iFrameOptions).within(() => {
                cy.get('.workinprogress-overlay').should('contain', 'Work in progress')
            })
        })
    }
}

export class ContentTypeSelector extends BaseComponent {
    static defaultSelector = 'div[aria-labelledby="dialog-createNewContent"]'

    searchInput = getComponentByRole(MUIInput, 'content-type-dialog-input', this)

    searchForContentType(contentType: string): ContentTypeSelector {
        this.searchInput.type(contentType)
        return this
    }

    selectContentType(contentType: string): ContentTypeSelector {
        getElement('[data-sel-role="content-type-tree"] span', this).contains(contentType).click()
        return this
    }

    cancel(): void {
        getComponentByRole(Button, 'content-type-dialog-cancel', this).click()
    }

    create(): void {
        getComponentByRole(Button, 'content-type-dialog-create', this).click()
    }
}
