import {BaseComponent} from '@jahia/cypress';

export class Field extends BaseComponent {
    fieldName: string;
    multiple: boolean;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    checkValue(string: string): void {
        // Empty method
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    checkValues(string: string[]): void {
        // Empty method
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addNewValue(string: string): void {
        // Empty method
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    checkOptions(expectedOptions: string[]): void {
        // Empty method
    }
}
