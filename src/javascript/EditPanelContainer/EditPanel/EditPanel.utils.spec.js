import {getPropertiesToSave} from './EditPanel.utils';

describe('EditPanel utils', () => {
    describe('getPropertiesToSave', () => {
        it('should return the properties', () => {
            const formValues = {
                fieldName: 'valueOfField'
            };
            const fields = [{
                formDefinition: {
                    name: 'fieldName'
                },
                jcrDefinition: {
                    requiredType: 'typeBG'
                }
            }];
            const lang = 'fr';

            const properties = getPropertiesToSave(formValues, fields, lang);

            expect(properties).toEqual([{
                language: 'fr',
                name: 'fieldName',
                type: 'typeBG',
                value: 'valueOfField'
            }]);
        });
    });
});
