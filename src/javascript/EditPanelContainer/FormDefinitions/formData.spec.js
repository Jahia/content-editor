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

describe('adaptFormData', () => {
    let graphqlResponse;
    beforeEach(() => {
        graphqlResponse = {
            forms: {
                editForm: {
                    fields: [
                        {
                            name: 'field1',
                            targets: [{name: 'metadata'}],
                            selectorType: 'DatePicker'
                        }
                    ]
                }
            },
            jcr: {
                result: {
                    primaryNodeType: {
                        properties: [
                            {name: 'field1', primaryNodeType: true}
                        ]
                    },
                    properties: [
                        {name: 'field1', properties: true, value: 'yolo'}
                    ]
                }
            }
        };
    });

    it('should return nodeData', () => {
        expect(adaptFormData(graphqlResponse).nodeData).toBe(graphqlResponse.jcr.result);
    });

    it('should return fields', () => {
        graphqlResponse.forms.editForm.fields = [];
        expect(adaptFormData(graphqlResponse).fields).toEqual([]);
    });

    it('should return initialValues', () => {
        graphqlResponse.forms.editForm.fields = [];
        expect(adaptFormData(graphqlResponse).initialValues).toEqual({});
    });

    it('should adapt fields by creating big object', () => {
        expect(adaptFormData(graphqlResponse).fields).toEqual([{
            targets: [{name: 'metadata'}],
            formDefinition: {
                name: 'field1',
                targets: [{name: 'metadata'}],
                selectorType: 'DatePicker'
            },
            jcrDefinition: {
                name: 'field1',
                primaryNodeType: true
            },
            data: {
                name: 'field1',
                properties: true,
                value: 'yolo'
            }
        }]);
    });

    it('should extract initialValues from fields', () => {
        expect(adaptFormData(graphqlResponse).initialValues).toEqual({field1: 'yolo'});
    });

    it('should extract initialValues with selectorType own logic', () => {
        graphqlResponse.forms.editForm.fields[0].selectorType = 'Checkbox';
        expect(adaptFormData(graphqlResponse).initialValues).toEqual({field1: false});
    });

    it('should not consider readOnly field that targeting metadata', () => {
        graphqlResponse.forms.editForm.fields[0].readOnly = true;
        expect(adaptFormData(graphqlResponse).fields).toEqual([]);
        expect(adaptFormData(graphqlResponse).initialValues).toEqual({});
    });

    it('should add details object with data needed', () => {
        graphqlResponse.forms.editForm.fields[0].readOnly = true;
        expect(adaptFormData(graphqlResponse).details).toEqual([
            {
                name: 'field1',
                value: 'yolo'
            }
        ]);
    });
});
