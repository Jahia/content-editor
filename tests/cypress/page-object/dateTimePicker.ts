import {DatePicker} from './datePicker';

export class DateTimePicker extends DatePicker {
    protected getNowTime(separator: string): string {
        const date = new Date();
        const hours = date.getHours();
        const minutes = date.getMinutes();

        const stringHour = hours < 10 ? `0${hours}` : hours;
        const stringMinutes = minutes < 10 ? `0${minutes}` : minutes;

        return `${stringHour}${separator}${stringMinutes}`;
    }

    protected nearestHalfHour(separator: string) {
        const nowTime = this.getNowTime(separator);
        const hourParts = nowTime.split(separator);
        const hourPartsInt = [];
        for (let i = 0; i < hourParts.length; i++) {
            hourPartsInt[i] = parseInt(hourParts[i], 10);
        }

        if (hourPartsInt[1] >= 45) {
            hourPartsInt[0]++;
        }

        if (hourPartsInt[1] <= 15 || hourPartsInt[1] >= 45) {
            hourPartsInt[1] = 0;
        } else {
            hourPartsInt[1] = 30;
        }

        const stringHour = hourPartsInt[0] < 10 ? `0${hourPartsInt[0]}` : hourPartsInt[0];
        const stringMinutes = hourPartsInt[1] < 10 ? `0${hourPartsInt[1]}` : hourPartsInt[1];

        return `${stringHour}${separator}${stringMinutes}`;
    }

    public getTimePicker(): Cypress.Chainable {
        return cy.get('input[id="qant:pickers_datetimepicker"]');
    }

    public open() {
        this.getTimePicker().parent().find('button').click();
    }

    public pickNowTime() {
        this.open();
        cy.get('.DayPicker-Day--today').click();
        const now = this.nearestHalfHour(':');
        cy.get('li').contains(now).click();
    }

    public checkTime(time: string) {
        this.getTimePicker().should('have.value', time);
    }

    public typeTime(value: string) {
        this.getTimePicker().type(value);
    }

    public typeNowTime() {
        this.typeTime(`${this.getTodayDate('')}${this.getNowTime('')}`);
    }

    public checkPickedNowTime() {
        const nowTime = `${this.getTodayDate('/')} ${this.nearestHalfHour(':')}`;
        this.getTimePicker().should('have.value', nowTime);
    }

    public checkNowTime() {
        const nowTime = `${this.getTodayDate('/')} ${this.getNowTime(':')}`;
        this.getTimePicker().should('have.value', nowTime);
    }
}
