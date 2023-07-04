import {BaseComponent} from '@jahia/cypress';

export class Breadcrumb extends BaseComponent {
    static defaultSelector = 'button[data-sel-role="breadcrumb-item"]';

    static findByContent(content: string) : Breadcrumb {
        return new Breadcrumb(cy.get(this.defaultSelector).contains(content));
    }

    click() {
        this.element.click();
    }
}
