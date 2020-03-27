import {adaptSystemNameField} from './FormData.adapter';

const t = val => val;

describe('adaptFormData', () => {
    let formData;
    beforeEach(() => {
        formData = {
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
                                    name: 'ce:systemName',
                                    readOnly: false
                                }
                            ]
                        }
                    ]
                }
            ]
        };
    });

    it('should adapt form system name i18n', () => {
        const nodeType = {
            name: 'jnt:news',
            displayName: 'News'
        };
        adaptSystemNameField(null, formData, null, t, nodeType);
        expect(formData.sections[1].fieldSets[0].displayName).toEqual('content-editor:label.contentEditor.section.fieldSet.system.displayName');
        expect(formData.sections[1].fieldSets[0].fields[0].displayName).toEqual('content-editor:label.contentEditor.section.fieldSet.system.fields.systemName');
        expect(formData.sections[1].fieldSets[0].fields[0].readOnly).toEqual(false);
    });

    it('should move system name to content section for some specific nodetypes', () => {
        const nodeType = {
            name: 'jnt:page',
            displayName: 'Page'
        };
        adaptSystemNameField(null, formData, null, t, nodeType);
        expect(formData.sections[0].fieldSets[0].name).toEqual('jnt:page');
        expect(formData.sections[0].fieldSets[0].displayName).toEqual('Page');
        expect(formData.sections[0].fieldSets[0].fields[0].name).toEqual('ce:systemName');
        expect(formData.sections[1].fieldSets.length).toEqual(0);
    });

    it('should move system name to content section for some specific nodetypes, and create section if necessary', () => {
        formData.sections.splice(0, 1);
        const nodeType = {
            name: 'jnt:page',
            displayName: 'Page'
        };
        adaptSystemNameField(null, formData, null, t, nodeType);
        expect(formData.sections[0].name).toEqual('content');
        expect(formData.sections[0].fieldSets[0].name).toEqual('jnt:page');
        expect(formData.sections[0].fieldSets[0].displayName).toEqual('Page');
        expect(formData.sections[0].fieldSets[0].fields[0].name).toEqual('ce:systemName');
        expect(formData.sections[1].fieldSets.length).toEqual(0);
    });

    it('should set system name readonly for some specific nodetypes', () => {
        const nodeType = {
            name: 'jnt:virtualsite',
            displayName: 'Site'
        };
        adaptSystemNameField(null, formData, null, t, nodeType);
        expect(formData.sections[1].fieldSets[0].fields[0].name).toEqual('ce:systemName');
        expect(formData.sections[1].fieldSets[0].fields[0].readOnly).toEqual(true);
    });
});
