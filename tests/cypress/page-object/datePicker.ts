export class DatePicker {
    protected getTodayDate(separator: string): string {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const trueDay = day < 10 ? '0' + day : day;
        const trueMonth = month < 10 ? '0' + month : month;

        return `${trueMonth}${separator}${trueDay}${separator}${year}`;
    }

    public getDatePicker(): Cypress.Chainable {
        return cy.get('input[id="qant:pickers_datepicker"]');
    }

    public open() {
        this.getDatePicker().parent().find('button').click();
    }

    public pickTodayDate() {
        this.open();
        cy.get('.DayPicker-Day--today').click();
    }

    public typeDate(value: string) {
        this.getDatePicker().type(value);
    }

    public typeTodayDate() {
        this.typeDate(this.getTodayDate(''));
    }

    public checkTodayDate() {
        this.getDatePicker().should('have.value', this.getTodayDate('/'));
    }

    public checkDate(date: string) {
        this.getDatePicker().should('have.value', date);
    }
}
