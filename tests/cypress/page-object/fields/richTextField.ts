import {BaseComponent, getComponentByRole} from '@jahia/cypress';
import {Picker} from '../picker';
import {Field} from './field';

export class RichTextField extends Field {
    type(text) {
        this.get().iframe('.cke_wysiwyg_frame').type(text);
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
        this.get().find('span.cke_dialog_ui_button').contains('Browse Server (Content)').click();
        return getComponentByRole(Picker, 'picker-dialog');
    }

    openBrowseServerFiles(): Picker {
        this.get().find('span.cke_dialog_ui_button').contains('Browse Server (Files)').click();
        return getComponentByRole(Picker, 'picker-dialog');
    }

    cancel() {
        this.get().find('span.cke_dialog_ui_button').contains('Cancel').click();
    }

    ok() {
        this.get().find('span.cke_dialog_ui_button').contains('OK').click();
    }
}
