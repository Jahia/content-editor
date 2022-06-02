import { BaseComponent, BasePage, Button, getComponent, getComponentByRole, getElement, MUIInput } from '@jahia/cypress'
import { ContentEditor } from './contentEditor'

export class PageComposer extends BasePage {
    jcontent: ContentEditor

    constructor(jcontent: ContentEditor) {
        super()
        this.jcontent = jcontent
    }

    openCreateContent(): PageComposer {
        cy.iframe('#page-composer-frame').within(() => {
            cy.iframe('.gwt-Frame').within(() => {
                cy.get('.container').contains('Any content').click()
            })
        })
        return this
    }

    refresh() {
        cy.iframe('#page-composer-frame').within(() => {
            cy.get('.window-actions-refresh').click()
        })
        return this
    }

    shouldContain(text: string) {
        cy.iframe('#page-composer-frame').within(() => {
            cy.iframe('.gwt-Frame').within(() => {
                cy.get('.container').should('contain', text)
            })
        })
    }

    getContentTypeSelector(): ContentTypeSelector {
        return getComponent(ContentTypeSelector)
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
