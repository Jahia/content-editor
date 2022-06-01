import {
    Accordion,
    BasePage,
    Button,
    Dropdown,
    getComponent,
    getComponentByAttr,
    getComponentByRole,
    SecondaryNav,
    Table,
} from '@jahia/cypress'

export class ContentEditor extends BasePage {
    secondaryNav: SecondaryNav
    accordion: Accordion
    siteSwitcher: Dropdown
    languageSwitcher: Dropdown

    static visit(site: string, language: string, path: string): ContentEditor {
        cy.visit(`/jahia/page-composer/default/${language}/sites/${site}/${path}`)
        return new ContentEditor()
    }

    getSecondaryNav(): SecondaryNav {
        if (!this.secondaryNav) {
            this.secondaryNav = getComponent(SecondaryNav)
        }
        return this.secondaryNav
    }

    getSecondaryNavAccordion(): Accordion {
        if (!this.accordion) {
            this.accordion = getComponent(Accordion, this.getSecondaryNav())
        }
        return this.accordion
    }

    getSiteSwitcher(): Dropdown {
        if (!this.siteSwitcher) {
            this.siteSwitcher = getComponentByAttr(Dropdown, 'data-cm-role', 'site-switcher')
        }
        return this.siteSwitcher
    }

    getLanguageSwitcher(): Dropdown {
        if (!this.languageSwitcher) {
            this.languageSwitcher = getComponentByAttr(Dropdown, 'data-cm-role', 'language-switcher')
        }
        return this.languageSwitcher
    }

    getTable(): Table {
        return getComponent(Table, null, (el) => expect(el).to.be.visible)
    }

    selectAccordion(accordion: string): ContentEditor {
        this.getSecondaryNavAccordion().click(accordion)
        return this
    }

    switchToMode(name: string): ContentEditor {
        getComponentByRole(Button, `sel-view-mode-${name}`).click()
        return this
    }

    switchToGridMode(): ContentEditor {
        this.switchToMode('grid')
        return this
    }

    switchToListMode(): ContentEditor {
        this.switchToMode('list')
        return this
    }

    switchToFlatList(): ContentEditor {
        this.switchToMode('flatList')
        return this
    }

    switchToStructuredView(): ContentEditor {
        this.switchToMode('structuredView')
        return this
    }
}
