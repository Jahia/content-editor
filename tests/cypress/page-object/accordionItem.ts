import {Accordion} from '@jahia/cypress';

export class AccordionItem {
    accordion: Accordion;
    itemName: string;

    /**
     * @param accordion
     * @param itemName - match accordion header aria-controls attribute value
     */
    constructor(accordion: Accordion, itemName: string) {
        this.accordion = accordion;
        accordion.should('exist');
        this.itemName = itemName;
    }

    getHeader() {
        return this.accordion.get().find(`section.moonstone-accordionItem header[aria-controls="${this.itemName}"]`);
    }

    click() {
        this.accordion.click(this.itemName);
        return this;
    }

    getSection() {
        return this.getHeader().parent('section');
    }

    getTree() {
        return this.getSection().find('[role="tree"]');
    }

    getTreeItems() {
        return this.getSection().find('[role="treeitem"]');
    }

    getTreeItem(role) {
        return this.getSection().find(`[role="treeitem"][data-sel-role=${role}]`);
    }

    expandTreeItem(role) {
        return this.getTreeItem(role).then(t => {
            const isExpanded = t.attr('aria-expanded') === 'true';
            if (!isExpanded) {
                // Toggle only if not expanded already
                return cy.wrap(t).find('.moonstone-treeView_itemToggle').click();
            }
        });
    }
}
