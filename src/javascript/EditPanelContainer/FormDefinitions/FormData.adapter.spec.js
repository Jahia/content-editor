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
                    fields: [
                        {
                            name: 'field1',
                            displayName: 'labelled',
                            selectorType: 'ContentPicker',
                            targets: [{name: 'metadata'}]
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

    describe('initialValues', () => {
        it('should return initialValues', () => {
            graphqlResponse.forms.editForm.fields = [];
            expect(adaptFormData(graphqlResponse, 'fr', t).initialValues).toEqual({});
        });

        xit('should extract initialValues from fields', () => {
            expect(adaptFormData(graphqlResponse, 'fr', t).initialValues).toEqual({field1: '2019-05-07T11:33:31.056'});
        });

        xit('should extract initialValues with selectorType own logic', () => {
            graphqlResponse.forms.editForm.fields[0].selectorType = 'Checkbox';
            expect(adaptFormData(graphqlResponse, 'fr', t).initialValues).toEqual({field1: false});
        });

        xit('should set values and no value as initialValue when multiple is at true', () => {
            graphqlResponse.forms.editForm.fields[0].multiple = true;
            graphqlResponse.jcr.result.properties[0].values = ['value1', 'value2'];
            expect(adaptFormData(graphqlResponse, 'fr', t).initialValues).toEqual({field1: ['value1', 'value2']});
        });

        xit('should not consider readOnly field that targeting metadata', () => {
            graphqlResponse.forms.editForm.fields[0].readOnly = true;
            expect(adaptFormData(graphqlResponse, 'fr', t).fields).toEqual([]);
            expect(adaptFormData(graphqlResponse, 'fr', t).initialValues).toEqual({});
        });
    });

    it('should add details object with data needed', () => {
        graphqlResponse.forms.editForm.fields[0].readOnly = true;
        expect(adaptFormData(graphqlResponse, 'fr', t).details).toEqual([
            {
                label: 'labelled',
                value: '2019-05-07T11:33:31.056'
            }
        ]);
    });

    it('should display the date according to user preference', () => {
        graphqlResponse.forms.editForm.fields[0].selectorType = 'DatePicker';
        graphqlResponse.forms.editForm.fields[0].readOnly = true;
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
