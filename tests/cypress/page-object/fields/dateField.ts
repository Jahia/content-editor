import {Field} from './field';

export class DateField extends Field {
    addNewValue(newValue: string, force?: boolean) {
        this.get().find('input[type="text"]')
            .clear().type(newValue, {force: force})
            .should('have.value', newValue);
        return this;
    }

    checkValue(expectedValue: string) {
        this.get().find('input').last().should('have.value', expectedValue);
    }
}
