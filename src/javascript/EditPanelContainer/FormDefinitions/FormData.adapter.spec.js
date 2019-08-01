import {adaptFormData} from './FormData.adapter';

jest.mock('../EditPanel/EditPanelContent/FormBuilder/Section/FieldSet/Field/SelectorTypes/SelectorTypes.utils', () => {
    return {
        resolveSelectorType: ({selectorType}) => {
            if (selectorType === 'Checkbox') {
                return {
                    formatValue: value => {
                        return value === 'true'; // Value from JCR GraphQL API is a String
                    }
                };
            }
        }
    };
});

jest.mock('../../date.config', () => {
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

describe('adaptFormData', () => {
    let graphqlResponse;
    beforeEach(() => {
        graphqlResponse = {
            forms: {
                editForm: {
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
                    primaryNodeType: {
                        displayName: 'ContentType',
                        properties: [
                            {name: 'field1', primaryNodeType: true}
                        ]
                    },
                    properties: [
                        {name: 'field1', properties: true, value: '2019-05-07T11:33:31.056'}
                    ],
                    mixinTypes: [
                        {name: 'Mixin1'},
                        {name: 'Mixin2'}
                    ]
                }
            }
        };
    });

    it('should return nodeData', () => {
        expect(adaptFormData(graphqlResponse, 'fr', t).nodeData).toBe(graphqlResponse.jcr.result);
    });

    it('should return initialValues', () => {
        graphqlResponse.forms.editForm.sections = [];
        expect(adaptFormData(graphqlResponse, 'fr', t).initialValues).toEqual({});
    });

    it('should extract initialValues from fields', () => {
        const initialValues = adaptFormData(graphqlResponse, 'fr', t).initialValues;

        expect(initialValues).toEqual({field1: '2019-05-07T11:33:31.056'});
    });

    it('should extract initialValues with selectorType own logic', () => {
        graphqlResponse.forms.editForm.sections[0].fieldSets[0].fields[0].selectorType = 'Checkbox';
        const initialValues = adaptFormData(graphqlResponse, 'fr', t).initialValues;

        expect(initialValues).toEqual({field1: false});
    });

    it('should set values and no value as initialValue when multiple is at true', () => {
        graphqlResponse.forms.editForm.sections[0].fieldSets[0].fields[0].multiple = true;
        graphqlResponse.forms.editForm.sections[0].fieldSets[0].fields[0].currentValues = [
            {string: 'value1'},
            {string: 'value2'}
        ];

        const initialValues = adaptFormData(graphqlResponse, 'fr', t).initialValues;

        expect(initialValues).toEqual({
            field1: [
                {string: 'value1'},
                {string: 'value2'}
            ]
        });
    });

    it('should add details object with data needed', () => {
        graphqlResponse.forms.editForm.sections[0].name = 'metadata';
        graphqlResponse.forms.editForm.sections[0].fieldSets[0].fields[0].readOnly = true;
        expect(adaptFormData(graphqlResponse, 'fr', t).details).toEqual([
            {
                label: 'labelled',
                value: '2019-05-07T11:33:31.056'
            }
        ]);
    });

    it('should display the date according to user preference', () => {
        graphqlResponse.forms.editForm.sections[0].name = 'metadata';
        graphqlResponse.forms.editForm.sections[0].fieldSets[0].fields[0].selectorType = 'DatePicker';
        graphqlResponse.forms.editForm.sections[0].fieldSets[0].fields[0].readOnly = true;
        expect(adaptFormData(graphqlResponse, 'fr', t).details).toEqual([
            {
                label: 'labelled',
                value: 'formatted date: 2019-05-07T11:33:31.056 format: L HH:mm'
            }
        ]);
    });

    it('should add technicalInfo object', () => {
        expect(adaptFormData(graphqlResponse, 'fr', t).technicalInfo).toEqual([
            {
                label: 'content-editor:label.contentEditor.details.contentType',
                value: 'ContentType'
            },
            {
                label: 'content-editor:label.contentEditor.details.mixinTypes',
                value: 'Mixin1; Mixin2'
            },
            {
                label: 'content-editor:label.contentEditor.details.path',
                value: '/site/digitall/home'
            },
            {
                label: 'content-editor:label.contentEditor.details.uuid',
                value: 'uuid1'
            }
        ]);
    });
});
