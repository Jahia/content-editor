import {requiredValidation} from './required';

describe('required validation', () => {
    describe('requiredValidation', () => {
        let sections;
        let values;

        const buildSections = (mandatory, multiple, requiredType) => {
            const buildField = name => {
                return {name: name, mandatory: mandatory, multiple: multiple, requiredType: requiredType};
            };

            sections = [
                {
                    fieldSets: [
                        {
                            fields: [
                                buildField('field1'),
                                buildField('field2')
                            ]
                        },
                        {
                            fields: [
                                buildField('field3')
                            ]
                        }
                    ]
                },
                {
                    fieldSets: [
                        {
                            fields: [
                                buildField('field4')
                            ]
                        }
                    ]
                }
            ];

            values = {
                field1: null,
                field2: undefined,
                field3: '',
                field4: 'notEmpty'
            };
            return {sections, values};
        };

        it('should return object with all field with no errors when fields are NOT mandatory', () => {
            const mandatory = false;
            const multiple = false;
            const {sections, values} = buildSections(mandatory, multiple);

            expect(requiredValidation(sections)(values)).toEqual({
                field1: undefined,
                field2: undefined,
                field3: undefined,
                field4: undefined
            });
        });

        it('should return object with all field with errors when fields are mandatory', () => {
            const mandatory = true;
            const multiple = false;
            const {sections, values} = buildSections(mandatory, multiple);
            expect(requiredValidation(sections)(values)).toEqual({
                field1: 'required',
                field2: 'required',
                field3: 'required',
                field4: undefined
            });
        });

        it('should return object with all field with errors when all fields are multiple and mandatory', () => {
            const mandatory = true;
            const multiple = true;
            const {sections} = buildSections(mandatory, multiple);
            const values = {
                field1: null,
                field2: undefined,
                field3: [],
                field4: ['notEmpty1', 'notEmpty2']
            };

            expect(requiredValidation(sections)(values)).toEqual({
                field1: 'required',
                field2: 'required',
                field3: 'required',
                field4: undefined
            });
        });

        it('should return object with all field with no errors when all fields are BOOLEAN and mandatory', () => {
            const mandatory = true;
            const multiple = false;
            const {sections, values} = buildSections(mandatory, multiple, 'BOOLEAN');
            const fn = requiredValidation(sections);
            expect(fn(values)).toEqual({
                field1: undefined,
                field2: undefined,
                field3: undefined,
                field4: undefined
            });
        });

        it('should return object with some errors when all fields are BOOLEAN, mandatory and multiple but with or without values', () => {
            const mandatory = true;
            const multiple = true;
            const {sections} = buildSections(mandatory, multiple, 'BOOLEAN');
            const values = {
                field1: null,
                field2: undefined,
                field3: [],
                field4: [true, false]
            };
            expect(requiredValidation(sections)(values)).toEqual({
                field1: 'required',
                field2: 'required',
                field3: 'required',
                field4: undefined
            });
        });
    });
});
