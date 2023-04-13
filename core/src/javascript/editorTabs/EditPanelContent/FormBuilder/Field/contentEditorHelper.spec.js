import {contentEditorHelper} from './contentEditorHelper';

describe('ContentEditor.helper', () => {
    let context;
    let field;
    let formik;
    beforeEach(() => {
        context =
            {
                sections: [
                    {
                        name: 'content',
                        displayName: 'Content',
                        description: null,
                        fieldSets: [
                            {
                                name: 'jnt:imageReferenceLink',
                                displayName: 'Image (from the Document Manager)',
                                description: '',
                                dynamic: false,
                                activated: true,
                                displayed: true,
                                fields: [
                                    {
                                        nodeType: 'jnt:imageReferenceLink',
                                        name: 'j:node',
                                        displayName: 'Image',
                                        description: '',
                                        errorMessage: '',
                                        mandatory: false,
                                        i18n: true,
                                        multiple: false,
                                        readOnly: false,
                                        requiredType: 'WEAKREFERENCE',
                                        selectorType: 'Picker',
                                        selectorOptions: [
                                            {
                                                name: 'type',
                                                value: 'image',
                                                __typename: 'EditorFormProperty'
                                            }
                                        ],
                                        valueConstraints: [
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'jmix:image',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'jmix:image',
                                                properties: [],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            }
                                        ],
                                        defaultValues: [],
                                        __typename: 'EditorFormField'
                                    },
                                    {
                                        nodeType: 'jnt:imageReferenceLink',
                                        name: 'j:linkType',
                                        displayName: 'Link type',
                                        description: '',
                                        errorMessage: '',
                                        mandatory: true,
                                        i18n: false,
                                        multiple: false,
                                        readOnly: false,
                                        requiredType: 'STRING',
                                        selectorType: 'Choicelist',
                                        selectorOptions: [
                                            {
                                                name: 'linkTypeInitializer',
                                                value: '',
                                                __typename: 'EditorFormProperty'
                                            },
                                            {
                                                name: 'resourceBundle',
                                                value: '',
                                                __typename: 'EditorFormProperty'
                                            }
                                        ],
                                        valueConstraints: [
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'none',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'No link',
                                                properties: [
                                                    {
                                                        name: 'defaultProperty',
                                                        value: 'true',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'internal',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Internal',
                                                properties: [
                                                    {
                                                        name: 'addMixin',
                                                        value: 'jmix:internalLink',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'external',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'External',
                                                properties: [
                                                    {
                                                        name: 'addMixin',
                                                        value: 'jmix:externalLink',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            }
                                        ],
                                        defaultValues: [
                                            {
                                                string: 'none',
                                                __typename: 'EditorFormFieldValue'
                                            }
                                        ],
                                        __typename: 'EditorFormField'
                                    },
                                    {
                                        nodeType: 'jnt:imageReferenceLink',
                                        name: 'j:alternateText',
                                        displayName: 'Alternative text',
                                        description: '',
                                        errorMessage: '',
                                        mandatory: false,
                                        i18n: true,
                                        multiple: false,
                                        readOnly: false,
                                        requiredType: 'STRING',
                                        selectorType: 'Text',
                                        selectorOptions: [],
                                        valueConstraints: [],
                                        defaultValues: [],
                                        __typename: 'EditorFormField'
                                    }
                                ]
                            },
                            {
                                name: 'mix:title',
                                displayName: 'Title',
                                description: '',
                                dynamic: false,
                                activated: true,
                                displayed: true,
                                fields: [
                                    {
                                        nodeType: 'mix:title',
                                        name: 'jcr:title',
                                        displayName: 'Title',
                                        description: '',
                                        errorMessage: '',
                                        mandatory: false,
                                        i18n: true,
                                        multiple: false,
                                        readOnly: false,
                                        requiredType: 'STRING',
                                        selectorType: 'Text',
                                        selectorOptions: [],
                                        valueConstraints: [],
                                        defaultValues: [],
                                        __typename: 'EditorFormField'
                                    }
                                ],
                                __typename: 'EditorFormFieldSet'
                            },
                            {
                                name: 'jmix:link',
                                displayName: 'Link',
                                description: '',
                                dynamic: false,
                                activated: true,
                                displayed: true,
                                fields: [
                                    {
                                        nodeType: 'jmix:link',
                                        name: 'j:target',
                                        displayName: 'Target',
                                        description: '',
                                        errorMessage: '',
                                        mandatory: false,
                                        i18n: false,
                                        multiple: false,
                                        readOnly: false,
                                        requiredType: 'STRING',
                                        selectorType: 'Choicelist',
                                        selectorOptions: [
                                            {
                                                name: 'resourceBundle',
                                                value: '',
                                                __typename: 'EditorFormProperty'
                                            }
                                        ],
                                        valueConstraints: [
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: '_blank',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'New Window (_blank)',
                                                properties: [],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: '_parent',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Parent Window (_parent)',
                                                properties: [],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: '_self',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Same window (_self)',
                                                properties: [],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: '_top',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Topmost window (_top)',
                                                properties: [],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            }
                                        ],
                                        defaultValues: [],
                                        __typename: 'EditorFormField'
                                    }
                                ]
                            },
                            {
                                name: 'jmix:internalLink',
                                displayName: 'internalLink',
                                description: '',
                                dynamic: true,
                                activated: true,
                                displayed: false,
                                fields: [{
                                    nodeType: 'jmix:internalLink',
                                    name: 'j:linknode',
                                    displayName: 'Internal link (Page)',
                                    description: '',
                                    errorMessage: '',
                                    mandatory: false,
                                    i18n: true,
                                    multiple: false,
                                    readOnly: false,
                                    requiredType: 'WEAKREFERENCE',
                                    selectorType: 'Picker',
                                    selectorOptions: [
                                        {
                                            name: 'type',
                                            value: 'editoriallink',
                                            __typename: 'EditorFormProperty'
                                        }
                                    ],
                                    valueConstraints: [
                                        {
                                            value: {
                                                type: 'String',
                                                string: 'jmix:droppableContent',
                                                __typename: 'EditorFormFieldValue'
                                            },
                                            displayValue: 'jmix:droppableContent',
                                            properties: [],
                                            __typename: 'EditorFormFieldValueConstraint'
                                        },
                                        {
                                            value: {
                                                type: 'String',
                                                string: 'jnt:page',
                                                __typename: 'EditorFormFieldValue'
                                            },
                                            displayValue: 'jnt:page',
                                            properties: [],
                                            __typename: 'EditorFormFieldValueConstraint'
                                        }
                                    ],
                                    defaultValues: [],
                                    __typename: 'EditorFormField'
                                }]
                            },
                            {
                                name: 'jmix:externalLink',
                                displayName: 'externalLink',
                                description: '',
                                dynamic: true,
                                activated: false,
                                displayed: false,
                                fields: [
                                    {
                                        nodeType: 'jmix:externalLink',
                                        name: 'j:linkTitle',
                                        displayName: 'Link title',
                                        description: '',
                                        errorMessage: '',
                                        mandatory: false,
                                        i18n: true,
                                        multiple: false,
                                        readOnly: false,
                                        requiredType: 'STRING',
                                        selectorType: 'Text',
                                        selectorOptions: [],
                                        valueConstraints: [],
                                        defaultValues: [],
                                        __typename: 'EditorFormField'
                                    },
                                    {
                                        nodeType: 'jmix:externalLink',
                                        name: 'j:url',
                                        displayName: 'External link (URL)',
                                        description: '',
                                        errorMessage: '',
                                        mandatory: false,
                                        i18n: true,
                                        multiple: false,
                                        readOnly: false,
                                        requiredType: 'STRING',
                                        selectorType: 'Text',
                                        selectorOptions: [],
                                        valueConstraints: [],
                                        defaultValues: [],
                                        __typename: 'EditorFormField'
                                    }
                                ],
                                __typename: 'EditorFormFieldSet'
                            }
                        ]
                    },
                    {
                        name: 'classification',
                        displayName: 'Categories',
                        description: null,
                        fieldSets: [
                            {
                                name: 'jmix:tagged',
                                displayName: 'Tags',
                                description: '',
                                dynamic: true,
                                activated: false,
                                displayed: true,
                                fields: [
                                    {
                                        nodeType: 'jmix:tagged',
                                        name: 'j:tagList',
                                        displayName: 'Tags',
                                        description: '',
                                        errorMessage: '',
                                        mandatory: false,
                                        i18n: false,
                                        multiple: true,
                                        readOnly: false,
                                        requiredType: 'STRING',
                                        selectorType: 'Tag',
                                        selectorOptions: [
                                            {
                                                name: 'autocomplete',
                                                value: '10.0',
                                                __typename: 'EditorFormProperty'
                                            },
                                            {
                                                name: 'separator',
                                                value: ',',
                                                __typename: 'EditorFormProperty'
                                            }
                                        ],
                                        valueConstraints: [],
                                        defaultValues: [],
                                        __typename: 'EditorFormField'
                                    }
                                ],
                                __typename: 'EditorFormFieldSet'
                            },
                            {
                                name: 'jmix:categorized',
                                displayName: 'categorized',
                                description: '',
                                dynamic: true,
                                activated: false,
                                displayed: true,
                                fields: [
                                    {
                                        nodeType: 'jmix:categorized',
                                        name: 'j:defaultCategory',
                                        displayName: 'Categories',
                                        description: '',
                                        errorMessage: '',
                                        mandatory: false,
                                        i18n: false,
                                        multiple: true,
                                        readOnly: false,
                                        requiredType: 'WEAKREFERENCE',
                                        selectorType: 'Category',
                                        selectorOptions: [
                                            {
                                                name: 'autoSelectParent',
                                                value: 'false',
                                                __typename: 'EditorFormProperty'
                                            }
                                        ],
                                        valueConstraints: [],
                                        defaultValues: [],
                                        __typename: 'EditorFormField'
                                    }
                                ],
                                __typename: 'EditorFormFieldSet'
                            }
                        ],
                        __typename: 'EditorFormSection'
                    },
                    {
                        name: 'metadata',
                        displayName: 'Metadata',
                        description: null,
                        fieldSets: [
                            {
                                name: 'jmix:description',
                                displayName: 'description',
                                description: '',
                                dynamic: false,
                                activated: true,
                                displayed: true,
                                fields: [
                                    {
                                        nodeType: 'jmix:description',
                                        name: 'jcr:description',
                                        displayName: 'Description',
                                        description: '',
                                        errorMessage: '',
                                        mandatory: false,
                                        i18n: true,
                                        multiple: false,
                                        readOnly: false,
                                        requiredType: 'STRING',
                                        selectorType: 'TextArea',
                                        selectorOptions: [],
                                        valueConstraints: [],
                                        defaultValues: [],
                                        __typename: 'EditorFormField'
                                    }
                                ],
                                __typename: 'EditorFormFieldSet'
                            },
                            {
                                name: 'jmix:keywords',
                                displayName: 'Keywords',
                                description: '',
                                dynamic: true,
                                activated: false,
                                displayed: true,
                                fields: [
                                    {
                                        nodeType: 'jmix:keywords',
                                        name: 'j:keywords',
                                        displayName: 'Keywords',
                                        description: '',
                                        errorMessage: '',
                                        mandatory: false,
                                        i18n: false,
                                        multiple: true,
                                        readOnly: false,
                                        requiredType: 'STRING',
                                        selectorType: 'Text',
                                        selectorOptions: [],
                                        valueConstraints: [],
                                        defaultValues: [],
                                        __typename: 'EditorFormField'
                                    }
                                ],
                                __typename: 'EditorFormFieldSet'
                            }
                        ],
                        __typename: 'EditorFormSection'
                    },
                    {
                        name: 'layout',
                        displayName: 'Layout',
                        description: null,
                        fieldSets: [
                            {
                                name: 'jmix:customSkin',
                                displayName: 'customSkin',
                                description: '',
                                dynamic: true,
                                activated: false,
                                displayed: false,
                                fields: [
                                    {
                                        nodeType: 'jmix:customSkin',
                                        name: 'j:classname',
                                        displayName: 'Class names',
                                        description: '',
                                        errorMessage: '',
                                        mandatory: false,
                                        i18n: false,
                                        multiple: false,
                                        readOnly: false,
                                        requiredType: 'STRING',
                                        selectorType: 'Text',
                                        selectorOptions: [],
                                        valueConstraints: [],
                                        defaultValues: [],
                                        __typename: 'EditorFormField'
                                    },
                                    {
                                        nodeType: 'jmix:customSkin',
                                        name: 'j:id',
                                        displayName: 'set a div id around the content',
                                        description: '',
                                        errorMessage: '',
                                        mandatory: false,
                                        i18n: false,
                                        multiple: false,
                                        readOnly: false,
                                        requiredType: 'STRING',
                                        selectorType: 'Text',
                                        selectorOptions: [],
                                        valueConstraints: [],
                                        defaultValues: [],
                                        __typename: 'EditorFormField'
                                    }
                                ],
                                __typename: 'EditorFormFieldSet'
                            },
                            {
                                name: 'jmix:style',
                                displayName: 'style',
                                description: '',
                                dynamic: true,
                                activated: false,
                                displayed: false,
                                fields: [
                                    {
                                        nodeType: 'jmix:style',
                                        name: 'j:style',
                                        displayName: 'j_style',
                                        description: '',
                                        errorMessage: '',
                                        mandatory: false,
                                        i18n: false,
                                        multiple: false,
                                        readOnly: false,
                                        requiredType: 'STRING',
                                        selectorType: 'Choicelist',
                                        selectorOptions: [],
                                        valueConstraints: [
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'grey',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'grey',
                                                properties: [],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'blue',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'blue',
                                                properties: [],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'mushroom',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'mushroom',
                                                properties: [],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'orange',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'orange',
                                                properties: [],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'black',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'black',
                                                properties: [],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'red',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'red',
                                                properties: [],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'green',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'green',
                                                properties: [],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'purple',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'purple',
                                                properties: [],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'yellow',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'yellow',
                                                properties: [],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            }
                                        ],
                                        defaultValues: [
                                            {
                                                string: 'grey',
                                                __typename: 'EditorFormFieldValue'
                                            }
                                        ],
                                        __typename: 'EditorFormField'
                                    },
                                    {
                                        nodeType: 'jmix:style',
                                        name: 'icon',
                                        displayName: 'icon',
                                        description: '',
                                        errorMessage: '',
                                        mandatory: false,
                                        i18n: false,
                                        multiple: false,
                                        readOnly: false,
                                        requiredType: 'WEAKREFERENCE',
                                        selectorType: 'Picker',
                                        selectorOptions: [
                                            {
                                                name: 'type',
                                                value: 'image',
                                                __typename: 'EditorFormProperty'
                                            }
                                        ],
                                        valueConstraints: [],
                                        defaultValues: [],
                                        __typename: 'EditorFormField'
                                    }
                                ],
                                __typename: 'EditorFormFieldSet'
                            },
                            {
                                name: 'jmix:renderable',
                                displayName: 'View',
                                description: '',
                                dynamic: true,
                                activated: false,
                                displayed: true,
                                fields: [
                                    {
                                        nodeType: 'jmix:renderable',
                                        name: 'j:view',
                                        displayName: 'Select a view',
                                        description: '',
                                        errorMessage: '',
                                        mandatory: false,
                                        i18n: false,
                                        multiple: false,
                                        readOnly: false,
                                        requiredType: 'STRING',
                                        selectorType: 'Choicelist',
                                        selectorOptions: [
                                            {
                                                name: 'templates',
                                                value: '',
                                                __typename: 'EditorFormProperty'
                                            },
                                            {
                                                name: 'resourceBundle',
                                                value: '',
                                                __typename: 'EditorFormProperty'
                                            }
                                        ],
                                        valueConstraints: [],
                                        defaultValues: [],
                                        __typename: 'EditorFormField'
                                    }
                                ],
                                __typename: 'EditorFormFieldSet'
                            },
                            {
                                name: 'jmix:renderableReference',
                                displayName: 'Reference view',
                                description: '',
                                dynamic: true,
                                activated: false,
                                displayed: true,
                                fields: [
                                    {
                                        nodeType: 'jmix:renderableReference',
                                        name: 'j:referenceView',
                                        displayName: 'view',
                                        description: '',
                                        errorMessage: '',
                                        mandatory: false,
                                        i18n: false,
                                        multiple: false,
                                        readOnly: false,
                                        requiredType: 'STRING',
                                        selectorType: 'Choicelist',
                                        selectorOptions: [
                                            {
                                                name: 'templates',
                                                value: 'reference',
                                                __typename: 'EditorFormProperty'
                                            },
                                            {
                                                name: 'resourceBundle',
                                                value: '',
                                                __typename: 'EditorFormProperty'
                                            },
                                            {
                                                name: 'dependentProperties',
                                                value: 'j:node',
                                                __typename: 'EditorFormProperty'
                                            }
                                        ],
                                        valueConstraints: [
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'link',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'link',
                                                properties: [
                                                    {
                                                        name: 'visible',
                                                        value: 'true',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            }
                                        ],
                                        defaultValues: [],
                                        __typename: 'EditorFormField'
                                    }
                                ],
                                __typename: 'EditorFormFieldSet'
                            }
                        ],
                        __typename: 'EditorFormSection'
                    }
                ]
            };
        field = {
            nodeType: 'jnt:imageReferenceLink',
            name: 'j:linkType',
            displayName: 'Link type'
        };
        formik = {
            setFieldValue: jest.fn(),
            setFieldTouched: jest.fn()
        };
    });

    it('should add mixin to the right section', () => {
        const sections = context.sections;
        contentEditorHelper.moveMixinToTargetFieldset('jmix:internalLink', field.nodeType, sections, field, formik);
        let updatedFieldset = sections
            .find(({name}) => name === 'content')
            .fieldSets
            .find(({name}) => {
                return name === 'jnt:imageReferenceLink';
            });
        const movedField = updatedFieldset.fields.find(({nodeType}) => {
            return nodeType === 'jmix:internalLink';
        });
        expect(updatedFieldset.fields.length).toBe(4);
        expect(movedField).toBeDefined();
    });

    it('should remove mixin to the section and put it to the initial one', () => {
        let sections = context.sections;
        contentEditorHelper.moveMixinToTargetFieldset('jmix:internalLink', field.nodeType, sections, field, formik);
        contentEditorHelper.moveMixinToInitialFieldset('jmix:internalLink', sections, formik);

        let initialFieldset = sections
            .find(({name}) => name === 'content')
            .fieldSets
            .find(({name}) => {
                return name === 'jmix:internalLink';
            });
        const movedField = initialFieldset.fields.find(({name}) => {
            return name === 'j:linknode';
        });
        expect(initialFieldset.fields.length).toBe(1);
        expect(movedField).toBeDefined();
    });

    it('should move moveFieldsToAnotherFieldset', () => {
        let sections = [{
            fieldSets: [{
                name: 'field1NT',
                fields: [
                    {
                        nodeType: 'field1NT',
                        name: 'field1'
                    },
                    {
                        nodeType: 'field1NT',
                        name: 'field2'
                    }
                ]
            },
            {
                name: 'field2NT',
                fields: [
                    {
                        nodeType: 'field2NT',
                        name: 'field1'
                    },
                    {
                        nodeType: 'field2NT',
                        name: 'field2'
                    }
                ]
            }]
        }];
        contentEditorHelper.moveFieldsToAnotherFieldset('field1NT', 'field2NT', sections, sections[0].fieldSets[1].fields[0]);
        expect(sections[0].fieldSets[1].fields).toStrictEqual([
            {
                nodeType: 'field2NT',
                name: 'field1'
            },
            {
                nodeType: 'field1NT',
                name: 'field1'
            },
            {
                nodeType: 'field1NT',
                name: 'field2'
            },
            {
                nodeType: 'field2NT',
                name: 'field2'
            }
        ]);
        expect(sections[0].fieldSets[0].fields).toStrictEqual([]);
        contentEditorHelper.moveFieldsToAnotherFieldset('field1NT', 'field1NT', sections);
        expect(sections[0].fieldSets[0].fields).toStrictEqual([
            {
                nodeType: 'field1NT',
                name: 'field1'
            },
            {
                nodeType: 'field1NT',
                name: 'field2'
            }
        ]);
        expect(sections[0].fieldSets[1].fields).toStrictEqual([
            {
                nodeType: 'field2NT',
                name: 'field1'
            },
            {
                nodeType: 'field2NT',
                name: 'field2'
            }
        ]);
    });
});
