import {adaptEditFormData} from './useEditFormDefinition';
import {Constants} from '~/ContentEditor.constants';

jest.mock('~/SelectorTypes/resolveSelectorType', () => {
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
    const fieldSetName = 'jcr:contentType';

    let graphqlResponse;
    beforeEach(() => {
        graphqlResponse = {
            forms: {
                editForm: {
                    sections: [
                        {
                            fieldSets: [
                                {
                                    name: fieldSetName,
                                    fields: [
                                        {
                                            name: 'field1',
                                            displayName: 'labelled',
                                            selectorType: 'ContentPicker',
                                            declaringNodeType: fieldSetName,
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
                        name: fieldSetName,
                        hasOrderableChildNodes: false,
                        properties: [
                            {name: 'field1', primaryNodeType: true}
                        ]
                    },
                    properties: [
                        {
                            name: 'field1',
                            properties: true,
                            value: '2019-05-07T11:33:31.056',
                            definition: {
                                declaringNodeType: {
                                    name: fieldSetName
                                }
                            }
                        }
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
                    },
                    defaultWipInfo: {status: 'DISABLED', languages: []}
                }
            }
        };
    });

    it('should extract node type info', () => {
        const adaptedForm = adaptEditFormData(graphqlResponse, 'fr', t);

        expect(adaptedForm.nodeTypeName).toEqual(fieldSetName);
        expect(adaptedForm.nodeTypeDisplayName).toEqual('ContentType');
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

        expect(adaptedForm.initialValues).toEqual({
            [fieldSetName + '_field1']: '2019-05-07T11:33:31.056',
            'WIP::Info': {
                status: 'DISABLED',
                languages: []
            }
        });
    });

    it('should extract initialValues with selectorType own logic', () => {
        graphqlResponse.forms.editForm.sections[0].fieldSets[0].fields[0].selectorType = 'Checkbox';
        const initialValues = adaptEditFormData(graphqlResponse, 'fr', t).initialValues;

        expect(initialValues).toEqual({
            [fieldSetName + '_field1']: false,
            'WIP::Info': {
                status: 'DISABLED',
                languages: []
            }
        });
    });

    it('should set values and no value as initialValue when multiple is at true', () => {
        graphqlResponse.forms.editForm.sections[0].fieldSets[0].fields[0].multiple = true;
        graphqlResponse.jcr.result.properties = [{
            name: 'field1',
            definition: {
                declaringNodeType: {
                    name: fieldSetName
                }
            },
            values: ['value1', 'value2']
        }];

        const initialValues = adaptEditFormData(graphqlResponse, 'fr', t).initialValues;

        expect(initialValues).toEqual({
            [fieldSetName + '_field1']: ['value1', 'value2'],
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

    it('should hide metadata section', () => {
        graphqlResponse.forms.editForm.sections[0].name = 'metadata';
        graphqlResponse.forms.editForm.sections[0].fieldSets[0].fields[0].readOnly = true;

        expect(adaptEditFormData(graphqlResponse, 'fr', t).sections).toEqual([]);
    });

    it('should adapt field data', () => {
        const adaptedSections = adaptEditFormData(graphqlResponse, 'fr', t).sections;
        expect(adaptedSections[0].fieldSets[0].fields[0].name).toEqual('jcr:contentType_field1');
        expect(adaptedSections[0].fieldSets[0].fields[0].propertyName).toEqual('field1');
        expect(adaptedSections[0].fieldSets[0].fields[0].nodeType).toEqual('jcr:contentType');
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
        expect(adaptedData.initialValues[Constants.ordering.automaticOrdering.mixin + '_firstField']).toEqual('jcr:lastModified');
        expect(adaptedData.initialValues[Constants.ordering.automaticOrdering.mixin + '_firstDirection']).toEqual('desc');
        expect(adaptedData.initialValues[Constants.ordering.automaticOrdering.mixin + '_secondField']).toEqual(undefined);
        expect(adaptedData.initialValues[Constants.ordering.automaticOrdering.mixin + '_secondDirection']).toEqual(undefined);
        expect(adaptedData.initialValues[Constants.ordering.automaticOrdering.mixin + '_thirdField']).toEqual(undefined);
        expect(adaptedData.initialValues[Constants.ordering.automaticOrdering.mixin + '_thirdDirection']).toEqual(undefined);
    });

    it('Should not initialize automatic ordering values if fieldSet is enabled', () => {
        const definition = {
            declaringNodeType: {
                name: Constants.ordering.automaticOrdering.mixin
            }
        };
        graphqlResponse.forms.editForm.sections[0].fieldSets.push({
            name: Constants.ordering.automaticOrdering.mixin,
            dynamic: true,
            activated: true,
            displayed: true,
            fields: [
                {name: 'firstField', declaringNodeType: Constants.ordering.automaticOrdering.mixin},
                {name: 'firstDirection', declaringNodeType: Constants.ordering.automaticOrdering.mixin},
                {name: 'secondField', declaringNodeType: Constants.ordering.automaticOrdering.mixin},
                {name: 'secondDirection', declaringNodeType: Constants.ordering.automaticOrdering.mixin},
                {name: 'thirdField', declaringNodeType: Constants.ordering.automaticOrdering.mixin},
                {name: 'thirdDirection', declaringNodeType: Constants.ordering.automaticOrdering.mixin}
            ]
        });
        graphqlResponse.jcr.result.properties.push({name: 'firstField', value: 'toto', properties: true, definition});
        graphqlResponse.jcr.result.properties.push({name: 'firstDirection', value: 'asc', properties: true, definition});
        graphqlResponse.jcr.result.properties.push({name: 'thirdField', value: 'titi', properties: true, definition});
        graphqlResponse.jcr.result.properties.push({name: 'thirdDirection', value: 'desc', properties: true, definition});

        const adaptedData = adaptEditFormData(graphqlResponse, 'fr', t);
        expect(adaptedData.initialValues[Constants.ordering.automaticOrdering.mixin + '_firstField']).toEqual('toto');
        expect(adaptedData.initialValues[Constants.ordering.automaticOrdering.mixin + '_firstDirection']).toEqual('asc');
        expect(adaptedData.initialValues[Constants.ordering.automaticOrdering.mixin + '_secondField']).toEqual(undefined);
        expect(adaptedData.initialValues[Constants.ordering.automaticOrdering.mixin + '_secondDirection']).toEqual(undefined);
        expect(adaptedData.initialValues[Constants.ordering.automaticOrdering.mixin + '_thirdField']).toEqual('titi');
        expect(adaptedData.initialValues[Constants.ordering.automaticOrdering.mixin + '_thirdDirection']).toEqual('desc');
    });

    it('Should not initialize automatic ordering values if fieldSet doest exist in form definition', () => {
        const adaptedData = adaptEditFormData(graphqlResponse, 'fr', t);
        expect(adaptedData.initialValues[Constants.ordering.automaticOrdering.mixin + '_firstField']).toEqual(undefined);
        expect(adaptedData.initialValues[Constants.ordering.automaticOrdering.mixin + '_firstDirection']).toEqual(undefined);
        expect(adaptedData.initialValues[Constants.ordering.automaticOrdering.mixin + '_secondField']).toEqual(undefined);
        expect(adaptedData.initialValues[Constants.ordering.automaticOrdering.mixin + '_secondDirection']).toEqual(undefined);
        expect(adaptedData.initialValues[Constants.ordering.automaticOrdering.mixin + '_thirdField']).toEqual(undefined);
        expect(adaptedData.initialValues[Constants.ordering.automaticOrdering.mixin + '_thirdDirection']).toEqual(undefined);
    });

    it('should use default value for not enabled mixin', () => {
        graphqlResponse.forms.editForm.sections[0].fieldSets.push({
            name: 'notEnabledFS',
            dynamic: true,
            activated: false,
            fields: [
                {
                    name: 'field2',
                    displayName: 'labelled',
                    selectorType: 'ContentPicker',
                    definition: {
                        declaringNodeType: {
                            name: 'notEnabledFS'
                        }
                    },
                    defaultValues: [
                        {
                            string: '2019-05-07T11:33:31.056'
                        }
                    ]
                }
            ]
        });

        expect(adaptEditFormData(graphqlResponse, 'fr', t).initialValues.notEnabledFS_field2).toEqual('2019-05-07T11:33:31.056');
    });
});
