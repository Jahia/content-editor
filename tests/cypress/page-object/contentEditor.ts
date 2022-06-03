import {
    BasePage,
    Button,
    Collapsible,
    Dropdown, getComponentByAttr,
    getComponentByRole,
    getComponentBySelector,
    Menu,
} from '@jahia/cypress'
import {PageComposer} from './pageComposer'

export class ContentEditor extends BasePage {
    languageSwitcher: Dropdown

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
            getComponentByRole(Button, '3dotsMenuAction').click()
            getComponentBySelector(Menu, '#menuHolder').selectByRole('goToWorkInProgress')
            cy.get('[data-sel-role="wip-info-chip"]').should('contain', 'Work in progress')
        } else if (language === 'ALL') {
            //Activate all properties
            getComponentByRole(Button, '3dotsMenuAction').click()
            getComponentBySelector(Menu, '#menuHolder').selectByRole('goToWorkInProgress')
            cy.get('[data-sel-role="WIP"]').click()
            cy.get('input[type="radio"]').filter('input[value="ALL_CONTENT"]').click()
            cy.get('.moonstone-button').filter(':contains("Done")').click()
            cy.get('[data-sel-role="wip-info-chip"]').should('contain', 'Work in progress')
        } else {
            //Activate all properties
            getComponentByRole(Button, '3dotsMenuAction').click()
            getComponentBySelector(Menu, '#menuHolder').selectByRole('goToWorkInProgress')
            cy.get('[data-sel-role="WIP"]').click()
            language.split(',').forEach((value) => {
                cy.get('input[type="checkbox"]').check(value)
            })
            cy.get('.moonstone-button').filter(':contains("Done")').click()
            cy.get('[data-sel-role="wip-info-chip"]').should('contain', 'WIP - EN')
        }
    }

    getLanguageSwitcher(): Dropdown {
        if (!this.languageSwitcher) {
            this.languageSwitcher = getComponentByAttr(Dropdown, 'data-cm-role', 'language-switcher')
        }
        return this.languageSwitcher
    }
}
