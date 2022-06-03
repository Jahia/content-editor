import {BasePage, Button, Collapsible, getComponentByRole, getComponentBySelector, Menu} from '@jahia/cypress'
import {PageComposer} from './pageComposer'

export class ContentEditor extends BasePage {
    static visit(site: string, language: string, path: string): ContentEditor {
        cy.visit(`/jahia/page-composer/default/${language}/sites/${site}/${path}`)
        return new ContentEditor()
    }

    getPageComposer(): PageComposer {
        return new PageComposer(this)
    }

    openSection(sectionName: string) {
        return getComponentBySelector(Collapsible, `[data-sel-content-editor-fields-group="${sectionName}"]`).expand()
    }

    closeSection(sectionName: string) {
        return getComponentBySelector(Collapsible, `[data-sel-content-editor-fields-group="${sectionName}"]`).collapse()
    }

    save() {
        getComponentByRole(Button, 'createButton').click()
        cy.get('[role="alertdialog"]').should('be.visible').should('contain', 'Content successfully created')
    }

    cancel() {
        getComponentByRole(Button, 'backButton').click()
    }

    addAnotherContent() {
        cy.contains('Create another').click()
    }

    activateWorkInProgressMode(language?: string) {
        if (language === undefined) {
            //Activate all properties
            getComponentByRole(Button, '3dotsMenuAction').click()
            getComponentBySelector(Menu, '#menuHolder').selectByRole('goToWorkInProgress')
        }
    }
}
