import {
    checkIfValuesAreDifferent,
    getDataToMutate,
    getDynamicFieldSets,
    getFields,
    getValuePropName
} from './fields.utils';

describe('EditPanel utils', () => {
    describe('getFields', () => {
        it('should return all fields', () => {
            const sections = [
                {
                    name: 'section1',
                    fieldSets: [
                        {
                            fields: [
                                {
                                    name: 'field1',
                                    requiredType: 'TYPE1',
                                    multiple: false
                                },
                                {
                                    name: 'field4',
                                    requiredType: 'TYPE2',
                                    multiple: false
                                }
                            ]
                        }
                    ]
                },
                {
                    name: 'section2',
                    fieldSets: [
                        {
                            fields: [
                                {
                                    name: 'field2',
                                    requiredType: 'TYPE1',
                                    multiple: false
                                },
                                {
                                    name: 'field3',
                                    requiredType: 'TYPE2',
                                    multiple: false
                                }
                            ]
                        }
                    ]
                }
            ];

            const fields = getFields(sections);

            expect(fields).toEqual([
                {
                    name: 'field1',
                    requiredType: 'TYPE1',
                    multiple: false
                },
                {
                    name: 'field4',
                    requiredType: 'TYPE2',
                    multiple: false
                },
                {
                    name: 'field2',
                    requiredType: 'TYPE1',
                    multiple: false
                },
                {
                    name: 'field3',
                    requiredType: 'TYPE2',
                    multiple: false
                }
            ]);
        });
    });
    describe('getDynamicFieldSets', () => {
        it('should return dynamic fieldSets', () => {
            const sections = [
                {
                    name: 'section1',
                    fieldSets: [
                        {name: 'fieldSet1', dynamic: false, activated: false, fields: []},
                        {name: 'fieldSet2', dynamic: true, activated: false, fields: []},
                        {name: 'fieldSet3', dynamic: true, activated: true, fields: []},
                        {name: 'fieldSet4', dynamic: false, activated: false, fields: []}
                    ]
                },
                {
                    name: 'section2',
                    fieldSets: [
                        {name: 'fieldSet21', dynamic: true, activated: true, fields: []},
                        {name: 'fieldSet22', dynamic: false, activated: false, fields: []},
                        {name: 'fieldSet23', dynamic: true, activated: true, fields: []},
                        {name: 'fieldSet24', dynamic: false, activated: false, fields: []}
                    ]
                },
                {
                    name: 'section3',
                    fieldSets: [
                        {name: 'fieldSet31', dynamic: false, activated: false, fields: []},
                        {name: 'fieldSet32', dynamic: false, activated: false, fields: []},
                        {name: 'fieldSet33', dynamic: false, activated: false, fields: []},
                        {name: 'fieldSet34', dynamic: true, activated: false, fields: []}
                    ]
                }
            ];

            const dynamicFieldSets = getDynamicFieldSets(sections);

            expect(dynamicFieldSets).toEqual({
                fieldSet2: false,
                fieldSet3: true,
                fieldSet21: true,
                fieldSet23: true,
                fieldSet34: false
            });
        });
    });

    const sections = [
        {
            fieldSets: [
                {
                    name: 'fs1',
                    dynamic: true,
                    activated: false,
                    fields: []
                },
                {
                    name: 'fs2',
                    dynamic: true,
                    activated: true,
                    fields: []
                },
                {
                    name: 'fs3',
                    activated: true,
                    fields: [
                        {
                            nodeType: 'fs3',
                            name: 'fs3_prop',
                            propertyName: 'prop',
                            requiredType: 'type',
                            multiple: false
                        },
                        {

                            nodeType: 'fs3',
                            name: 'fs3_multiple',
                            propertyName: 'multiple',
                            requiredType: 'type',
                            multiple: true
                        },
                        {
                            nodeType: 'fs3',
                            name: 'fs3_boolean',
                            propertyName: 'boolean',
                            requiredType: 'type',
                            multiple: false
                        },
                        {
                            nodeType: 'fs3',
                            name: 'fs3_multipleBoolean',
                            propertyName: 'multipleBoolean',
                            requiredType: 'type',
                            multiple: true
                        },
                        {
                            nodeType: 'fs3',
                            name: 'fs3_date',
                            propertyName: 'date',
                            requiredType: 'DATE',
                            multiple: false
                        },
                        {
                            nodeType: 'fs3',
                            name: 'fs3_multipleDate',
                            propertyName: 'multipleDate',
                            requiredType: 'DATE',
                            multiple: true
                        },
                        {
                            nodeType: 'fs3',
                            name: 'fs3_decimal',
                            propertyName: 'decimal',
                            requiredType: 'DECIMAL',
                            multiple: false
                        },
                        {
                            nodeType: 'fs3',
                            name: 'fs3_multipleDecimal',
                            propertyName: 'multipleDecimal',
                            requiredType: 'DECIMAL',
                            multiple: true
                        },
                        {
                            nodeType: 'fs3',
                            name: 'fs3_double',
                            propertyName: 'double',
                            requiredType: 'DOUBLE',
                            multiple: false
                        },
                        {
                            nodeType: 'fs3',
                            name: 'fs3_multipleDouble',
                            propertyName: 'multipleDouble',
                            requiredType: 'DOUBLE',
                            multiple: true
                        },
                        {
                            nodeType: 'fs3',
                            name: 'fs3_readOnly',
                            propertyName: 'readOnly',
                            requiredType: 'type',
                            readOnly: true,
                            multiple: false
                        }
                    ]
                },
                {
                    name: 'fs4',
                    activated: true,
                    fields: [
                        {
                            nodeType: 'fs4',
                            name: 'fs4_prop',
                            propertyName: 'prop',
                            requiredType: 'type',
                            multiple: false
                        }
                    ]
                }
            ]
        }
    ];

    const baseFieldSet = {
        definition: {
            declaringNodeType: {
                name: 'fs3'
            }
        }
    };

    const testCases = [
        {
            name: 'prop to save',
            nodeData: {
                properties: [{
                    name: 'prop',
                    value: 'old value',
                    ...baseFieldSet
                }]
            },
            formValues: {
                [sections[0].fieldSets[2].name + '_prop']: 'new value'
            },
            ExpectedPropsToSave: [{
                language: 'fr',
                name: 'prop',
                type: 'type',
                value: 'new value'
            }],
            expectedPropsFieldMapping: {
                prop: sections[0].fieldSets[2].name + '_prop'
            }
        },
        {
            name: 'empty prop',
            skipCreate: true,
            nodeData: {
                properties: [{
                    name: 'prop',
                    value: 'old value',
                    ...baseFieldSet
                }]
            },
            formValues: {
                [sections[0].fieldSets[2].name + '_prop']: ''
            },
            ExpectedPropsToDelete: ['prop'],
            expectedPropsFieldMapping: {
                prop: sections[0].fieldSets[2].name + '_prop'
            }
        },
        {
            name: 'null prop',
            skipCreate: true,
            nodeData: {
                properties: [{
                    name: 'prop',
                    value: 'old value',
                    ...baseFieldSet
                }]
            },
            formValues: {
                [sections[0].fieldSets[2].name + '_prop']: null
            },
            ExpectedPropsToDelete: ['prop'],
            expectedPropsFieldMapping: {
                prop: sections[0].fieldSets[2].name + '_prop'
            }
        },
        {
            name: 'undefined prop',
            skipCreate: true,
            nodeData: {
                properties: [{
                    name: 'prop',
                    value: 'old value',
                    ...baseFieldSet
                }]
            },
            formValues: {
                [sections[0].fieldSets[2].name + '_prop']: undefined
            },
            ExpectedPropsToDelete: ['prop'],
            expectedPropsFieldMapping: {
                prop: sections[0].fieldSets[2].name + '_prop'
            }
        },
        {
            name: 'Read only prop to save',
            nodeData: {
                properties: [{
                    name: 'readOnly',
                    value: 'old value',
                    ...baseFieldSet
                }]
            },
            formValues: {
                [sections[0].fieldSets[2].name + '_readOnly']: 'new value'
            },
            ExpectedPropsToSave: [{
                language: 'fr',
                name: 'readOnly',
                option: undefined,
                type: 'type',
                value: 'new value'
            }],
            expectedPropsFieldMapping: {
                readOnly: sections[0].fieldSets[2].name + '_readOnly'
            }
        },
        {
            name: 'multiple prop to save',
            nodeData: {
                properties: [{
                    name: 'multiple',
                    values: ['old value'],
                    ...baseFieldSet
                }]
            },
            formValues: {
                [sections[0].fieldSets[2].name + '_multiple']: ['new value', undefined]
            },
            ExpectedPropsToSave: [{
                language: 'fr',
                name: 'multiple',
                type: 'type',
                values: ['new value']
            }],
            expectedPropsFieldMapping: {
                multiple: sections[0].fieldSets[2].name + '_multiple'
            }
        },
        {
            name: 'boolean prop to save',
            nodeData: {
                properties: [{
                    name: 'boolean',
                    value: true,
                    ...baseFieldSet
                }]
            },
            formValues: {
                [sections[0].fieldSets[2].name + '_boolean']: false
            },
            ExpectedPropsToSave: [{
                language: 'fr',
                name: 'boolean',
                type: 'type',
                value: false
            }],
            expectedPropsFieldMapping: {
                boolean: sections[0].fieldSets[2].name + '_boolean'
            }
        },
        {
            name: 'multiple boolean prop to save',
            nodeData: {
                properties: [{
                    name: 'multipleBoolean',
                    values: [true],
                    ...baseFieldSet
                }]
            },
            formValues: {
                [sections[0].fieldSets[2].name + '_multipleBoolean']: [false, undefined]
            },
            ExpectedPropsToSave: [{
                language: 'fr',
                name: 'multipleBoolean',
                type: 'type',
                values: [false]
            }],
            expectedPropsFieldMapping: {
                multipleBoolean: sections[0].fieldSets[2].name + '_multipleBoolean'
            }
        },
        {
            name: 'date prop to save',
            nodeData: {
                properties: [{
                    name: 'date',
                    value: 'oldDate',
                    ...baseFieldSet
                }]
            },
            formValues: {
                [sections[0].fieldSets[2].name + '_date']: 'newDate'
            },
            ExpectedPropsToSave: [{
                language: 'fr',
                name: 'date',
                type: 'DATE',
                option: 'NOT_ZONED_DATE',
                value: 'newDate'
            }],
            expectedPropsFieldMapping: {
                date: sections[0].fieldSets[2].name + '_date'
            }
        },
        {
            name: 'multiple date prop to save',
            nodeData: {
                properties: [{
                    name: 'multipleDate',
                    values: ['oldDate'],
                    ...baseFieldSet
                }]
            },
            formValues: {
                [sections[0].fieldSets[2].name + '_multipleDate']: ['newDate', undefined]
            },
            ExpectedPropsToSave: [{
                language: 'fr',
                name: 'multipleDate',
                type: 'DATE',
                option: 'NOT_ZONED_DATE',
                values: ['newDate']
            }],
            expectedPropsFieldMapping: {
                multipleDate: sections[0].fieldSets[2].name + '_multipleDate'
            }
        },
        {
            name: 'decimal prop to save',
            nodeData: {
                properties: [{
                    name: 'decimal',
                    value: '1.2',
                    ...baseFieldSet
                }]
            },
            formValues: {
                [sections[0].fieldSets[2].name + '_decimal']: '1,3'
            },
            ExpectedPropsToSave: [{
                language: 'fr',
                name: 'decimal',
                type: 'DECIMAL',
                value: '1.3'
            }],
            expectedPropsFieldMapping: {
                decimal: sections[0].fieldSets[2].name + '_decimal'
            }
        },
        {
            name: 'multiple decimal prop to save',
            nodeData: {
                properties: [{
                    name: 'multipleDecimal',
                    values: ['1.2'],
                    ...baseFieldSet
                }]
            },
            formValues: {
                [sections[0].fieldSets[2].name + '_multipleDecimal']: ['1,3', undefined]
            },
            ExpectedPropsToSave: [{
                language: 'fr',
                name: 'multipleDecimal',
                type: 'DECIMAL',
                values: ['1.3']
            }],
            expectedPropsFieldMapping: {
                multipleDecimal: sections[0].fieldSets[2].name + '_multipleDecimal'
            }
        },
        {
            name: 'double prop to save',
            nodeData: {
                properties: [{
                    name: 'double',
                    value: '1.2',
                    ...baseFieldSet
                }]
            },
            formValues: {
                [sections[0].fieldSets[2].name + '_double']: '1,3'
            },
            ExpectedPropsToSave: [{
                language: 'fr',
                name: 'double',
                type: 'DOUBLE',
                value: '1.3'
            }],
            expectedPropsFieldMapping: {
                double: sections[0].fieldSets[2].name + '_double'
            }
        },
        {
            name: 'multiple double prop to save',
            nodeData: {
                properties: [{
                    name: 'multipleDouble',
                    values: ['1.2'],
                    ...baseFieldSet
                }]
            },
            formValues: {
                [sections[0].fieldSets[2].name + '_multipleDouble']: ['1,3', undefined]
            },
            ExpectedPropsToSave: [{
                language: 'fr',
                name: 'multipleDouble',
                type: 'DOUBLE',
                values: ['1.3']
            }],
            expectedPropsFieldMapping: {
                multipleDouble: sections[0].fieldSets[2].name + '_multipleDouble'
            }
        },
        {
            name: 'filter values according to modified props only (boolean)',
            nodeData: {
                properties: [{
                    name: 'prop',
                    value: 'old value',
                    ...baseFieldSet
                }, {
                    name: 'boolean',
                    value: false,
                    ...baseFieldSet
                }]
            },
            skipCreate: true,
            formValues: {
                [sections[0].fieldSets[2].name + '_prop']: 'new value',
                [sections[0].fieldSets[2].name + '_boolean']: false
            },
            ExpectedPropsToSave: [{
                language: 'fr',
                name: 'prop',
                type: 'type',
                value: 'new value'
            }],
            expectedPropsFieldMapping: {
                prop: sections[0].fieldSets[2].name + '_prop',
                boolean: sections[0].fieldSets[2].name + '_boolean'
            }
        },
        {
            name: 'should not return date props when not modified',
            nodeData: {
                properties: [{
                    name: 'multipleDate',
                    notZonedDateValues: ['date1', 'date2'],
                    ...baseFieldSet
                }, {
                    name: 'date',
                    notZonedDateValue: 'single-date',
                    ...baseFieldSet
                }]
            },
            skipCreate: true,
            formValues: {
                [sections[0].fieldSets[2].name + '_multipleDate']: ['date1', 'date2'],
                [sections[0].fieldSets[2].name + '_date']: 'single-date'
            },
            ExpectedPropsToSave: [],
            expectedPropsFieldMapping: {
                multipleDate: sections[0].fieldSets[2].name + '_multipleDate',
                date: sections[0].fieldSets[2].name + '_date'
            }
        },
        {
            name: 'should return date props when date added',
            nodeData: {
                properties: [{
                    name: 'multipleDate',
                    values: ['date1', 'date2'],
                    ...baseFieldSet
                }]
            },
            skipCreate: true,
            formValues: {
                [sections[0].fieldSets[2].name + '_multipleDate']: ['date1', 'date2', 'date3']
            },
            ExpectedPropsToSave: [{
                language: 'fr',
                name: 'multipleDate',
                type: 'DATE',
                option: 'NOT_ZONED_DATE',
                values: ['date1', 'date2', 'date3']
            }],
            expectedPropsFieldMapping: {
                multipleDate: sections[0].fieldSets[2].name + '_multipleDate'
            }
        },
        {
            name: 'should return date props when date props doesnt exist originally',
            nodeData: {
                properties: [],
                ...baseFieldSet
            },
            skipCreate: true,
            formValues: {
                [sections[0].fieldSets[2].name + '_multipleDate']: ['date1', 'date2', 'date3']
            },
            ExpectedPropsToSave: [{
                language: 'fr',
                name: 'multipleDate',
                type: 'DATE',
                option: 'NOT_ZONED_DATE',
                values: ['date1', 'date2', 'date3']
            }],
            expectedPropsFieldMapping: {
                multipleDate: sections[0].fieldSets[2].name + '_multipleDate'
            }
        },
        {
            name: 'filter values according to modified props only (array)',
            nodeData: {
                properties: [{
                    name: 'multipleDate',
                    values: ['old value'],
                    ...baseFieldSet
                }, {
                    name: 'multipleDecimal',
                    values: ['1.3', '1.1'],
                    ...baseFieldSet
                }]
            },
            skipCreate: true,
            formValues: {
                [sections[0].fieldSets[2].name + '_multipleDate']: ['new value'],
                [sections[0].fieldSets[2].name + '_multipleDecimal']: ['1.3', '1.1'],
                [sections[0].fieldSets[2].name + '_multiple']: ['new prop']
            },
            ExpectedPropsToSave: [{
                language: 'fr',
                name: 'multipleDate',
                type: 'DATE',
                option: 'NOT_ZONED_DATE',
                values: ['new value']
            }, {
                language: 'fr',
                name: 'multiple',
                type: 'type',
                values: ['new prop']
            }],
            expectedPropsFieldMapping: {
                multipleDate: sections[0].fieldSets[2].name + '_multipleDate',
                multipleDecimal: sections[0].fieldSets[2].name + '_multipleDecimal',
                multiple: sections[0].fieldSets[2].name + '_multiple'
            }
        }
    ];

    const lang = 'fr';

    describe('getDataToMutate', () => {
        testCases.forEach(({name, nodeData, formValues, ExpectedPropsToSave, ExpectedPropsToDelete, skipCreate, expectedPropsFieldMapping}) => {
            it(`Existing ${name}`, () => {
                const {propsToSave, propsToDelete, propFieldNameMapping} = getDataToMutate({nodeData, formValues, sections, lang, i18nContext: {}});
                expect(propsToSave).toEqual(ExpectedPropsToSave || []);
                expect(propsToDelete).toEqual(ExpectedPropsToDelete || []);
                expect(propFieldNameMapping).toEqual(expectedPropsFieldMapping || {});
            });
            if (!skipCreate) {
                it(`New ${name}`, () => {
                    const {propsToSave, propsToDelete, propFieldNameMapping} = getDataToMutate({formValues, sections, lang, i18nContext: {}});
                    expect(propsToSave).toEqual(ExpectedPropsToSave || []);
                    expect(propsToDelete).toEqual(ExpectedPropsToDelete || []);
                    expect(propFieldNameMapping).toEqual(expectedPropsFieldMapping || {});
                });
            }
        });
    });

    describe('getValuePropName', () => {
        it('should return the good value prop name based on the field', () => {
            expect(getValuePropName({multiple: true, requiredType: 'DATE'})).toEqual({
                name: 'values',
                option: 'NOT_ZONED_DATE'
            });

            expect(getValuePropName({multiple: false, requiredType: 'DATE'})).toEqual({
                name: 'value',
                option: 'NOT_ZONED_DATE'
            });

            expect(getValuePropName({multiple: true, requiredType: 'type'})).toEqual({name: 'values'});

            expect(getValuePropName({multiple: false, requiredType: 'type'})).toEqual({name: 'value'});

            expect(getValuePropName({
                multiple: true,
                requiredType: 'type',
                selectorOptions: [{
                    name: 'password'
                }]
            })).toEqual({name: 'values', option: 'ENCRYPTED'});

            expect(getValuePropName({
                multiple: false,
                requiredType: 'type',
                selectorOptions: [{
                    name: 'password'
                }]
            })).toEqual({name: 'value', option: 'ENCRYPTED'});

            expect(getValuePropName({
                multiple: false,
                requiredType: 'type',
                selectorOptions: [{
                    name: 'optionName'
                }]
            })).toEqual({name: 'value'});
        });
    });

    describe('checkIfValuesAreDifferent', () => {
        it('should return true if values are different, false otherwise', () => {
            expect(checkIfValuesAreDifferent(undefined, undefined, 'STRING')).toEqual(false);

            expect(checkIfValuesAreDifferent(false, true, 'BOOLEAN')).toEqual(true);

            expect(checkIfValuesAreDifferent('false', true, 'BOOLEAN')).toEqual(true);

            expect(checkIfValuesAreDifferent('false', false, 'BOOLEAN')).toEqual(false);

            expect(checkIfValuesAreDifferent('true', 'true', 'BOOLEAN')).toEqual(false);

            expect(checkIfValuesAreDifferent(1.1, 1.1, 'DECIMAL')).toEqual(false);

            expect(checkIfValuesAreDifferent(1.1, 1.2, 'DECIMAL')).toEqual(true);

            expect(checkIfValuesAreDifferent('first', 'second', 'STRING')).toEqual(true);

            expect(checkIfValuesAreDifferent('same', 'same', 'STRING')).toEqual(false);
        });
    });
});
