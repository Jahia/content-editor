import {
    encodeJCRPath,
    extractRangeConstraints,
    getFields,
    getDataToMutate,
    getDynamicFieldSets
} from './EditPanel.utils';

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
                    dynamic: true,
                    activated: false,
                    fields: []
                },
                {
                    dynamic: true,
                    activated: true,
                    fields: []
                },
                {
                    fields: [
                        {
                            name: 'prop',
                            requiredType: 'type',
                            multiple: false
                        },
                        {
                            name: 'multiple',
                            requiredType: 'type',
                            multiple: true
                        },
                        {
                            name: 'boolean',
                            requiredType: 'type',
                            multiple: false
                        },
                        {
                            name: 'multipleBoolean',
                            requiredType: 'type',
                            multiple: true
                        },
                        {
                            name: 'date',
                            requiredType: 'DATE',
                            multiple: false
                        },
                        {
                            name: 'multipleDate',
                            requiredType: 'DATE',
                            multiple: true
                        },
                        {
                            name: 'decimal',
                            requiredType: 'DECIMAL',
                            multiple: false
                        },
                        {
                            name: 'multipleDecimal',
                            requiredType: 'DECIMAL',
                            multiple: true
                        },
                        {
                            name: 'double',
                            requiredType: 'DOUBLE',
                            multiple: false
                        },
                        {
                            name: 'multipleDouble',
                            requiredType: 'DOUBLE',
                            multiple: true
                        },
                        {
                            name: 'readOnly',
                            requiredType: 'type',
                            readOnly: true,
                            multiple: false
                        }
                    ]
                }
            ]
        }
    ];

    const testCases = [
        {
            name: 'prop to save',
            nodeData: {
                properties: [{
                    name: 'prop',
                    value: 'old value'
                }]
            },
            formValues: {
                prop: 'new value'
            },
            ExpectedPropsToSave: [{
                language: 'fr',
                name: 'prop',
                type: 'type',
                value: 'new value'
            }]
        },
        {
            name: 'empty prop',
            skipCreate: true,
            nodeData: {
                properties: [{
                    name: 'prop',
                    value: 'old value'
                }]
            },
            formValues: {
                prop: ''
            },
            ExpectedPropsToDelete: ['prop']
        },
        {
            name: 'null prop',
            skipCreate: true,
            nodeData: {
                properties: [{
                    name: 'prop',
                    value: 'old value'
                }]
            },
            formValues: {
                prop: null
            },
            ExpectedPropsToDelete: ['prop']
        },
        {
            name: 'undefined prop',
            skipCreate: true,
            nodeData: {
                properties: [{
                    name: 'prop',
                    value: 'old value'
                }]
            },
            formValues: {
                prop: undefined
            },
            ExpectedPropsToDelete: ['prop']
        },
        {
            name: 'Read only prop to save',
            nodeData: {
                properties: [{
                    name: 'readOnly',
                    value: 'old value'
                }]
            },
            formValues: {
                readOnly: 'new value'
            }
        },
        {
            name: 'multiple prop to save',
            nodeData: {
                properties: [{
                    name: 'multiple',
                    values: ['old value']
                }]
            },
            formValues: {
                multiple: ['new value', undefined]
            },
            ExpectedPropsToSave: [{
                language: 'fr',
                name: 'multiple',
                type: 'type',
                values: ['new value']
            }]
        },
        {
            name: 'boolean prop to save',
            nodeData: {
                properties: [{
                    name: 'boolean',
                    value: true
                }]
            },
            formValues: {
                boolean: false
            },
            ExpectedPropsToSave: [{
                language: 'fr',
                name: 'boolean',
                type: 'type',
                value: false
            }]
        },
        {
            name: 'multiple boolean prop to save',
            nodeData: {
                properties: [{
                    name: 'multipleBoolean',
                    value: [true]
                }]
            },
            formValues: {
                multipleBoolean: [false, undefined]
            },
            ExpectedPropsToSave: [{
                language: 'fr',
                name: 'multipleBoolean',
                type: 'type',
                values: [false]
            }]
        },
        {
            name: 'date prop to save',
            nodeData: {
                properties: [{
                    name: 'date',
                    value: 'oldDate'
                }]
            },
            formValues: {
                date: 'newDate'
            },
            ExpectedPropsToSave: [{
                language: 'fr',
                name: 'date',
                type: 'DATE',
                notZonedDateValue: 'newDate'
            }]
        },
        {
            name: 'multiple date prop to save',
            nodeData: {
                properties: [{
                    name: 'multipleDate',
                    value: ['oldDate']
                }]
            },
            formValues: {
                multipleDate: ['newDate', undefined]
            },
            ExpectedPropsToSave: [{
                language: 'fr',
                name: 'multipleDate',
                type: 'DATE',
                notZonedDateValues: ['newDate']
            }]
        },
        {
            name: 'decimal prop to save',
            nodeData: {
                properties: [{
                    name: 'decimal',
                    value: '1.2'
                }]
            },
            formValues: {
                decimal: '1,3'
            },
            ExpectedPropsToSave: [{
                language: 'fr',
                name: 'decimal',
                type: 'DECIMAL',
                value: '1.3'
            }]
        },
        {
            name: 'multiple decimal prop to save',
            nodeData: {
                properties: [{
                    name: 'multipleDecimal',
                    value: ['1.2']
                }]
            },
            formValues: {
                multipleDecimal: ['1,3', undefined]
            },
            ExpectedPropsToSave: [{
                language: 'fr',
                name: 'multipleDecimal',
                type: 'DECIMAL',
                values: ['1.3']
            }]
        },
        {
            name: 'double prop to save',
            nodeData: {
                properties: [{
                    name: 'double',
                    value: '1.2'
                }]
            },
            formValues: {
                double: '1,3'
            },
            ExpectedPropsToSave: [{
                language: 'fr',
                name: 'double',
                type: 'DOUBLE',
                value: '1.3'
            }]
        },
        {
            name: 'multiple double prop to save',
            nodeData: {
                properties: [{
                    name: 'multipleDouble',
                    value: ['1.2']
                }]
            },
            formValues: {
                multipleDouble: ['1,3', undefined]
            },
            ExpectedPropsToSave: [{
                language: 'fr',
                name: 'multipleDouble',
                type: 'DOUBLE',
                values: ['1.3']
            }]
        },
        {
            name: 'filter values according to initialValues (boolean)',
            nodeData: {
                properties: [{
                    name: 'prop',
                    value: 'old value'
                }, {
                    name: 'boolean',
                    value: false
                }]
            },
            skipCreate: true,
            formValues: {
                prop: 'new value',
                boolean: false
            },
            initialValues: {
                prop: 'old value',
                boolean: false
            },
            ExpectedPropsToSave: [{
                language: 'fr',
                name: 'prop',
                type: 'type',
                value: 'new value'
            }]
        },
        {
            name: 'filter values according to initialValues (array)',
            nodeData: {
                properties: [{
                    name: 'multipleDate',
                    value: ['old value']
                }, {
                    name: 'multipleDecimal',
                    value: ['1.3', '1.1']
                }]
            },
            skipCreate: true,
            formValues: {
                multipleDate: ['new value'],
                multipleDecimal: ['1.3', '1.1']
            },
            initialValues: {
                multipleDate: ['old value'],
                multipleDecimal: ['1.3', '1.1']
            },
            ExpectedPropsToSave: [{
                language: 'fr',
                name: 'multipleDate',
                type: 'DATE',
                notZonedDateValues: ['new value']
            }]
        }
    ];

    const lang = 'fr';

    describe('getDataToMutate', () => {
        testCases.forEach(({name, nodeData, formValues, ExpectedPropsToSave, ExpectedPropsToDelete, skipCreate, initialValues}) => {
            it(`Existing ${name}`, () => {
                const {propsToSave, propsToDelete} = getDataToMutate({nodeData, formValues, sections, lang, initialValues});
                expect(propsToSave).toEqual(ExpectedPropsToSave || []);
                expect(propsToDelete).toEqual(ExpectedPropsToDelete || []);
            });
            if (!skipCreate) {
                it(`New ${name}`, () => {
                    const {propsToSave, propsToDelete} = getDataToMutate({formValues, sections, lang});
                    expect(propsToSave).toEqual(ExpectedPropsToSave || []);
                    expect(propsToDelete).toEqual(ExpectedPropsToDelete || []);
                });
            }
        });
    });

    describe('encodeJCRPath', () => {
        it('should encode jcr path', () => {
            [
                {
                    input: '/aa/bb#bb/cc',
                    result: '/aa/bb%23bb/cc'
                },
                {
                    input: '/aa/bb/cc',
                    result: '/aa/bb/cc'
                },
                {
                    input: '/;,%2F?:@&=+$/-_.!~*\'()/#/ABC abc 123',
                    result: '/%3B%2C%252F%3F%3A%40%26%3D%2B%24/-_.!~*\'()/%23/ABC%20abc%20123'
                }
            ].forEach(test => expect(encodeJCRPath(test.input)).toEqual(test.result));
        });
    });
    describe('extractRangeConstraints', () => {
        it('should extract range constraints', () => {
            const toTest = [
                {
                    entry: '(a,b)', result: {
                        lowerBoundary: 'a',
                        disableLowerBoundary: true,
                        upperBoundary: 'b',
                        disableUpperBoundary: true
                    }
                },
                {
                    entry: '(a,b]', result: {
                        lowerBoundary: 'a',
                        disableLowerBoundary: true,
                        upperBoundary: 'b',
                        disableUpperBoundary: false
                    }
                },
                {
                    entry: '[a,b)', result: {
                        lowerBoundary: 'a',
                        disableLowerBoundary: false,
                        upperBoundary: 'b',
                        disableUpperBoundary: true
                    }
                },
                {
                    entry: '[a,b]', result: {
                        lowerBoundary: 'a',
                        disableLowerBoundary: false,
                        upperBoundary: 'b',
                        disableUpperBoundary: false
                    }
                }
            ];
            toTest.forEach(test => expect(extractRangeConstraints(test.entry)).toEqual(test.result));
        });
    });
});
