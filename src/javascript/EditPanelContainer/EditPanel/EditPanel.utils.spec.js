import {getPropertiesToMutate} from './EditPanel.utils';

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
});
