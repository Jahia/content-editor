import {requiredValidation} from './required';

describe('required validation', () => {
    describe('requiredValidation', () => {
        let sections;
        let values;

        const buildSections = ({mandatory, multiple, requiredType}) => {
            const buildField = name => {
                return {name: name, mandatory: mandatory, multiple: multiple, requiredType: requiredType};
            };

            sections = [
                {
                    fieldSets: [
                        {
                            name: 'fieldSet1',
                            dynamic: false,
                            fields: [
                                buildField('field1'),
                                buildField('field2')
                            ]
                        },
                        {
                            name: 'fieldSet2',
                            dynamic: false,
                            fields: [
                                buildField('field3')
                            ]
                        }
                    ]
                },
                {
                    fieldSets: [
                        {
                            name: 'fieldSet3',
                            dynamic: false,
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
            const {sections, values} = buildSections({mandatory: false, multiple: false});

            expect(requiredValidation(sections)(values)).toEqual({
                field1: undefined,
                field2: undefined,
                field3: undefined,
                field4: undefined
            });
        });

        it('should return object with all field with errors when fields are mandatory', () => {
            const {sections, values} = buildSections({mandatory: true, multiple: false});
            const result = requiredValidation(sections)(values);
            expect(result).toEqual({
                field1: 'required',
                field2: 'required',
                field3: 'required',
                field4: undefined
            });
        });

        it('should return object with all field with errors when all fields are multiple and mandatory', () => {
            const {sections} = buildSections({mandatory: true, multiple: true});
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

        it('should return object with some errors when all fields are mandatory and dynamic fieldSet are activated', () => {
            const {sections} = buildSections({mandatory: true});
            const values = {
                field1: null,
                field2: undefined,
                field3: '',
                field4: 'notEmpty',
                fieldSet1: true,
                fieldSet2: true,
                fieldSet3: true
            };

            sections[0].fieldSets[0].dynamic = true;
            sections[0].fieldSets[1].dynamic = true;
            sections[1].fieldSets[0].dynamic = true;

            expect(requiredValidation(sections)(values)).toEqual({
                field1: 'required',
                field2: 'required',
                field3: 'required',
                field4: undefined
            });
        });

        it('should return object with some errors when all fields are mandatory and multiple and dynamic fieldSet are activated', () => {
            const {sections} = buildSections({mandatory: true, multiple: true});
            const values = {
                field1: null,
                field2: undefined,
                field3: [],
                field4: ['value1', 'value2'],
                fieldSet1: true,
                fieldSet2: true,
                fieldSet3: true
            };

            sections[0].fieldSets[1].dynamic = true;
            sections[1].fieldSets[0].dynamic = true;

            expect(requiredValidation(sections)(values)).toEqual({
                field1: 'required',
                field2: 'required',
                field3: 'required',
                field4: undefined
            });
        });

        it('should return object with no errors when all fields are mandatory and dynamic fieldSet are deactivated', () => {
            const {sections} = buildSections({mandatory: true});
            const values = {
                field1: null,
                field2: undefined,
                field3: [],
                field4: [true, false],
                fieldSet1: false,
                fieldSet2: false,
                fieldSet3: false
            };

            sections[0].fieldSets[0].dynamic = true;
            sections[0].fieldSets[1].dynamic = true;
            sections[1].fieldSets[0].dynamic = true;

            expect(requiredValidation(sections)(values)).toEqual({});
        });
    });
});
