import {adaptSystemNameField} from './FormData.adapter';

const t = val => val;

describe('adaptFormData', () => {
    it('should adapt form system name i18n', () => {
        let formData = {
            sections: [
                {
                    name: 'options',
                    fieldSets: [
                        {
                            name: 'nt:base',
                            fields: [
                                {
                                    name: 'ce:systemName'
                                }
                            ]
                        }
                    ]
                }
            ]
        };
        adaptSystemNameField(null, formData, null, t);
        expect(formData.sections[0].fieldSets[0].displayName).toEqual('content-editor:label.contentEditor.section.fieldSet.system.displayName');
        expect(formData.sections[0].fieldSets[0].fields[0].displayName).toEqual('content-editor:label.contentEditor.section.fieldSet.system.fields.systemName');
    });
});
