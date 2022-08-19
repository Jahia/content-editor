import {
    Accordion,
    BaseComponent,
    Button,
    Dropdown,
    getComponent,
    getComponentByAttr,
    getComponentByRole,
    getComponentBySelector,
    SecondaryNav,
    Table,
} from '@jahia/cypress'
import { PageComposer } from './pageComposer'
import { ContentType } from '../fixtures/pickers/contentTypes'
import { AccordionItem } from './accordionItem'

export class Picker extends BaseComponent {
    pageComposer: PageComposer
    siteSwitcher: Dropdown

    secondaryNav: SecondaryNav
    accordion: Accordion
    table: Table
    selectionTable: Table

    // /*
    //  * Open picker by adding content type for a selected field
    //  * @param contentTypeKey key as defined in fixtures/pickers/contentTypes definition
    //  */
    // open(contentType: ContentType) {
    //     this.pageComposer.createContent(contentType.typeName)
    //     const parent = this.getField(contentType.fieldNodeType)
    //     const buttonSelector = contentType.multiple ? Picker.ADD_FIELD_SEL : 'button'
    //     parent.get().find(buttonSelector).click()
    //     this.pickerDialog = getComponentByRole(BaseComponent, 'picker-dialog')
    //     return this
    // }
    //
    // getField(fieldNodeType: string) {
    //     return getComponentByAttr(BaseComponent, 'data-sel-content-editor-field', fieldNodeType)
    // }
    //
    // get() {
    //     return this.pickerDialog
    // }

    getSiteSwitcher() {
        if (!this.siteSwitcher) {
            this.siteSwitcher = getComponentByAttr(Dropdown, 'data-cm-role', 'site-switcher')
        }
        // make sure dialog is open before returning siteSwitcher
        return this && this.siteSwitcher
    }

    getAccordion(): Accordion {
        if (!this.accordion) {
            const secondaryNav = getComponent(SecondaryNav)
            this.accordion = getComponent(Accordion, secondaryNav)
        }
        return this.accordion
    }

    assertHasNoTree(): void {
        getComponent(SecondaryNav, null, (el) => expect(el).to.not.exist)
    }

    /**
     * @param itemName -
     */
    getAccordionItem(itemName: string) {
        return new AccordionItem(this.getAccordion(), itemName)
    }

    cancel() {
        getComponentByAttr(Button, 'data-sel-picker-dialog-action', 'cancel').click() // cancel picker
    }

    select() {
        getComponentByAttr(Button, 'data-sel-picker-dialog-action', 'done').click() // select picker selection
    }

    getTable() {
        if (!this.table) {
            this.table = getComponentByAttr(Table, 'data-cm-role', 'table-content-list', this)
            this.table.get().find('.moonstone-TableRow').should('be.visible')
        }
        return this.table
    }

    getSelectionTable() {
        if (!this.selectionTable) {
            this.selectionTable = getComponentByAttr(Table, 'data-cm-role', 'selection-table', this)
            this.selectionTable.get().find('.moonstone-TableRow').should('be.visible')
        }
        return this.selectionTable
    }

    wait() {
        cy.get('.moonstone-loader').should('not.exist') // wait to load
    }

    navigateTo(accordion: AccordionItem, path: string) {
        const expandPaths = path.split('/')
        const [selectPath] = expandPaths.splice(expandPaths.length - 1, 1)
        expandPaths.forEach((p) => accordion.expandTreeItem(p))
        accordion.getTreeItem(selectPath).click()
        this.wait()
    }

    getTableRow(label: string) {
        this.getTable().get().find('.moonstone-TableRow').first().should('be.visible')
        return this.getTable()
            .get()
            .find('.moonstone-TableRow')
            .filter(`:contains("${label}")`)
            .scrollIntoView({ timeout: 1000, duration: 500 })
    }

    getHeaderByName(name: string) {
        return cy.get('.moonstone-tableHead .moonstone-TableRow').filter(`:contains("${name}")`)
    }

    getHeaderById(id: string) {
        return cy.get(`[data-cm-role="table-content-list-header-cell-${id}"]`)
    }

    getSelectedRows() {
        return this.getTable()
            .get()
            .find('tbody [data-cm-role="table-content-list-cell-selection"] input[aria-checked="true"]')
    }

    getSelectionCaption() {
        return cy.get('[data-cm-role="selection-caption"] [data-sel-role$="item-selected"]')
    }

    selectItems(count: number) {
        this.getTable()
            .getRows()
            .get()
            .then((elems) => {
                expect(elems.length).gte(count)
                const selectRow = (elem) =>
                    cy.wrap(elem).find('[data-cm-role="table-content-list-cell-selection"] input').click()
                for (let i = 0; i < count; i++) {
                    selectRow(elems.eq(i))
                }
            })
    }

    search(query?: string) {
        if (query === undefined) {
            cy.get('input[role="search"]').should('be.visible').click().clear({ waitForAnimations: true })
            this.table = undefined
            this.selectionTable = undefined
            cy.get('[data-cm-role="table-content-list"]').find('.moonstone-TableRow').should('be.visible')
        } else {
            cy.get('input[role="search"]')
                .should('be.visible')
                .click()
                .type(query, { waitForAnimations: true, delay: 200 })
            this.table = undefined
            this.selectionTable = undefined
            cy.get('[data-cm-role="table-content-list"]').find('.moonstone-TableRow').should('be.visible')
        }
    }

    getSearchInput() {
        return cy.get('input[role="search"]').should('be.visible')
    }

    verifyResultsLength(length: number) {
        cy.get('.moonstone-tablePagination').should('be.visible').and('contain', `of ${length}`)
    }

    switchSearchContext(context: string) {
        getComponentBySelector(Dropdown, '.moonstone-searchContext-element').select(context)
    }
}
