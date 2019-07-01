import {adaptFormData} from './FormData.adapter';

jest.mock('../EditPanel/EditPanelContent/FormBuilder/SelectorTypes/SelectorTypes', () => {
    return {
        resolveSelectorType: key => {
            if (key === 'Checkbox') {
                return {
                    formatValue: value => {
                        return value === 'true'; // Value from JCR GraphQL API is a String
                    }
                };
            }
        }
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
                        {name: 'field1', properties: true, value: '2019-05-07T11:33:31.056+02:00'}
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

    it('should return fields', () => {
        graphqlResponse.forms.editForm.fields = [];
        expect(adaptFormData(graphqlResponse, 'fr', t).fields).toEqual([]);
    });

    it('should return initialValues', () => {
        graphqlResponse.forms.editForm.fields = [];
        expect(adaptFormData(graphqlResponse, 'fr', t).initialValues).toEqual({});
    });

    it('should adapt fields by creating big object', () => {
        expect(adaptFormData(graphqlResponse, 'fr', t).fields).toEqual([{
            targets: [{name: 'metadata'}],
            formDefinition: {
                displayName: 'labelled',
                name: 'field1',
                targets: [{name: 'metadata'}],
                selectorType: 'ContentPicker'
            },
            jcrDefinition: {
                name: 'field1',
                primaryNodeType: true
            },
            data: {
                name: 'field1',
                properties: true,
                value: '2019-05-07T11:33:31.056+02:00'
            }
        }]);
    });

    it('should extract initialValues from fields', () => {
        expect(adaptFormData(graphqlResponse, 'fr', t).initialValues).toEqual({field1: '2019-05-07T11:33:31.056+02:00'});
    });

    it('should extract initialValues with selectorType own logic', () => {
        graphqlResponse.forms.editForm.fields[0].selectorType = 'Checkbox';
        expect(adaptFormData(graphqlResponse, 'fr', t).initialValues).toEqual({field1: false});
    });

    it('should not consider readOnly field that targeting metadata', () => {
        graphqlResponse.forms.editForm.fields[0].readOnly = true;
        expect(adaptFormData(graphqlResponse, 'fr', t).fields).toEqual([]);
        expect(adaptFormData(graphqlResponse, 'fr', t).initialValues).toEqual({});
    });

    it('should add details object with data needed', () => {
        graphqlResponse.forms.editForm.fields[0].readOnly = true;
        expect(adaptFormData(graphqlResponse, 'fr', t).details).toEqual([
            {
                label: 'labelled',
                value: '2019-05-07T11:33:31.056+02:00'
            }
        ]);
    });

    it('should display the date according to user preference', () => {
        graphqlResponse.forms.editForm.fields[0].selectorType = 'DatePicker';
        graphqlResponse.forms.editForm.fields[0].readOnly = true;
        expect(adaptFormData(graphqlResponse, 'fr', t).details).toEqual([
            {
                label: 'labelled',
                value: '07/05/2019 11:33'
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
