import {Button, getComponentByAttr, getComponentByRole} from '@jahia/cypress';
import {Picker} from '../picker';
import {Field} from './field';

export class PickerField extends Field {
    static ADD_FIELD_SEL = 'button[data-sel-action="addField"]';

    open(): Picker {
        const buttonSelector = this.multiple ? PickerField.ADD_FIELD_SEL : '[data-sel-field-picker-action]';
        this.get().find(buttonSelector).click();
        getComponentByAttr(Button, 'data-sel-picker-dialog-action', 'cancel').get().should('be.visible');
        return getComponentByRole(Picker, 'picker-dialog');
    }

    assertValue(value) {
        this.get().find('[data-sel-field-picker-name]').contains(value);
    }

    assertHasNoValue() {
        this.get().find('[data-sel-field-picker-name]').should('not.exist');
    }
}
