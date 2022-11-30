import {BaseComponent, Button, getComponentByAttr, getComponentByRole} from '@jahia/cypress';
import {Picker} from '../picker';
import {Field} from "./field";

export class SmallTextField extends Field {
    static ADD_FIELD_SEL = 'button[data-sel-action="addField"]';

    addNewValue(newValue: string) {
        if (this.multiple) {
            this.get().find(SmallTextField.ADD_FIELD_SEL).click();
            this.get().find('input').last().type(newValue);
        } else {
            this.get().find('input[type="text"]')
                .clear().type(newValue)
                .should('have.value', newValue);
        }
        return this;
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
