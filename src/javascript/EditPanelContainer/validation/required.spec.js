import {requiredFieldValidation, requiredValidation} from './required';

describe('required validation', () => {
    describe('requiredFieldValidation', () => {
        it('should return "required" when value is null', () => {
            expect(requiredFieldValidation(null)).toBe('required');
        });

        it('should return "required" when value is empty', () => {
            expect(requiredFieldValidation('')).toBe('required');
        });

        it('should return "required" when value is undefined', () => {
            expect(requiredFieldValidation()).toBe('required');
        });

        it('should return undefined when value is not empty', () => {
            expect(requiredFieldValidation('notEmpty')).toBe(undefined);
        });
    });

    describe('requiredValidation', () => {
        let sections;
        let values;

        beforeEach(() => {
            sections = [
                {
                    fieldSets: [
                        {
                            fields: [
                                {mandatory: false, name: 'field1'},
                                {mandatory: false, name: 'field2'}
                            ]},
                        {
                            fields: [
                                {mandatory: false, name: 'field3'}
                            ]}
                    ]},
                {
                    fieldSets: [
                        {
                            fields: [
                                {mandatory: false, name: 'field4'}
                            ]}
                    ]}
            ];

            values = {
                field1: null,
                field2: undefined,
                field3: '',
                field4: 'notEmpty'
            };
        });

        it('should return object with all field with no erros when none of field is required', () => {
            expect(requiredValidation(sections)(values)).toEqual({
                field1: undefined,
                field2: undefined,
                field3: undefined,
                field4: undefined
            });
        });

        it('should return object with all field with erros when some of field are required', () => {
            sections[0].fieldSets[0].fields[0].mandatory = true;
            sections[0].fieldSets[0].fields[1].mandatory = true;
            sections[0].fieldSets[1].fields[0].mandatory = true;
            sections[1].fieldSets[0].fields[0].mandatory = true;

            expect(requiredValidation(sections)(values)).toEqual({
                field1: 'required',
                field2: 'required',
                field3: 'required',
                field4: undefined
            });
        });
    });
});
