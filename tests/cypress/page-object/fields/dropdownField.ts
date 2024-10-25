import {Field} from './field';

export class DropdownField extends Field {
    addNewValue(newValue: string) {
        this.get().find('div[role="dropdown"]').should('exist').click();
        this.get().find('menu[role="listbox"]').should('exist').find('li').contains(newValue).should('exist').click();
        return this;
    }

    checkValue(expectedValue: string) {
        this.get().contains(expectedValue).should('exist');
    }

    checkOptions(expectedOptions: string[]) {
        this.get().find('div[role="dropdown"]').should('exist').click();
        this.get().find('menu[role="listbox"]').should('exist').find('li').should('have.length', expectedOptions.length);
        expectedOptions.forEach(option => {
            this.get().find('menu[role="listbox"]').should('exist').find('li').contains(option).should('exist');
        });
        this.get().parent().click();
    }
}
