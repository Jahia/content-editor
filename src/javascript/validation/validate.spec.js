import {validate} from './validate';
import {Constants} from '~/ContentEditor.constants';

describe('validate', () => {
    const buildSections = (fieldOptions = {}) => {
        const buildField = (name, nodeType) => {
            return {name, nodeType, ...fieldOptions};
        };

        const sections = [
            {
                fieldSets: [
                    {
                        name: 'fieldSet1',
                        dynamic: false,
                        fields: [
                            buildField('field1', 'fieldSet1'),
                            buildField('field2', 'fieldSet1')
                        ]
                    },
                    {
                        name: 'fieldSet2',
                        dynamic: false,
                        fields: [
                            buildField('field3', 'fieldSet2')
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
                            buildField('field4', 'fieldSet3')
                        ]
                    }
                ]
            }
        ];

        const values = {
            field1: null,
            field2: undefined,
            field3: '',
            field4: 'notEmpty'
        };
        return {sections, values};
    };

    const maxLength = maxLength => ({selectorOptions: [{name: 'maxLength', value: maxLength}]});

    describe('required', () => {
        it('should return object with all field with no errors when fields are NOT mandatory', () => {
            const {sections, values} = buildSections({mandatory: false, multiple: false});

            expect(validate(sections)(values)).toEqual({
                field1: undefined,
                field2: undefined,
                field3: undefined,
                field4: undefined
            });
        });

        it('should return object with all field with errors when fields are mandatory', () => {
            const {sections, values} = buildSections({mandatory: true, multiple: false});
            const result = validate(sections)(values);
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

            expect(validate(sections)(values)).toEqual({
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

            expect(validate(sections)(values)).toEqual({
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

            expect(validate(sections)(values)).toEqual({
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

            expect(validate(sections)(values)).toEqual({});
        });
    });

    describe('color', () => {
        it('should not trigger any error when field is not a COLOR', () => {
            const {sections, values} = buildSections({requiredType: 'STRING'});
            expect(validate(sections)(values)).toEqual({});
        });

        it('should trigger error when filled date is not valid date', () => {
            const {sections} = buildSections({selectorType: Constants.color.selectorType});
            const values = {
                field1: 'yolo',
                field2: '#wrefcx',
                field3: '#fff',
                field4: '#FFFFFF'
            };

            expect(validate(sections)(values)).toEqual({
                field1: 'invalidColor',
                field2: 'invalidColor'
            });
        });
    });

    describe('date', () => {
        it('should not trigger any error when field is not a DATE', () => {
            const {sections, values} = buildSections({requiredType: 'STRING'});
            expect(validate(sections)(values)).toEqual({});
        });

        it('should trigger error when filled date is not valid date', () => {
            const {sections} = buildSections({requiredType: 'DATE'});
            const values = {
                field1: 'yolo',
                field2: 'not a date',
                field3: 'plop',
                field4: 'notEmpty'
            };

            expect(validate(sections)(values)).toEqual({
                field1: 'invalidDate',
                field2: 'invalidDate',
                field3: 'invalidDate',
                field4: 'invalidDate'
            });
        });

        it('should not trigger any error when fields is valid DATE and no ', () => {
            const {sections} = buildSections({requiredType: 'DATE', valueConstraints: []});
            const values = {
                field1: '2019-06-04T00:00:00.000',
                field2: '2019-06-04T00:00:00.000',
                field3: '2019-06-04T00:00:00.000',
                field4: '2019-06-04T00:00:00.000'
            };
            expect(validate(sections)(values)).toEqual({});
        });

        it('should log error and set field as valid when constraint is no valid', () => {
            const consoleError = console.error;
            console.error = jest.fn();

            const {sections} = buildSections({
                requiredType: 'DATE',
                valueConstraints: [
                    {value: {string: 'yolo, this is a bad constraint commint from a java random dev'}}
                ]
            });
            const values = {
                field1: '2020-06-04T00:00:00.000',
                field2: '2018-06-04T00:00:00.000',
                field3: '2019-06-04T00:00:00.000',
                field4: '2019-06-05T00:00:00.000'
            };

            expect(validate(sections)(values)).toEqual({});
            expect(console.error).toHaveBeenCalled();
            console.error = consoleError;
        });

        it('should validate a value with (2019-06-04T00:00:00.000,) date constraint', () => {
            const {sections} = buildSections({
                requiredType: 'DATE',
                valueConstraints: [
                    {value: {string: '(2019-06-04T00:00:00.000,)'}}
                ]
            });
            const values = {
                field1: '2020-06-04T00:00:00.000',
                field2: '2018-06-04T00:00:00.000',
                field3: '2019-06-04T00:00:00.000',
                field4: '2019-06-05T00:00:00.000'
            };

            expect(validate(sections)(values)).toEqual({
                field2: 'invalidDate',
                field3: 'invalidDate'
            });
        });

        it('should validate a value with [2019-06-04T00:00:00.000,] date constraint', () => {
            const {sections} = buildSections({
                requiredType: 'DATE',
                valueConstraints: [
                    {value: {string: '[2019-06-04T00:00:00.000,]'}}
                ]
            });
            const values = {
                field1: '2020-06-04T00:00:00.000',
                field2: '2018-06-04T00:00:00.000',
                field3: '2019-06-04T00:00:00.000',
                field4: '2019-06-05T00:00:00.000'
            };

            expect(validate(sections)(values)).toEqual({
                field2: 'invalidDate'
            });
        });

        it('should validate a value with (,2019-06-04T00:00:00.000) date constraint', () => {
            const {sections} = buildSections({
                requiredType: 'DATE',
                valueConstraints: [
                    {value: {string: '(,2019-06-04T00:00:00.000)'}}
                ]
            });
            const values = {
                field1: '2020-06-04T00:00:00.000',
                field2: '2018-06-04T00:00:00.000',
                field3: '2019-06-04T00:00:00.000',
                field4: '2019-06-03T00:00:00.000'
            };

            expect(validate(sections)(values)).toEqual({
                field1: 'invalidDate',
                field3: 'invalidDate'
            });
        });

        it('should validate a value with (,2019-06-04T00:00:00.000) date constraint', () => {
            const {sections} = buildSections({
                requiredType: 'DATE',
                valueConstraints: [
                    {value: {string: '(,2019-06-04T00:00:00.000)'}}
                ]
            });
            const values = {
                field1: '2020-06-04T00:00:00.000',
                field2: '2018-06-04T00:00:00.000',
                field3: '2019-06-04T00:00:00.000',
                field4: '2019-06-03T00:00:00.000'
            };

            expect(validate(sections)(values)).toEqual({
                field1: 'invalidDate',
                field3: 'invalidDate'
            });
        });

        it('should validate a value with [,2019-06-04T00:00:00.000] date constraint', () => {
            const {sections} = buildSections({
                requiredType: 'DATE',
                valueConstraints: [
                    {value: {string: '[,2019-06-04T00:00:00.000]'}}
                ]
            });
            const values = {
                field1: '2020-06-04T00:00:00.000',
                field2: '2018-06-04T00:00:00.000',
                field3: '2019-06-04T00:00:00.000',
                field4: '2019-06-03T00:00:00.000'
            };

            expect(validate(sections)(values)).toEqual({
                field1: 'invalidDate'
            });
        });

        it('should validate properly multiple constraints', () => {
            const {sections} = buildSections({
                requiredType: 'DATE',
                valueConstraints: [
                    {value: {string: '(2019-06-02T00:00:00.000,2019-06-04T00:00:00.000)'}}
                ]
            });
            const values = {
                field1: '2019-06-03T00:00:00.000',
                field2: '2019-06-04T00:00:00.000',
                field3: '2019-06-02T00:00:00.000',
                field4: '2018-06-03T00:00:00.000'
            };

            expect(validate(sections)(values)).toEqual({
                field2: 'invalidDate',
                field3: 'invalidDate',
                field4: 'invalidDate'
            });
        });

        it('should validate properly multiple date field', () => {
            const {sections} = buildSections({
                requiredType: 'DATE',
                multiple: true,
                valueConstraints: [
                    {value: {string: '(2019-06-02T00:00:00.000,2019-06-04T00:00:00.000)'}}
                ]
            });
            const values = {
                field1: [],
                field2: ['2019-06-03T00:00:00.000', '2019-06-04T00:00:00.000'],
                field3: ['2019-06-03T00:00:00.000', '2019-06-03T00:00:00.000'],
                field4: ['tioutoit', 'oittoijoi']
            };

            expect(validate(sections)(values)).toEqual({
                field2: 'invalidDate',
                field4: 'invalidDate'
            });
        });

        it('should validate properly multiple date field when there is multiple constraints', () => {
            const {sections} = buildSections({
                requiredType: 'DATE',
                valueConstraints: [
                    {value: {string: '(2019-06-02T00:00:00.000,2019-06-04T00:00:00.000)'}},
                    {value: {string: '(2019-06-05T00:00:00.000,2019-06-07T00:00:00.000)'}}
                ]
            });
            const values = {
                field1: '2019-06-03T00:00:00.000',
                field2: '2019-06-06T00:00:00.000',
                field3: '2019-06-02T00:00:00.000',
                field4: '2019-06-07T00:00:00.000'
            };

            expect(validate(sections)(values)).toEqual({
                field3: 'invalidDate',
                field4: 'invalidDate'
            });
        });
    });

    describe('pattern', () => {
        it('should trigger error when is not valid pattern', () => {
            const {sections} = buildSections({
                requiredType: 'STRING',
                valueConstraints: [
                    {value: {string: '^$|[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\\.)+[A-Za-z]{2,}'}}
                ]
            });
            const values = {
                field1: 'toto',
                field2: 'foo',
                field3: 'test@support',
                field4: 'support.fr'
            };

            expect(validate(sections)(values)).toEqual({
                field1: 'invalidPattern',
                field2: 'invalidPattern',
                field3: 'invalidPattern',
                field4: 'invalidPattern'
            });
        });

        it('should validate properly multiple email field', () => {
            const {sections} = buildSections({
                requiredType: 'STRING',
                multiple: true,
                valueConstraints: [
                    {value: {string: '^$|[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\\.)+[A-Za-z]{2,}'}}
                ]
            });
            const values = {
                field1: ['notCorrect@mail'],
                field2: ['bonjour@support.fr', 'bonjour2@support.fr'],
                field3: ['hallo@support.de', 'hallo2@support.de'],
                field4: ['world@support.com']
            };

            expect(validate(sections)(values)).toEqual({
                field1: 'invalidPattern',
                field2: undefined,
                field3: undefined,
                field4: undefined
            });
        });

        it('should validate properly multiple email field with mix of valid and invalid values', () => {
            const {sections} = buildSections({
                requiredType: 'STRING',
                multiple: true,
                valueConstraints: [
                    {value: {string: '^$|[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\\.)+[A-Za-z]{2,}'}}
                ]
            });
            const values = {
                field1: ['notCorrect@mail'],
                field2: ['bonjour@support.fr', 'bonjour2@support.fr', 'notCorrect@all', 'notEmpty'],
                field3: ['hallo@support.de', '', 'hallo2@support.de'],
                field4: ['world@support.com', 'toto']
            };

            expect(validate(sections)(values)).toEqual({
                field1: 'invalidPattern',
                field2: 'invalidPattern',
                field3: undefined,
                field4: 'invalidPattern'
            });
        });

        it('should validate properly field with constraints', () => {
            const {sections} = buildSections({
                requiredType: 'STRING',
                valueConstraints: [
                    {value: {string: 'value0'}},
                    {value: {string: 'value1'}},
                    {value: {string: 'value2'}},
                    {value: {string: 'value3'}}
                ]
            });
            const values = {
                field1: 'myValue',
                field2: '',
                field3: 'value1',
                field4: null
            };

            expect(validate(sections)(values)).toEqual({
                field1: 'invalidPattern',
                field2: undefined,
                field3: undefined,
                field4: undefined
            });
        });

        it('should validate properly multiple field with constraints', () => {
            const {sections} = buildSections({
                requiredType: 'STRING',
                multiple: true,
                valueConstraints: [
                    {value: {string: 'value0'}},
                    {value: {string: 'value1'}},
                    {value: {string: 'value2'}},
                    {value: {string: 'value3'}}
                ]
            });
            const values = {
                field1: ['myValue', 'value3'],
                field2: ['', 'toto', 'notCorrect@all', 'notEmpty'],
                field3: ['hallo@support.de', 'value1', 'hallo2@support.de'],
                field4: ['value2', 'value3']
            };

            expect(validate(sections)(values)).toEqual({
                field1: 'invalidPattern',
                field2: 'invalidPattern',
                field3: 'invalidPattern',
                field4: undefined
            });
        });

        it('should validate properly multiple email field and fields are mandatory', () => {
            const {sections} = buildSections({
                requiredType: 'STRING',
                multiple: true,
                mandatory: true,
                valueConstraints: [
                    {value: {string: '^$|[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\\.)+[A-Za-z]{2,}'}}
                ]
            });
            const values = {
                field1: [''],
                field2: null,
                field3: ['notEmpty', 'hallo2@support.de'],
                field4: undefined
            };

            expect(validate(sections)(values)).toEqual({
                field1: 'required',
                field2: 'required',
                field3: 'invalidPattern',
                field4: 'required'
            });
        });

        it('should not trigger error when is valid email', () => {
            const {sections} = buildSections({
                requiredType: 'STRING',
                valueConstraints: [
                    {value: {string: '^$|[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\\.)+[A-Za-z]{2,}'}}
                ]
            });
            const values = {
                field1: 'bonjour@support.fr',
                field2: 'hallo@support.de',
                field3: 'hello@support.en',
                field4: 'world@support.com'
            };

            expect(validate(sections)(values)).toEqual({
                field1: undefined,
                field2: undefined,
                field3: undefined,
                field4: undefined
            });
        });

        it('should not trigger error when multiple value is empty and not mandatory', () => {
            const {sections} = buildSections({
                requiredType: 'STRING',
                multiple: true,
                valueConstraints: [
                    {value: {string: '^$|[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\\.)+[A-Za-z]{2,}'}}
                ]
            });
            const values = {
                field1: ['bonjour@support.fr'],
                field2: undefined,
                field3: [],
                field4: ['']
            };

            expect(validate(sections)(values)).toEqual({
                field1: undefined,
                field2: undefined,
                field3: undefined,
                field4: undefined
            });
        });

        it('should do equals comparison for choicelist values', () => {
            const {sections} = buildSections({
                requiredType: 'STRING',
                selectorType: Constants.field.selectorType.CHOICELIST,
                valueConstraints: [
                    {value: {string: '{"versions":["2.0.1","2.0.2","2.3.2-RELEASE"],"name":"account-button"}'}}
                ]
            });
            const values = {
                field1: '{"versions":["2.0.1","2.0.2","2.3.2-RELEASE"],"name":"account-button"}'
            };

            expect(validate(sections)(values)).toEqual({field1: undefined});
        });

        it('should do pattern matching comparison for non-choicelist values', () => {
            const {sections} = buildSections({
                requiredType: 'STRING',
                // 'selectorType' not specified
                valueConstraints: [
                    {value: {string: '{"versions":["2.0.1","2.0.2","2.3.2-RELEASE"],"name":"account-button"}'}}
                ]
            });
            const values = {
                field1: '{"versions":["2.0.1","2.0.2","2.3.2-RELEASE"],"name":"account-button"}'
            };

            expect(validate(sections)(values)).toEqual({field1: 'invalidPattern'});
        });
    });

    describe('max-length', () => {
        it('should not trigger any error when fields is not a string', () => {
            const {sections} = buildSections({requiredType: 'DATE', ...maxLength(42)});
            const values = {
                field1: '2019-06-04T00:00:00.000',
                field2: '2019-06-04T00:00:00.000',
                field3: '2019-06-04T00:00:00.000',
                field4: '2019-06-04T00:00:00.000'
            };
            expect(validate(sections)(values)).toEqual({});
        });

        it('should not trigger any error when no maxLength limit', () => {
            const {sections} = buildSections();
            const values = {
                field1: '1',
                field2: '0',
                field3: null,
                field4: undefined
            };
            expect(validate(sections)(values)).toEqual({});
        });

        it('should not trigger any error when value is below the maxLength limit', () => {
            const {sections} = buildSections({requiredType: 'STRING', ...maxLength(5)});
            const values = {
                field1: '1',
                field2: '0',
                field3: null,
                field4: undefined
            };
            expect(validate(sections)(values)).toEqual({});
        });

        it('should trigger an error when values is upper the maxLength limit', () => {
            const {sections} = buildSections({requiredType: 'STRING', ...maxLength(5)});
            const values = {
                field1: '123456678',
                field2: '0999999999',
                field3: 'good',
                field4: 'ispeaktoomuch'
            };
            const validationResult = validate(sections)(values);
            expect(validationResult).toEqual({
                field1: 'maxLength',
                field2: 'maxLength',
                field4: 'maxLength'
            });
        });

        it('should not trigger any error when value is below the maxLength limit in multiple fields', () => {
            const {sections} = buildSections({requiredType: 'STRING', ...maxLength(5), multiple: true});
            const values = {
                field1: ['1', '2', '1', '2', '1', '2'],
                field2: ['0'],
                field3: null,
                field4: []
            };
            expect(validate(sections)(values)).toEqual({});
        });

        it('should trigger errors when one of the values are upper the maxLength limit in multiple fields', () => {
            const {sections} = buildSections({requiredType: 'STRING', ...maxLength(5), multiple: true});
            const values = {
                field1: ['1', 'toolooong'],
                field2: ['1', '42424242242424'],
                field3: ['good', 'good'],
                field4: [null, undefined, 'toolooong']
            };
            expect(validate(sections)(values)).toEqual({
                field1: 'maxLength',
                field2: 'maxLength',
                field4: 'maxLength'
            });
        });
    });

    describe('validate order', () => {
        it('should validate mandatory with better priority than date validate', () => {
            const {sections} = buildSections({
                requiredType: 'DATE',
                mandatory: true,
                valueConstraints: [
                    {value: {string: '[,2019-06-04T00:00:00.000]'}}
                ]
            });
            sections[0].fieldSets[1].fields[0].mandatory = false;

            const values = {
                field1: '',
                field2: null,
                field3: '',
                field4: '2019-06-04T00:00:00.000'
            };

            expect(validate(sections)(values)).toEqual({
                field1: 'required',
                field2: 'required'
            });
        });

        it('should validate mandatory with better priority than maxLength', () => {
            const {sections} = buildSections({requiredType: 'STRING', ...maxLength(5), mandatory: true});
            sections[0].fieldSets[1].fields[0].mandatory = false;

            const values = {
                field1: '',
                field2: null,
                field3: '',
                field4: '123456'
            };

            expect(validate(sections)(values)).toEqual({
                field1: 'required',
                field2: 'required',
                field4: 'maxLength'
            });
        });

        it('should trigger error when is not valid email and fields are mandatory', () => {
            const {sections} = buildSections({
                requiredType: 'STRING',
                mandatory: true,
                valueConstraints: [
                    {value: {string: '^$|[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\\.)+[A-Za-z]{2,}'}}
                ]
            });
            const values = {
                field1: '',
                field2: null,
                field3: undefined,
                field4: 'notEmpty'
            };

            expect(validate(sections)(values)).toEqual({
                field1: 'required',
                field2: 'required',
                field3: 'required',
                field4: 'invalidPattern'
            });
        });
    });
});
