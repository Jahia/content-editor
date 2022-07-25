import {
    Accordion,
    BaseComponent,
    getComponentByAttr,
    getComponentByRole,
    getComponent,
    SecondaryNav, Dropdown, Button
} from "@jahia/cypress";
import {ContentEditor} from "./contentEditor";
import {PageComposer} from "./pageComposer";
import {ContentType} from "../fixtures/pickers/contentTypes";
import {AccordionItem} from "./accordionItem";

export class Picker {

    pageComposer: PageComposer
    pickerDialog: BaseComponent
    siteSwitcher: Dropdown

    secondaryNav: SecondaryNav
    accordion: Accordion

    constructor(pageComposer:PageComposer) {
        this.pageComposer = pageComposer
    }

    /*
     * Open picker by adding content type for a selected field
     * @param contentTypeKey key as defined in fixtures/pickers/contentTypes definition
     */
    open(contentType: ContentType) {
        this.pageComposer.createContent(contentType.typeName)
        let parent = getComponentByAttr(BaseComponent, "data-sel-content-editor-field", contentType.fieldNodeType)
        parent.get().find('button').click()
        this.pickerDialog = getComponentByRole(BaseComponent, "picker-dialog")
        return this;
    }

    get() {
        return this.pickerDialog;
    }

    getSiteSwitcher() {
        if (!this.siteSwitcher) {
            this.siteSwitcher = getComponentByAttr(Dropdown, 'data-cm-role', 'site-switcher')
        }
        // make sure dialog is open before returning siteSwitcher
        return this.pickerDialog && this.siteSwitcher;
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
    getAccordionItem(itemName:string) {
        return new AccordionItem(this.getAccordion(), itemName);
    }

    cancel() {
        getComponentByAttr(Button, 'data-sel-picker-dialog-action', 'cancel').click() // cancel picker
        getComponentByRole(Button, 'backButton').click() // cancel create content
    }

}
