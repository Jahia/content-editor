import {getPropertiesToMutate, encodeJCRPath, extractRangeConstraints, getAllFields} from './EditPanel.utils';

describe('EditPanel utils', () => {
    describe('getAllFields', () => {
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

            const fields = getAllFields(sections);

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
    describe('getPropertiesToMutate', () => {
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

            const properties = getPropertiesToMutate(nodeData, formValues, sections, lang);

            expect(properties.propsToSave).toEqual([{
                language: 'fr',
                name: 'fieldToSave',
                type: 'TYPE1',
                value: 'will be saved'
            }]);

            expect(properties.propsToDelete).toEqual(['fieldToDelete']);
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
