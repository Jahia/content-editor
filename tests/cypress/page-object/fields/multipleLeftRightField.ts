import {Field} from './field';

export class MultipleLeftRightField extends Field {
    addNewValue(newValue: string, force = false) {
        this.get().find('li[role="left-list"]').contains(newValue).should('exist').click();

        return this;
    }

    checkValues(expectedValues: string[]) {
        this.get().find('li[role="right-list"]').should('have.length', expectedValues.length);
    }

    checkOptions(expectedOptions: string[]) {
        this.get().find('li[role="left-list"]').should('have.length', expectedOptions.length);
        expectedOptions.forEach(option => {
            this.get().find('li[role="left-list"]').contains(option).should('exist');
        });
    }
}
