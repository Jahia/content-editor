import {
    Accordion,
    BaseComponent,
    Button,
    Dropdown,
    getComponent,
    getComponentByAttr,
    getComponentByRole,
    SecondaryNav,
    Table,
} from '@jahia/cypress'
import { PageComposer } from './pageComposer'
import { ContentType } from '../fixtures/pickers/contentTypes'
import { AccordionItem } from './accordionItem'

export class Picker {
    pageComposer: PageComposer
    pickerDialog: BaseComponent
    siteSwitcher: Dropdown

    secondaryNav: SecondaryNav
    accordion: Accordion
    table: Table
    selectionTable: Table

    static ADD_FIELD_SEL = 'button[data-sel-action="addField"]'

    constructor(pageComposer: PageComposer) {
        this.pageComposer = pageComposer
    }

    /*
     * Open picker by adding content type for a selected field
     * @param contentTypeKey key as defined in fixtures/pickers/contentTypes definition
     */
    open(contentType: ContentType) {
        this.pageComposer.createContent(contentType.typeName)
        const parent = this.getField(contentType.fieldNodeType)
        const buttonSelector = contentType.multiple ? Picker.ADD_FIELD_SEL : 'button'
        parent.get().find(buttonSelector).click()
        this.pickerDialog = getComponentByRole(BaseComponent, 'picker-dialog')
        return this
    }

    getField(fieldNodeType: string) {
        return getComponentByAttr(BaseComponent, 'data-sel-content-editor-field', fieldNodeType)
    }

    get() {
        return this.pickerDialog
    }

    getSiteSwitcher() {
        if (!this.siteSwitcher) {
            this.siteSwitcher = getComponentByAttr(Dropdown, 'data-cm-role', 'site-switcher')
        }
        // make sure dialog is open before returning siteSwitcher
        return this.pickerDialog && this.siteSwitcher
    }

    getAccordion(): Accordion {
        if (!this.accordion) {
            const secondaryNav = getComponent(SecondaryNav)
            this.accordion = getComponent(Accordion, secondaryNav)
        }
        return this.accordion
    }

    /**
     * @param itemName -
     */
    getAccordionItem(itemName: string) {
        return new AccordionItem(this.getAccordion(), itemName)
    }

    cancel() {
        getComponentByAttr(Button, 'data-sel-picker-dialog-action', 'cancel').click() // cancel picker
        getComponentByRole(Button, 'backButton').click() // cancel create content
    }

    select() {
        getComponentByAttr(Button, 'data-sel-picker-dialog-action', 'done').click() // select picker selection
    }

    getTable() {
        if (!this.table) {
            this.table = getComponentByAttr(Table, 'data-cm-role', 'table-content-list', this.pickerDialog)
        }
        return this.table
    }

    getSelectionTable() {
        if (!this.selectionTable) {
            this.selectionTable = getComponentByAttr(Table, 'data-cm-role', 'selection-table', this.pickerDialog)
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
        return this.getTable().get().find('.moonstone-TableRow').filter(`:contains("${label}")`)
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
}
