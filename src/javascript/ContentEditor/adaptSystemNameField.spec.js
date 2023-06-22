import {adaptSystemNameField} from './adaptSystemNameField';
import {Constants} from '~/ContentEditor.constants';

const t = val => val;

describe('adaptFormData', () => {
    let formData;
    let rawData;
    beforeEach(() => {
        window.contextJsParameters = {
            config: {
                maxNameSize: 50
            }
        };

        formData = {
            initialValues: [],
            sections: [
                {
                    name: 'content',
                    fieldSets: [
                        {
                            name: 'jnt:news',
                            fields: []
                        }
                    ]
                },
                {
                    name: 'options',
                    fieldSets: [
                        {
                            name: 'nt:base',
                            fields: [
                                {
                                    name: Constants.systemName.name,
                                    propertyName: Constants.systemName.propertyName,
                                    readOnly: false,
                                    selectorOptions: [{
                                        name: 'description-i18n-key',
                                        value: 'content-editor:label.section.fieldSet.fields.systemNameDescription'
                                    }]
                                }
                            ]
                        }
                    ]
                }
            ],
            nodeData: {
                hasWritePermission: true
            },
            technicalInfo: [
                {label: 'Main content type', value: 'Folder'},
                {label: 'Full content type', value: 'jnt:folder'},
                {label: 'Path', value: '/sites/digitall/toto'},
                {label: 'UUID', value: '1c5ec63b-efa8-4e28-abb7-e60026cb8e3e'}
            ]
        };

        rawData = {
            jcr: {
                result: {
                    newName: 'newName',
                    name: 'name'
                }
            }
        };
    });

    it('sets labels and initial data correctly', () => {
        adaptSystemNameField(rawData, formData, t, 'nt:any', false, true);
        expect(formData.sections[1].fieldSets[0].fields[0].displayName).toEqual('content-editor:label.contentEditor.section.fieldSet.system.fields.systemName');
        expect(formData.initialValues[Constants.systemName.name]).toEqual(rawData.jcr.result.name);

        adaptSystemNameField(rawData, formData, t, 'nt:any', true, true);
        expect(formData.initialValues[Constants.systemName.name]).toEqual(rawData.jcr.result.newName);
    });
});
