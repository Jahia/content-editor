import {Field} from './field';

export class SmallTextField extends Field {
    static ADD_FIELD_SEL = 'button[data-sel-action="addField"]';

    addNewValue(newValue: string, force = false) {
        if (this.multiple) {
            this.get().find(SmallTextField.ADD_FIELD_SEL).click();
            this.get().find('input').last().type(newValue, {force: force});
        } else {
            this.get().find('input[type="text"]')
                .clear({force: force}).type(newValue, {force: force})
                .should('have.value', newValue);
        }

        return this;
    }

    checkValue(expectedValue: string) {
        this.get().find('input').last().should('have.value', expectedValue);
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

    clearValue(force = false) {
        if (this.multiple) {
            // Todo
        } else {
            this.get().find('input[type="text"]').as('textinput');
            // Prevent field from being hidden by sticky header
            this.get().scrollIntoView();
            cy.get('@textinput').clear({force: force, scrollBehavior: false});
        }

        return this;
    }
}
