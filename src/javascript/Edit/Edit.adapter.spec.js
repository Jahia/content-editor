import {adaptEditFormData, adaptSaveRequest} from './Edit.adapter';
import {Constants} from '~/ContentEditor.constants';

jest.mock('~/SelectorTypes', () => {
    return {
        resolveSelectorType: ({selectorType}) => {
            if (selectorType === 'Checkbox') {
                return {
                    adaptValue: (field, property) => {
                        return field.multiple ? property.values.map(value => value === 'true') : property.value === 'true';
                    }
                };
            }

            return {};
        }
    };
});

jest.mock('~/date.config', () => {
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

describe('adaptEditFormData', () => {
    let graphqlResponse;
    beforeEach(() => {
        graphqlResponse = {
            forms: {
                editForm: {
                    sections: [
                        {
                            fieldSets: [
                                {
                                    fields: [
                                        {
                                            name: 'field1',
                                            displayName: 'labelled',
                                            selectorType: 'ContentPicker',
                                            currentValues: [
                                                {
                                                    string: '2019-05-07T11:33:31.056'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            },
            jcr: {
                result: {
                    uuid: 'uuid1',
                    path: '/site/digitall/home',
                    displayName: 'nameOfNode',
                    primaryNodeType: {
                        displayName: 'ContentType',
                        name: 'jcr:contentType',
                        hasOrderableChildNodes: false,
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
                    ],
                    lockInfo: {
                        details: []
                    },
                    children: {
                        nodes: []
                    },
                    wipInfo: {
                        status: 'DISABLED',
                        languages: []
                    }
                }
            }
        };
    });

    it('should return initialValues', () => {
        graphqlResponse.forms.editForm.sections = [];
        const initialValues = adaptEditFormData(graphqlResponse, 'fr', t).initialValues;
        expect(initialValues).toEqual({
            'WIP::Info': {
                status: 'DISABLED',
                languages: []
            }});
    });

    it('should extract initialValues from fields', () => {
        const adaptedForm = adaptEditFormData(graphqlResponse, 'fr', t);

        expect(adaptedForm.initialValues).toEqual({field1: '2019-05-07T11:33:31.056',
            'WIP::Info': {
                status: 'DISABLED',
                languages: []
            }});
    });

    it('should extract initialValues with selectorType own logic', () => {
        graphqlResponse.forms.editForm.sections[0].fieldSets[0].fields[0].selectorType = 'Checkbox';
        const initialValues = adaptEditFormData(graphqlResponse, 'fr', t).initialValues;

        expect(initialValues).toEqual({field1: false,
            'WIP::Info': {
                status: 'DISABLED',
                languages: []
            }});
    });

    it('should set values and no value as initialValue when multiple is at true', () => {
        graphqlResponse.forms.editForm.sections[0].fieldSets[0].fields[0].multiple = true;
        graphqlResponse.jcr.result.properties = [{
            name: 'field1',
            values: ['value1', 'value2']
        }];

        const initialValues = adaptEditFormData(graphqlResponse, 'fr', t).initialValues;

        expect(initialValues).toEqual({
            field1: ['value1', 'value2'],
            'WIP::Info': {
                status: 'DISABLED',
                languages: []
            }
        });
    });

    it('should add details object with data needed', () => {
        graphqlResponse.forms.editForm.sections[0].name = 'metadata';
        graphqlResponse.forms.editForm.sections[0].fieldSets[0].fields[0].name = 'jcr:created';
        graphqlResponse.jcr.result.properties[0].name = 'jcr:created';
        expect(adaptEditFormData(graphqlResponse, 'fr', t).details).toEqual([
            {
                label: 'labelled',
                value: '2019-05-07T11:33:31.056'
            }
        ]);
    });

    it('should display the date according to user preference', () => {
        graphqlResponse.forms.editForm.sections[0].name = 'metadata';
        graphqlResponse.forms.editForm.sections[0].fieldSets[0].fields[0].selectorType = 'DatePicker';
        graphqlResponse.forms.editForm.sections[0].fieldSets[0].fields[0].name = 'jcr:lastModified';
        graphqlResponse.jcr.result.properties[0].name = 'jcr:lastModified';
        expect(adaptEditFormData(graphqlResponse, 'fr', t).details).toEqual([
            {
                label: 'labelled',
                value: 'formatted date: 2019-05-07T11:33:31.056 format: L HH:mm'
            }
        ]);
    });

    it('should add technicalInfo object', () => {
        expect(adaptEditFormData(graphqlResponse, 'fr', t).technicalInfo).toEqual([
            {
                label: 'content-editor:label.contentEditor.edit.advancedOption.technicalInformation.contentType',
                value: 'ContentType'
            },
            {
                label: 'content-editor:label.contentEditor.edit.advancedOption.technicalInformation.mixinTypes',
                value: 'jcr:contentType; Mixin1; Mixin2'
            },
            {
                label: 'content-editor:label.contentEditor.edit.advancedOption.technicalInformation.path',
                value: '/site/digitall/home'
            },
            {
                label: 'content-editor:label.contentEditor.edit.advancedOption.technicalInformation.uuid',
                value: 'uuid1'
            }
        ]);
    });

    it('should adapt sections ', () => {
        graphqlResponse.forms.editForm.sections[0].name = 'metadata';
        graphqlResponse.forms.editForm.sections[0].fieldSets[0].fields[0].readOnly = true;

        expect(adaptEditFormData(graphqlResponse, 'fr', t).sections).toEqual([]);
    });

    it('should return the nodeData name when editing', () => {
        expect(adaptEditFormData(graphqlResponse, 'fr', t).title).toEqual('nameOfNode');
    });

    it('should add ChildrenOrder field when we are not on a page and hasOrderableChildNodes', () => {
        graphqlResponse.jcr.result.isPage = false;
        graphqlResponse.jcr.result.primaryNodeType.hasOrderableChildNodes = true;

        expect(adaptEditFormData(graphqlResponse, 'fr', t).initialValues['Children::Order']).toEqual([]);
    });

    it('shouldn\'t add ChildrenOrder field when we are not on a page', () => {
        graphqlResponse.jcr.result.isPage = true;

        expect(adaptEditFormData(graphqlResponse, 'fr', t).initialValues['Children::Order']).not.toEqual([]);
    });

    it('Should initialize automatic ordering values if fieldSet is not enabled', () => {
        graphqlResponse.forms.editForm.sections[0].fieldSets.push({
            name: 'jmix:orderedList',
            dynamic: true,
            activated: false,
            displayed: true,
            fields: []
        });

        const adaptedData = adaptEditFormData(graphqlResponse, 'fr', t);
        expect(adaptedData.initialValues.firstField).toEqual('jcr:lastModified');
        expect(adaptedData.initialValues.firstDirection).toEqual('desc');
        expect(adaptedData.initialValues.secondField).toEqual(undefined);
        expect(adaptedData.initialValues.secondDirection).toEqual(undefined);
        expect(adaptedData.initialValues.thirdField).toEqual(undefined);
        expect(adaptedData.initialValues.thirdDirection).toEqual(undefined);
    });

    it('Should not initialize automatic ordering values if fieldSet is enabled', () => {
        graphqlResponse.forms.editForm.sections[0].fieldSets.push({
            name: 'jmix:orderedList',
            dynamic: true,
            activated: true,
            displayed: true,
            fields: [{name: 'firstField'},
                {name: 'firstDirection'},
                {name: 'secondField'},
                {name: 'secondDirection'},
                {name: 'thirdField'},
                {name: 'thirdDirection'}]
        });
        graphqlResponse.jcr.result.properties.push({name: 'firstField', value: 'toto', properties: true});
        graphqlResponse.jcr.result.properties.push({name: 'firstDirection', value: 'asc', properties: true});
        graphqlResponse.jcr.result.properties.push({name: 'thirdField', value: 'titi', properties: true});
        graphqlResponse.jcr.result.properties.push({name: 'thirdDirection', value: 'desc', properties: true});

        const adaptedData = adaptEditFormData(graphqlResponse, 'fr', t);
        expect(adaptedData.initialValues.firstField).toEqual('toto');
        expect(adaptedData.initialValues.firstDirection).toEqual('asc');
        expect(adaptedData.initialValues.secondField).toEqual(undefined);
        expect(adaptedData.initialValues.secondDirection).toEqual(undefined);
        expect(adaptedData.initialValues.thirdField).toEqual('titi');
        expect(adaptedData.initialValues.thirdDirection).toEqual('desc');
    });

    it('Should not initialize automatic ordering values if fieldSet doest exist in form definition', () => {
        const adaptedData = adaptEditFormData(graphqlResponse, 'fr', t);
        expect(adaptedData.initialValues.firstField).toEqual(undefined);
        expect(adaptedData.initialValues.firstDirection).toEqual(undefined);
        expect(adaptedData.initialValues.secondField).toEqual(undefined);
        expect(adaptedData.initialValues.secondDirection).toEqual(undefined);
        expect(adaptedData.initialValues.thirdField).toEqual(undefined);
        expect(adaptedData.initialValues.thirdDirection).toEqual(undefined);
    });

    it('should use default value for not enabled mixin', () => {
        graphqlResponse.forms.editForm.sections[0].fieldSets.push({
            dynamic: true,
            activated: false,
            fields: [
                {
                    name: 'field2',
                    displayName: 'labelled',
                    selectorType: 'ContentPicker',
                    defaultValues: [
                        {
                            string: '2019-05-07T11:33:31.056'
                        }
                    ]
                }
            ]
        });

        expect(adaptEditFormData(graphqlResponse, 'fr', t).initialValues.field2).toEqual('2019-05-07T11:33:31.056');
    });

    it('should not rename node if system name not changed', () => {
        const nodeData = {
            name: 'dummy',
            primaryNodeType: {
                displayName: 'ContentType',
                name: 'jcr:contentType'
            }
        };

        let saveRequestVariables = {
            propertiesToSave: [{
                name: Constants.systemName.name,
                value: 'dummy'
            }]
        };

        saveRequestVariables = adaptSaveRequest(nodeData, saveRequestVariables);

        expect(saveRequestVariables.propertiesToSave.length).toEqual(0);
        expect(saveRequestVariables.shouldRename).toEqual(false);
    });

    it('should rename node if system name changed', () => {
        const nodeData = {
            name: 'dummy',
            primaryNodeType: {
                displayName: 'ContentType',
                name: 'jcr:contentType'
            }
        };

        let saveRequestVariables = {
            propertiesToSave: [{
                name: Constants.systemName.name,
                value: 'dummy_updated'
            }]
        };

        saveRequestVariables = adaptSaveRequest(nodeData, saveRequestVariables);

        expect(saveRequestVariables.propertiesToSave.length).toEqual(0);
        expect(saveRequestVariables.shouldRename).toEqual(true);
        expect(saveRequestVariables.newName).toEqual('dummy_updated');
    });

    it('should not rename node if system name not changed and system name contains specials characters', () => {
        const nodeData = {
            name: 'dummy%2A',
            primaryNodeType: {
                displayName: 'ContentType',
                name: 'jcr:contentType'
            }
        };

        let saveRequestVariables = {
            propertiesToSave: [{
                name: Constants.systemName.name,
                value: 'dummy*'
            }]
        };

        saveRequestVariables = adaptSaveRequest(nodeData, saveRequestVariables);

        expect(saveRequestVariables.propertiesToSave.length).toEqual(0);
        expect(saveRequestVariables.shouldRename).toEqual(false);
    });
});
