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
    describe('getDataToMutate', () => {
        it('should return the properties', () => {
            const nodeData = {
                properties: [{
                    name: 'fieldToDelete',
                    value: 'will be deleted'
                }]
            };
            const formValues = {
                fieldToSave: 'will be saved',
                fieldToDelete: undefined,
                fieldToIgnore: undefined
            };
            const sections = [
                {
                    fieldSets: [
                        {
                            fields: [
                                {
                                    name: 'fieldToSave',
                                    requiredType: 'TYPE1',
                                    multiple: false
                                },
                                {
                                    name: 'fieldToDelete',
                                    requiredType: 'TYPE2',
                                    multiple: false
                                }
                            ]
                        }
                    ]
                }
            ];

            const lang = 'fr';

            const properties = getDataToMutate(nodeData, formValues, sections, lang);

            expect(properties.propsToSave).toEqual([{
                language: 'fr',
                name: 'fieldToSave',
                type: 'TYPE1',
                value: 'will be saved'
            }]);

            expect(properties.propsToDelete).toEqual(['fieldToDelete']);
        });

        it('should filtered undefined multiple values', function () {
            const nodeData = {
                properties: [{
                    name: 'multipleField',
                    value: []
                }]
            };
            const formValues = {
                multipleField: ['value1', undefined, 'value2']
            };
            const sections = [
                {
                    fieldSets: [
                        {
                            fields: [
                                {
                                    name: 'multipleField',
                                    requiredType: 'TYPE1',
                                    multiple: true
                                }
                            ]
                        }
                    ]
                }
            ];

            const lang = 'fr';

            const properties = getDataToMutate(nodeData, formValues, sections, lang);
            expect(properties.propsToSave[0].values).toEqual(['value1', 'value2']);
        });

        it('should use specific "notZonedDateValues" and "notZonedDateValue" property in case field is a DATE', function () {
            const nodeData = {
                properties: [{
                    name: 'dateField',
                    value: []
                }]
            };
            const formValues = {
                dateField: ['date1', 'date2']
            };
            const sections = [
                {
                    fieldSets: [
                        {
                            fields: [
                                {
                                    name: 'dateField',
                                    requiredType: 'DATE',
                                    multiple: true
                                }
                            ]
                        }
                    ]
                }
            ];

            const lang = 'fr';

            let properties = getDataToMutate(nodeData, formValues, sections, lang);
            expect(properties.propsToSave[0].notZonedDateValues).toEqual(['date1', 'date2']);
            expect(properties.propsToSave[0].values).toEqual(undefined);

            nodeData.properties[0].value = undefined;
            formValues.dateField = 'date1';
            sections[0].fieldSets[0].fields[0].multiple = false;

            properties = getDataToMutate(nodeData, formValues, sections, lang);
            expect(properties.propsToSave[0].notZonedDateValue).toEqual('date1');
            expect(properties.propsToSave[0].value).toEqual(undefined);
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
