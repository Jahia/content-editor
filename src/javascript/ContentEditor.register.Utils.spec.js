import {addMixinToSection, removeMixinFromSection} from './ContentEditor.register.Utils';

describe('ContentEditor.register.Utils', () => {
    let context;
    let field;
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
                    },
                    {
                        name: 'options',
                        displayName: 'Options',
                        description: null,
                        fieldSets: [
                            {
                                name: 'nt:base',
                                displayName: 'System',
                                description: '',
                                dynamic: false,
                                activated: true,
                                displayed: true,
                                fields: [
                                    {
                                        nodeType: 'nt:base',
                                        name: 'ce:systemName',
                                        displayName: 'System name',
                                        description: 'Used by Jahia to identify content, 32 character maximum.',
                                        errorMessage: null,
                                        mandatory: true,
                                        i18n: false,
                                        multiple: false,
                                        readOnly: false,
                                        requiredType: 'STRING',
                                        selectorType: 'Text',
                                        selectorOptions: [
                                            {
                                                name: 'maxLength',
                                                value: 32
                                            }
                                        ],
                                        valueConstraints: null,
                                        defaultValues: null,
                                        __typename: 'EditorFormField'
                                    }
                                ],
                                __typename: 'EditorFormFieldSet'
                            },
                            {
                                name: 'jmix:topStory',
                                displayName: 'Top story',
                                description: '',
                                dynamic: true,
                                activated: false,
                                displayed: true,
                                fields: [
                                    {
                                        nodeType: 'jmix:topStory',
                                        name: 'j:level',
                                        displayName: 'Level',
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
                                                    string: 'first',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'First level',
                                                properties: [],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'second',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Second level',
                                                properties: [],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'third',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Third level',
                                                properties: [],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            }
                                        ],
                                        defaultValues: [
                                            {
                                                string: 'first',
                                                __typename: 'EditorFormFieldValue'
                                            }
                                        ],
                                        __typename: 'EditorFormField'
                                    },
                                    {
                                        nodeType: 'jmix:topStory',
                                        name: 'j:endDate',
                                        displayName: 'End date',
                                        description: '',
                                        errorMessage: '',
                                        mandatory: false,
                                        i18n: false,
                                        multiple: false,
                                        readOnly: false,
                                        requiredType: 'DATE',
                                        selectorType: 'DateTimePicker',
                                        selectorOptions: [],
                                        valueConstraints: [],
                                        defaultValues: [],
                                        __typename: 'EditorFormField'
                                    }
                                ],
                                __typename: 'EditorFormFieldSet'
                            },
                            {
                                name: 'jmix:locationAware',
                                displayName: 'Location',
                                description: '',
                                dynamic: true,
                                activated: false,
                                displayed: true,
                                fields: [
                                    {
                                        nodeType: 'jmix:locationAware',
                                        name: 'j:street',
                                        displayName: 'Street',
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
                                        nodeType: 'jmix:locationAware',
                                        name: 'j:zipCode',
                                        displayName: 'Zip Code',
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
                                        nodeType: 'jmix:locationAware',
                                        name: 'j:town',
                                        displayName: 'Town',
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
                                        nodeType: 'jmix:locationAware',
                                        name: 'j:country',
                                        displayName: 'Country',
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
                                                name: 'country',
                                                value: '',
                                                __typename: 'EditorFormProperty'
                                            },
                                            {
                                                name: 'flag',
                                                value: '',
                                                __typename: 'EditorFormProperty'
                                            }
                                        ],
                                        valueConstraints: [
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'AF',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Afghanistan',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_afghanistan.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'AL',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Albania',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_albania.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'DZ',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Algeria',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_algeria.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'AS',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'American Samoa',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_american_samoa.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'AD',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Andorra',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_andorra.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'AO',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Angola',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_angola.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'AI',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Anguilla',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_anguilla.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'AQ',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Antarctica',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'AG',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Antigua and Barbuda',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_antigua_and_barbuda.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'AR',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Argentina',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_argentina.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'AM',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Armenia',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_armenia.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'AW',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Aruba',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_aruba.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'AU',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Australia',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_australia.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'AT',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Austria',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_austria.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'AZ',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Azerbaijan',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_azerbaijan.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'BS',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Bahamas',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_bahamas.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'BH',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Bahrain',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_bahrain.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'BD',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Bangladesh',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_bangladesh.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'BB',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Barbados',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_barbados.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'BY',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Belarus',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_belarus.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'BE',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Belgium',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_belgium.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'BZ',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Belize',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_belize.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'BJ',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Benin',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_benin.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'BM',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Bermuda',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_bermuda.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'BT',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Bhutan',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_bhutan.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'BO',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Bolivia',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_bolivia.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'BQ',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Bonaire, Sint Eustatius and Saba',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'BA',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Bosnia and Herzegovina',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_bosnia_and_herzegovina.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'BW',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Botswana',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_botswana.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'BV',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Bouvet Island',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'BR',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Brazil',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_brazil.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'IO',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'British Indian Ocean Territory',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_british_indian_ocean_territory.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'VG',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'British Virgin Islands',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_british_virgin_islands.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'BN',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Brunei',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_brunei.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'BG',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Bulgaria',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_bulgaria.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'BF',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Burkina Faso',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_burkina_faso.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'BI',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Burundi',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_burundi.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'KH',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Cambodia',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_cambodia.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'CM',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Cameroon',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_cameroon.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'CA',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Canada',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_canada.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'CV',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Cape Verde',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_cape_verde.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'KY',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Cayman Islands',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_cayman_islands.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'CF',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Central African Republic',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_central_african_republic.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'TD',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Chad',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_chad.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'CL',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Chile',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_chile.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'CN',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'China',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_china.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'CX',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Christmas Island',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'CC',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Cocos Islands',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'CO',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Colombia',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_colombia.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'KM',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Comoros',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_comoros.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'CG',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Congo',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'CK',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Cook Islands',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_cook_islands.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'CR',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Costa Rica',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_costa_rica.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'HR',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Croatia',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_croatia.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'CU',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Cuba',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_cuba.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'CW',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Curaçao',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'CY',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Cyprus',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_cyprus.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'CZ',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Czech Republic',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_czech_republic.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'CI',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Côte d\'Ivoire',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'DK',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Denmark',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_denmark.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'DJ',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Djibouti',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_djibouti.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'DM',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Dominica',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_dominica.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'DO',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Dominican Republic',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_dominican_republic.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'EC',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Ecuador',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'EG',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Egypt',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_egypt.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'SV',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'El Salvador',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_el_salvador.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'GQ',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Equatorial Guinea',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_equatorial_guinea.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'ER',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Eritrea',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_eritrea.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'EE',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Estonia',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_estonia.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'ET',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Ethiopia',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_ethiopia.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'FK',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Falkland Islands',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_falkland_islands.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'FO',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Faroe Islands',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_faroe_islands.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'FJ',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Fiji',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_fiji.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'FI',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Finland',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_finland.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'FR',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'France',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_france.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'GF',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'French Guiana',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'PF',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'French Polynesia',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_french_polynesia.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'TF',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'French Southern Territories',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'GA',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Gabon',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_gabon.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'GM',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Gambia',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_gambia.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'GE',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Georgia',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_georgia.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'DE',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Germany',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_germany.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'GH',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Ghana',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_ghana.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'GI',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Gibraltar',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_gibraltar.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'GR',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Greece',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_greece.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'GL',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Greenland',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_greenland.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'GD',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Grenada',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_grenada.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'GP',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Guadeloupe',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'GU',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Guam',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_guam.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'GT',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Guatemala',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_guatemala.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'GG',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Guernsey',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_guernsey.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'GN',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Guinea',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_guinea.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'GW',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Guinea-Bissau',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'GY',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Guyana',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_guyana.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'HT',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Haiti',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_haiti.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'HM',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Heard Island And McDonald Islands',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'HN',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Honduras',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_honduras.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'HK',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Hong Kong',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_hong_kong.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'HU',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Hungary',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_hungary.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'IS',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Iceland',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_iceland.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'IN',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'India',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_india.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'ID',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Indonesia',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_indonesia.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'IR',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Iran',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_iran.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'IQ',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Iraq',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_iraq.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'IE',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Ireland',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_ireland.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'IM',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Isle Of Man',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_isle_of_man.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'IL',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Israel',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_israel.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'IT',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Italy',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_italy.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'JM',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Jamaica',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_jamaica.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'JP',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Japan',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_japan.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'JE',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Jersey',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_jersey.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'JO',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Jordan',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_jordan.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'KZ',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Kazakhstan',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_kazakhstan.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'KE',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Kenya',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_kenya.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'KI',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Kiribati',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_kiribati.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'KW',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Kuwait',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_kuwait.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'KG',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Kyrgyzstan',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_kyrgyzstan.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'LA',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Laos',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_laos.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'LV',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Latvia',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_latvia.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'LB',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Lebanon',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_lebanon.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'LS',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Lesotho',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_lesotho.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'LR',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Liberia',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_liberia.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'LY',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Libya',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_libya.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'LI',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Liechtenstein',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_liechtenstein.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'LT',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Lithuania',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_lithuania.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'LU',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Luxembourg',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_luxembourg.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'MO',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Macao',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'MK',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Macedonia',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_macedonia.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'MG',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Madagascar',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_madagascar.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'MW',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Malawi',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_malawi.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'MY',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Malaysia',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_malaysia.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'MV',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Maldives',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'ML',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Mali',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_mali.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'MT',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Malta',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_malta.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'MH',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Marshall Islands',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_marshall_islands.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'MQ',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Martinique',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_martinique.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'MR',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Mauritania',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'MU',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Mauritius',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_mauritius.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'YT',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Mayotte',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'MX',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Mexico',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_mexico.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'FM',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Micronesia',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_micronesia.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'MD',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Moldova',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_moldova.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'MC',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Monaco',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_monaco.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'MN',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Mongolia',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_mongolia.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'ME',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Montenegro',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'MS',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Montserrat',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_montserrat.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'MA',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Morocco',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_morocco.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'MZ',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Mozambique',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_mozambique.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'MM',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Myanmar',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'NA',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Namibia',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_namibia.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'NR',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Nauru',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_nauru.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'NP',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Nepal',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_nepal.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'NL',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Netherlands',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_netherlands.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'AN',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Netherlands Antilles',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_netherlands_antilles.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'NC',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'New Caledonia',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'NZ',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'New Zealand',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_new_zealand.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'NI',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Nicaragua',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_nicaragua.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'NE',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Niger',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_niger.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'NG',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Nigeria',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_nigeria.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'NU',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Niue',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_niue.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'NF',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Norfolk Island',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_norfolk_island.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'KP',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'North Korea',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_north_korea.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'MP',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Northern Mariana Islands',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_northern_mariana_islands.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'NO',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Norway',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_norway.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'OM',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Oman',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_oman.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'PK',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Pakistan',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_pakistan.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'PW',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Palau',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_palau.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'PS',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Palestine',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'PA',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Panama',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_panama.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'PG',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Papua New Guinea',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_papua_new_guinea.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'PY',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Paraguay',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'PE',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Peru',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_peru.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'PH',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Philippines',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_philippines.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'PN',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Pitcairn',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'PL',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Poland',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_poland.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'PT',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Portugal',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_portugal.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'PR',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Puerto Rico',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_puerto_rico.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'QA',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Qatar',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_qatar.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'RE',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Reunion',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'RO',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Romania',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_romania.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'RU',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Russia',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_russia.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'RW',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Rwanda',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_rwanda.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'BL',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Saint Barthélemy',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'SH',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Saint Helena',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_saint_helena.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'KN',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Saint Kitts And Nevis',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_saint_kitts_and_nevis.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'LC',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Saint Lucia',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_saint_lucia.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'MF',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Saint Martin',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'PM',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Saint Pierre And Miquelon',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_saint_pierre_and_miquelon.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'VC',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Saint Vincent And The Grenadines',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_saint_vincent_and_the_grenadines.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'WS',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Samoa',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_samoa.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'SM',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'San Marino',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_san_marino.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'ST',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Sao Tome And Principe',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_sao_tome_and_principe.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'SA',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Saudi Arabia',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_saudi_arabia.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'SN',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Senegal',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_senegal.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'RS',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Serbia',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'SC',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Seychelles',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_seychelles.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'SL',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Sierra Leone',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_sierra_leone.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'SG',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Singapore',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_singapore.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'SX',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Sint Maarten (Dutch part)',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'SK',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Slovakia',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_slovakia.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'SI',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Slovenia',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_slovenia.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'SB',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Solomon Islands',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_solomon_islands.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'SO',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Somalia',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_somalia.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'ZA',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'South Africa',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_south_africa.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'GS',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'South Georgia And The South Sandwich Islands',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'KR',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'South Korea',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_south_korea.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'SS',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'South Sudan',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'ES',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Spain',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_spain.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'LK',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Sri Lanka',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_sri_lanka.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'SD',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Sudan',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_sudan.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'SR',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Suriname',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_suriname.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'SJ',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Svalbard And Jan Mayen',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'SZ',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Swaziland',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_swaziland.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'SE',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Sweden',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_sweden.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'CH',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Switzerland',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_switzerland.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'SY',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Syria',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_syria.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'TW',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Taiwan',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_taiwan.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'TJ',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Tajikistan',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_tajikistan.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'TZ',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Tanzania',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_tanzania.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'TH',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Thailand',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_thailand.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'CD',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'The Democratic Republic Of Congo',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'TL',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Timor-Leste',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'TG',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Togo',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_togo.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'TK',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Tokelau',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'TO',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Tonga',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_tonga.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'TT',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Trinidad and Tobago',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_trinidad_and_tobago.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'TN',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Tunisia',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_tunisia.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'TR',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Turkey',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_turkey.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'TM',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Turkmenistan',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_turkmenistan.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'TC',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Turks And Caicos Islands',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_turks_and_caicos_islands.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'TV',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Tuvalu',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_tuvalu.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'VI',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'U.S. Virgin Islands',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'UG',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Uganda',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_uganda.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'UA',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Ukraine',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_ukraine.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'AE',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'United Arab Emirates',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_united_arab_emirates.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'GB',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'United Kingdom',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_united_kingdom.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'US',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'United States',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_united_states.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'UM',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'United States Minor Outlying Islands',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'UY',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Uruguay',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'UZ',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Uzbekistan',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_uzbekistan.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'VU',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Vanuatu',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_vanuatu.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'VA',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Vatican',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'VE',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Venezuela',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_venezuela.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'VN',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Vietnam',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_vietnam.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'WF',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Wallis And Futuna',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_wallis_and_futuna.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'EH',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Western Sahara',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'YE',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Yemen',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_yemen.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'ZM',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Zambia',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_zambia.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'ZW',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Zimbabwe',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/images/flags/shadow/flag_zimbabwe.png',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            },
                                            {
                                                value: {
                                                    type: 'String',
                                                    string: 'AX',
                                                    __typename: 'EditorFormFieldValue'
                                                },
                                                displayValue: 'Åland Islands',
                                                properties: [
                                                    {
                                                        name: 'image',
                                                        value: '/dxmdev/css/blank.gif',
                                                        __typename: 'EditorFormProperty'
                                                    }
                                                ],
                                                __typename: 'EditorFormFieldValueConstraint'
                                            }
                                        ],
                                        defaultValues: [],
                                        __typename: 'EditorFormField'
                                    },
                                    {
                                        nodeType: 'jmix:locationAware',
                                        name: 'j:geocodeAutomatically',
                                        displayName: 'Detect latitude/longitude automatically on save',
                                        description: '',
                                        errorMessage: '',
                                        mandatory: false,
                                        i18n: false,
                                        multiple: false,
                                        readOnly: false,
                                        requiredType: 'BOOLEAN',
                                        selectorType: 'Checkbox',
                                        selectorOptions: [],
                                        valueConstraints: [],
                                        defaultValues: [
                                            {
                                                string: 'true',
                                                __typename: 'EditorFormFieldValue'
                                            }
                                        ],
                                        __typename: 'EditorFormField'
                                    }
                                ],
                                __typename: 'EditorFormFieldSet'
                            },
                            {
                                name: 'jmix:geotagged',
                                displayName: 'Geocoding',
                                description: '',
                                dynamic: true,
                                activated: false,
                                displayed: true,
                                fields: [
                                    {
                                        nodeType: 'jmix:geotagged',
                                        name: 'j:latitude',
                                        displayName: 'Latitude',
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
                                        nodeType: 'jmix:geotagged',
                                        name: 'j:longitude',
                                        displayName: 'Longitude',
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
                            }
                        ]
                    }
                ]
            };
        field = {
            nodeType: 'jnt:imageReferenceLink',
            name: 'j:linkType',
            displayName: 'Link type'
        };
    });

    it('should add mixin to the right section', () => {
        const sections = addMixinToSection('jmix:internalLink', context.sections, field);
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
        let sections = addMixinToSection('jmix:internalLink', context.sections, field);
        sections = removeMixinFromSection('jmix:internalLink', sections);

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
});
