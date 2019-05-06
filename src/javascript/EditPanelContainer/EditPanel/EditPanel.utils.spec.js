import {getPropertiesToMutate, encodeJCRPath} from './EditPanel.utils';

describe('EditPanel utils', () => {
    describe('getPropertiesToSave', () => {
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
            const fields = [{
                formDefinition: {
                    name: 'fieldToSave',
                    multiple: false
                },
                jcrDefinition: {
                    requiredType: 'typeBG'
                }
            },
            {
                formDefinition: {
                    name: 'fieldToDelete',
                    multiple: false
                },
                jcrDefinition: {
                    requiredType: 'typeBG'
                }
            },
            {
                formDefinition: {
                    name: 'fieldToIgnore',
                    multiple: false
                },
                jcrDefinition: {
                    requiredType: 'typeBG'
                }
            }];
            const lang = 'fr';

            const properties = getPropertiesToMutate(nodeData, formValues, fields, lang);

            expect(properties.propsToSave).toEqual([{
                language: 'fr',
                name: 'fieldToSave',
                type: 'typeBG',
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
});
