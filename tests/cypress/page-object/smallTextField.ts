import {BaseComponent, Button, getComponentByAttr, getComponentByRole} from '@jahia/cypress';
import {Picker} from './picker';

export class SmallTextField extends BaseComponent {
    static ADD_FIELD_SEL = 'button[data-sel-action="addField"]';
    fieldName: string;
    multiple: boolean;

    addNewValue(newValue: string) {
        if (this.multiple) {
            this.get().find(SmallTextField.ADD_FIELD_SEL).click();
            this.get().find('input').last().type(newValue);
        }
    }

    checkValue(expectedValue: string) {
        this.get().children('input').should('have.value', expectedValue);
    }

    checkValues(expectedValues: string[]) {
        if (this.multiple) {
            this.get().find('input').should($input => {
                expect($input).to.have.length(expectedValues.length);
                expectedValues.forEach((value, index) => {
                    expect($input.eq(index), `Item ${index}`).to.have.value(expectedValues[index]);
                });
            }).last().focus();
        }
    }
}
