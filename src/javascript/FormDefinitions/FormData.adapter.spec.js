import {adaptSystemNameField} from './FormData.adapter';
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

    it('should adapt form system name i18n', () => {
        const nodeType = {
            name: 'jnt:news',
            displayName: 'News'
        };
        adaptSystemNameField(rawData, formData, null, t, nodeType, false);
        expect(formData.sections[1].fieldSets[0].displayName).toEqual('content-editor:label.contentEditor.section.fieldSet.system.displayName');
        expect(formData.sections[1].fieldSets[0].fields[0].displayName).toEqual('content-editor:label.contentEditor.section.fieldSet.system.fields.systemName');
        expect(formData.sections[1].fieldSets[0].fields[0].description).toEqual('content-editor:label.contentEditor.section.fieldSet.system.fields.systemNameDescription');
        expect(formData.sections[1].fieldSets[0].fields[0].readOnly).toEqual(false);
    });

    it('should set system name to readOnly when node is using mixin: jmix:systemNameReadonly and a custom message should be display as helper', () => {
        const nodeType = {
            name: 'jnt:news',
            displayName: 'News'
        };
        adaptSystemNameField(rawData, formData, null, t, nodeType, false, false, true);
        expect(formData.sections[1].fieldSets[0].fields[0].description).toEqual('content-editor:label.contentEditor.section.fieldSet.system.fields.systemNameDescriptionReadOnly');
        expect(formData.sections[1].fieldSets[0].fields[0].readOnly).toEqual(true);
    });

    it('should set system name to readOnly when Path is for the contents node', () => {
        const nodeType = {
            name: 'jnt:news',
            displayName: 'News'
        };
        formData.technicalInfo[2] = {label: 'Path', value: '/sites/digitall/contents'};
        adaptSystemNameField(rawData, formData, null, t, nodeType, false);
        expect(formData.sections[1].fieldSets[0].displayName).toEqual('content-editor:label.contentEditor.section.fieldSet.system.displayName');
        expect(formData.sections[1].fieldSets[0].fields[0].displayName).toEqual('content-editor:label.contentEditor.section.fieldSet.system.fields.systemName');
        expect(formData.sections[1].fieldSets[0].fields[0].readOnly).toEqual(true);
    });

    it('should set system name to readOnly when the user have not the write permission', () => {
        const nodeType = {
            name: 'jnt:news',
            displayName: 'News'
        };
        formData.nodeData.hasWritePermission = false;
        adaptSystemNameField(rawData, formData, null, t, nodeType, false);
        expect(formData.sections[1].fieldSets[0].displayName).toEqual('content-editor:label.contentEditor.section.fieldSet.system.displayName');
        expect(formData.sections[1].fieldSets[0].fields[0].displayName).toEqual('content-editor:label.contentEditor.section.fieldSet.system.fields.systemName');
        expect(formData.sections[1].fieldSets[0].fields[0].readOnly).toEqual(true);
    });

    it('should move system under jcr:title field if it exists', () => {
        const nodeType = {
            name: 'jnt:page',
            displayName: 'Page'
        };
        formData.sections[0].fieldSets.unshift({
            name: 'mix:title',
            fields: [{
                name: 'jcr:title'
            }]
        });
        adaptSystemNameField(rawData, formData, null, t, nodeType, false);
        expect(formData.sections[0].fieldSets[0].name).toEqual('mix:title');
        expect(formData.sections[0].fieldSets[0].fields[0].name).toEqual('jcr:title');
        expect(formData.sections[0].fieldSets[0].fields[1].name).toEqual(Constants.systemName.name);
        expect(formData.sections[1].fieldSets.length).toEqual(0);
    });

    it('should move system name to content section for some specific nodetypes', () => {
        const nodeType = {
            name: 'jnt:page',
            displayName: 'Page'
        };
        adaptSystemNameField(rawData, formData, null, t, nodeType, false, true);
        expect(formData.sections[0].fieldSets[0].name).toEqual('jnt:page');
        expect(formData.sections[0].fieldSets[0].displayName).toEqual('Page');
        expect(formData.sections[0].fieldSets[0].fields[0].name).toEqual(Constants.systemName.name);
        expect(formData.sections[1].fieldSets.length).toEqual(0);
    });

    it('should move system name to content section for some specific nodetypes, and create section if necessary', () => {
        formData.sections.splice(0, 1);
        const nodeType = {
            name: 'jnt:page',
            displayName: 'Page'
        };
        adaptSystemNameField(rawData, formData, null, t, nodeType, false, true);
        expect(formData.sections[0].name).toEqual('content');
        expect(formData.sections[0].fieldSets[0].name).toEqual('jnt:page');
        expect(formData.sections[0].fieldSets[0].displayName).toEqual('Page');
        expect(formData.sections[0].fieldSets[0].fields[0].name).toEqual(Constants.systemName.name);
        expect(formData.sections[1].fieldSets.length).toEqual(0);
    });

    it('should set system name readonly for some specific nodetypes', () => {
        const nodeType = {
            name: 'jnt:virtualsite',
            displayName: 'Site'
        };
        adaptSystemNameField(rawData, formData, null, t, nodeType, false);
        expect(formData.sections[1].fieldSets[0].fields[0].name).toEqual(Constants.systemName.name);
        expect(formData.sections[1].fieldSets[0].fields[0].readOnly).toEqual(true);
    });

    it('should set system name readonly when node is locked and cannot be edited', () => {
        const nodeType = {
            name: 'jnt:text',
            displayName: 'Text'
        };
        formData.nodeData.lockedAndCannotBeEdited = true;

        adaptSystemNameField(rawData, formData, null, t, nodeType, false);
        expect(formData.sections[1].fieldSets[0].fields[0].name).toEqual(Constants.systemName.name);
        expect(formData.sections[1].fieldSets[0].fields[0].readOnly).toEqual(true);
    });

    it('should set maximum name size validation according to DX prop: maxNameSize', () => {
        const nodeType = {
            name: 'jnt:news',
            displayName: 'News'
        };
        adaptSystemNameField(rawData, formData, null, t, nodeType, false);
        expect(formData.sections[1].fieldSets[0].fields[0].selectorOptions[0].name).toEqual('maxLength');
        expect(formData.sections[1].fieldSets[0].fields[0].selectorOptions[0].value).toEqual(50);
    });
});
