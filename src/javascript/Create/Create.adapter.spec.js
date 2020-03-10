import {adaptCreateFormData} from './Create.adapter';

jest.mock('~/EditPanel/EditPanelContent/FormBuilder/Section/FieldSet/Field/SelectorTypes/SelectorTypes.utils', () => {
    return {
        resolveSelectorType: ({selectorType}) => {
            if (selectorType === 'Checkbox') {
                return {
                    adaptValue: (field, property) => {
                        return field.multiple ? property.values.map(value => value === 'true') : property.value === 'true';
                    }
                };
            }

            return {};
        }
    };
});

jest.mock('~/date.config', () => {
    return date => {
        return {
            locale() {
                return {
                    format(format) {
                        return `formatted date: ${date} format: ${format}`;
                    }
                };
            }
        };
    };
});

const t = val => val;

describe('adaptCreateFormData', () => {
    let graphqlResponse;
    beforeEach(() => {
        graphqlResponse = {
            forms: {
                createForm: {
                    sections: [
                        {
                            fieldSets: [
                                {
                                    fields: [
                                        {
                                            name: 'field1',
                                            displayName: 'labelled',
                                            selectorType: 'ContentPicker',
                                            currentValues: [
                                                {
                                                    string: '2019-05-07T11:33:31.056'
                                                }
                                            ]
                                        },
                                        {
                                            name: 'field2',
                                            displayName: 'labelled2',
                                            selectorType: 'ContentPicker',
                                            defaultValues: [
                                                {
                                                    string: '2019-05-07T11:33:31.056'
                                                }
                                            ]
                                        },
                                        {
                                            name: 'multipleField2',
                                            displayName: 'labelled2',
                                            selectorType: 'ContentPicker',
                                            multiple: true,
                                            defaultValues: [
                                                {
                                                    string: '2019-05-07T11:33:31.056'
                                                },
                                                {
                                                    string: '2015-05-07T11:33:31.056'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            },
            jcr: {
                result: {
                    uuid: 'uuid1',
                    path: '/site/digitall/home',
                    displayName: 'nameOfNode',
                    primaryNodeType: {
                        displayName: 'ContentType',
                        name: 'jcr:contentType',
                        hasOrderableChildNodes: false,
                        properties: [
                            {name: 'field1', primaryNodeType: true},
                            {name: 'field2', primaryNodeType: true},
                            {name: 'multipleField2', primaryNodeType: true}
                        ]
                    },
                    mixinTypes: [
                        {name: 'Mixin1'},
                        {name: 'Mixin2'}
                    ],
                    lockInfo: {
                        details: []
                    },
                    children: {
                        nodes: []
                    }
                }
            }
        };
    });

    it('should extract initialValues using default values', () => {
        // Delete properties
        const adaptedData = adaptCreateFormData(graphqlResponse, 'fr', t);
        expect(adaptedData.sections).toEqual(graphqlResponse.forms.createForm.sections);
        expect(adaptedData.details).toEqual({});
        expect(adaptedData.technicalInfo).toEqual({});

        expect(adaptedData.initialValues.field1).toEqual(undefined);
        expect(adaptedData.initialValues.field2).toEqual('2019-05-07T11:33:31.056');
        expect(adaptedData.initialValues.multipleField2).toEqual(['2019-05-07T11:33:31.056', '2015-05-07T11:33:31.056']);
    });

    it('should extract initialValues with selectorType own logic', () => {
        graphqlResponse.forms.createForm.sections[0].fieldSets[0].fields[1].selectorType = 'Checkbox';
        const initialValues = adaptCreateFormData(graphqlResponse, 'fr', t).initialValues;

        expect(initialValues.field1).toEqual(undefined);
        expect(initialValues.field2).toEqual(false);
    });
});
