import { BasePage } from '@jahia/cypress'

export class ContentEditor extends BasePage {
    static visit(site: string, language: string, path: string): ContentEditor {
        cy.visit(`/jahia/page-composer/default/${language}/sites/${site}/${path}`)
        return new ContentEditor()
    }

    openContentModal() {
        cy.iframe('#page-composer-frame').within(() => {
            cy.iframe('.gwt-Frame').within(() => {
                cy.get('.container').contains('Any content').click()
            })
        })
    }
}
