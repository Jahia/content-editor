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
import {ContentType, contentTypes} from '../fixtures/pickers/contentTypes'
import { AccordionItem } from './accordionItem'

export class Picker {
    pageComposer: PageComposer
    pickerDialog: BaseComponent
    siteSwitcher: Dropdown

    secondaryNav: SecondaryNav
    accordion: Accordion
    table: Table

    constructor(pageComposer: PageComposer) {
        this.pageComposer = pageComposer
    }

    /*
     * Open picker by adding content type for a selected field
     * @param contentTypeKey key as defined in fixtures/pickers/contentTypes definition
     */
    open(contentType: ContentType) {
        this.pageComposer.createContent(contentType.typeName)
        const parent = getComponentByAttr(BaseComponent, 'data-sel-content-editor-field', contentType.fieldNodeType)
        const buttonSelector = contentType.multiple ? 'button[data-sel-action="addField"] ' : 'button';
        parent.get().find(buttonSelector).click()
        this.pickerDialog = getComponentByRole(BaseComponent, 'picker-dialog')
        return this
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

    getTable() {
        if (!this.table) {
            this.table = getComponent(Table, this.pickerDialog)
        }
        return this.table
    }

    getTableRow(content:string) {
        return this.getTable().get().find('.moonstone-TableRow').filter(':contains("content-folder1")')
    }

    getHeaderByName(name: string) {
        return cy.get('.moonstone-tableHead .moonstone-TableRow').filter(`:contains("${name}")`)
    }
}
