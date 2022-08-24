import {BaseComponent, getComponentByRole} from '@jahia/cypress';
import {Picker} from './picker';

export class RichTextField extends BaseComponent {
    fieldName: string;

    type(text) {
        this.get().iframe('.cke_wysiwyg_frame').within(() => {
            cy.get('body').type(text);
        });
    }

    setData(value) {
        cy.window().its('CKEDITOR').its('instances').then(instances => {
            instances[Object.keys(instances)[0]].setData(value);
        });
    }

    getData() {
        return cy.window().its('CKEDITOR').its('instances').then(instances => instances[Object.keys(instances)[0]].getData());
    }

    openLinkModal() {
        this.get().find('.cke_button__link_icon').click();
        return new LinkModal(cy.get('.cke_dialog_body'));
    }
}

export class LinkModal extends BaseComponent {
    openBrowseServerContents(): Picker {
        this.get().find('span.cke_dialog_ui_button').eq(0).click();
        return getComponentByRole(Picker, 'picker-dialog');
    }

    openBrowseServerFiles(): Picker {
        this.get().find('span.cke_dialog_ui_button').eq(1).click();
        return getComponentByRole(Picker, 'picker-dialog');
    }

    cancel() {
        this.get().find('span.cke_dialog_ui_button').eq(3).click();
    }

    ok() {
        this.get().find('span.cke_dialog_ui_button').eq(4).click();
    }
}
