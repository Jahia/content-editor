export const listOrderingSection = (fieldSetReadOnly, propsReadOnly) => ({
    name: 'listOrdering',
    displayName: 'listOrdering',
    description: null,
    hide: true,
    fieldSets: [
        {
            name: 'jmix:orderedList',
            displayName: 'List ordering (automatic)',
            description: '',
            dynamic: true,
            activated: false,
            displayed: true,
            readOnly: fieldSetReadOnly,
            fields: [
                {
                    nodeType: 'jmix:orderedList',
                    name: 'ignoreCase',
                    displayName: 'Case insensitive',
                    description: '',
                    errorMessage: '',
                    mandatory: false,
                    i18n: false,
                    multiple: false,
                    readOnly: propsReadOnly,
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
                },
                {
                    nodeType: 'jmix:orderedList',
                    name: 'firstField',
                    displayName: 'First field to order by',
                    description: '',
                    errorMessage: '',
                    mandatory: false,
                    i18n: false,
                    multiple: false,
                    readOnly: propsReadOnly,
                    requiredType: 'STRING',
                    selectorType: 'Choicelist',
                    selectorOptions: [
                        {
                            name: 'sortableFieldnames',
                            value: '',
                            __typename: 'EditorFormProperty'
                        }
                    ],
                    valueConstraints: [
                        {
                            value: {
                                type: 'String',
                                string: 'jcr:created',
                                __typename: 'EditorFormFieldValue'
                            },
                            displayValue: 'Creation date',
                            properties: [],
                            __typename: 'EditorFormFieldValueConstraint'
                        },
                        {
                            value: {
                                type: 'String',
                                string: 'jcr:createdBy',
                                __typename: 'EditorFormFieldValue'
                            },
                            displayValue: 'Creator',
                            properties: [],
                            __typename: 'EditorFormFieldValueConstraint'
                        },
                        {
                            value: {
                                type: 'String',
                                string: 'jcr:description',
                                __typename: 'EditorFormFieldValue'
                            },
                            displayValue: 'Description',
                            properties: [],
                            __typename: 'EditorFormFieldValueConstraint'
                        },
                        {
                            value: {
                                type: 'String',
                                string: 'jcr:lastModifiedBy',
                                __typename: 'EditorFormFieldValue'
                            },
                            displayValue: 'Last contributor',
                            properties: [],
                            __typename: 'EditorFormFieldValueConstraint'
                        },
                        {
                            value: {
                                type: 'String',
                                string: 'jcr:lastModified',
                                __typename: 'EditorFormFieldValue'
                            },
                            displayValue: 'Last modification date',
                            properties: [],
                            __typename: 'EditorFormFieldValueConstraint'
                        },
                        {
                            value: {
                                type: 'String',
                                string: 'j:lastPublished',
                                __typename: 'EditorFormFieldValue'
                            },
                            displayValue: 'Last Publication Date',
                            properties: [],
                            __typename: 'EditorFormFieldValueConstraint'
                        },
                        {
                            value: {
                                type: 'String',
                                string: 'j:lastPublishedBy',
                                __typename: 'EditorFormFieldValue'
                            },
                            displayValue: 'Last Publisher',
                            properties: [],
                            __typename: 'EditorFormFieldValueConstraint'
                        },
                        {
                            value: {
                                type: 'String',
                                string: 'text',
                                __typename: 'EditorFormFieldValue'
                            },
                            displayValue: 'Text',
                            properties: [],
                            __typename: 'EditorFormFieldValueConstraint'
                        }
                    ],
                    defaultValues: [],
                    __typename: 'EditorFormField'
                },
                {
                    nodeType: 'jmix:orderedList',
                    name: 'firstDirection',
                    displayName: 'Order direction',
                    description: '',
                    errorMessage: '',
                    mandatory: false,
                    i18n: false,
                    multiple: false,
                    readOnly: propsReadOnly,
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
                                string: 'asc',
                                __typename: 'EditorFormFieldValue'
                            },
                            displayValue: 'ascending',
                            properties: [],
                            __typename: 'EditorFormFieldValueConstraint'
                        },
                        {
                            value: {
                                type: 'String',
                                string: 'desc',
                                __typename: 'EditorFormFieldValue'
                            },
                            displayValue: 'descending',
                            properties: [],
                            __typename: 'EditorFormFieldValueConstraint'
                        }
                    ],
                    defaultValues: [
                        {
                            string: 'asc',
                            __typename: 'EditorFormFieldValue'
                        }
                    ],
                    __typename: 'EditorFormField'
                },
                {
                    nodeType: 'jmix:orderedList',
                    name: 'secondField',
                    displayName: 'Second field to order by',
                    description: '',
                    errorMessage: '',
                    mandatory: false,
                    i18n: false,
                    multiple: false,
                    readOnly: propsReadOnly,
                    requiredType: 'STRING',
                    selectorType: 'Choicelist',
                    selectorOptions: [
                        {
                            name: 'sortableFieldnames',
                            value: '',
                            __typename: 'EditorFormProperty'
                        }
                    ],
                    valueConstraints: [
                        {
                            value: {
                                type: 'String',
                                string: 'jcr:created',
                                __typename: 'EditorFormFieldValue'
                            },
                            displayValue: 'Creation date',
                            properties: [],
                            __typename: 'EditorFormFieldValueConstraint'
                        },
                        {
                            value: {
                                type: 'String',
                                string: 'jcr:createdBy',
                                __typename: 'EditorFormFieldValue'
                            },
                            displayValue: 'Creator',
                            properties: [],
                            __typename: 'EditorFormFieldValueConstraint'
                        },
                        {
                            value: {
                                type: 'String',
                                string: 'jcr:description',
                                __typename: 'EditorFormFieldValue'
                            },
                            displayValue: 'Description',
                            properties: [],
                            __typename: 'EditorFormFieldValueConstraint'
                        },
                        {
                            value: {
                                type: 'String',
                                string: 'jcr:lastModifiedBy',
                                __typename: 'EditorFormFieldValue'
                            },
                            displayValue: 'Last contributor',
                            properties: [],
                            __typename: 'EditorFormFieldValueConstraint'
                        },
                        {
                            value: {
                                type: 'String',
                                string: 'jcr:lastModified',
                                __typename: 'EditorFormFieldValue'
                            },
                            displayValue: 'Last modification date',
                            properties: [],
                            __typename: 'EditorFormFieldValueConstraint'
                        },
                        {
                            value: {
                                type: 'String',
                                string: 'j:lastPublished',
                                __typename: 'EditorFormFieldValue'
                            },
                            displayValue: 'Last Publication Date',
                            properties: [],
                            __typename: 'EditorFormFieldValueConstraint'
                        },
                        {
                            value: {
                                type: 'String',
                                string: 'j:lastPublishedBy',
                                __typename: 'EditorFormFieldValue'
                            },
                            displayValue: 'Last Publisher',
                            properties: [],
                            __typename: 'EditorFormFieldValueConstraint'
                        },
                        {
                            value: {
                                type: 'String',
                                string: 'text',
                                __typename: 'EditorFormFieldValue'
                            },
                            displayValue: 'Text',
                            properties: [],
                            __typename: 'EditorFormFieldValueConstraint'
                        }
                    ],
                    defaultValues: [],
                    __typename: 'EditorFormField'
                },
                {
                    nodeType: 'jmix:orderedList',
                    name: 'secondDirection',
                    displayName: 'Order direction',
                    description: '',
                    errorMessage: '',
                    mandatory: false,
                    i18n: false,
                    multiple: false,
                    readOnly: propsReadOnly,
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
                                string: 'asc',
                                __typename: 'EditorFormFieldValue'
                            },
                            displayValue: 'ascending',
                            properties: [],
                            __typename: 'EditorFormFieldValueConstraint'
                        },
                        {
                            value: {
                                type: 'String',
                                string: 'desc',
                                __typename: 'EditorFormFieldValue'
                            },
                            displayValue: 'descending',
                            properties: [],
                            __typename: 'EditorFormFieldValueConstraint'
                        }
                    ],
                    defaultValues: [
                        {
                            string: 'asc',
                            __typename: 'EditorFormFieldValue'
                        }
                    ],
                    __typename: 'EditorFormField'
                },
                {
                    nodeType: 'jmix:orderedList',
                    name: 'thirdField',
                    displayName: 'Third field to order by',
                    description: '',
                    errorMessage: '',
                    mandatory: false,
                    i18n: false,
                    multiple: false,
                    readOnly: propsReadOnly,
                    requiredType: 'STRING',
                    selectorType: 'Choicelist',
                    selectorOptions: [
                        {
                            name: 'sortableFieldnames',
                            value: '',
                            __typename: 'EditorFormProperty'
                        }
                    ],
                    valueConstraints: [
                        {
                            value: {
                                type: 'String',
                                string: 'jcr:created',
                                __typename: 'EditorFormFieldValue'
                            },
                            displayValue: 'Creation date',
                            properties: [],
                            __typename: 'EditorFormFieldValueConstraint'
                        },
                        {
                            value: {
                                type: 'String',
                                string: 'jcr:createdBy',
                                __typename: 'EditorFormFieldValue'
                            },
                            displayValue: 'Creator',
                            properties: [],
                            __typename: 'EditorFormFieldValueConstraint'
                        },
                        {
                            value: {
                                type: 'String',
                                string: 'jcr:description',
                                __typename: 'EditorFormFieldValue'
                            },
                            displayValue: 'Description',
                            properties: [],
                            __typename: 'EditorFormFieldValueConstraint'
                        },
                        {
                            value: {
                                type: 'String',
                                string: 'jcr:lastModifiedBy',
                                __typename: 'EditorFormFieldValue'
                            },
                            displayValue: 'Last contributor',
                            properties: [],
                            __typename: 'EditorFormFieldValueConstraint'
                        },
                        {
                            value: {
                                type: 'String',
                                string: 'jcr:lastModified',
                                __typename: 'EditorFormFieldValue'
                            },
                            displayValue: 'Last modification date',
                            properties: [],
                            __typename: 'EditorFormFieldValueConstraint'
                        },
                        {
                            value: {
                                type: 'String',
                                string: 'j:lastPublished',
                                __typename: 'EditorFormFieldValue'
                            },
                            displayValue: 'Last Publication Date',
                            properties: [],
                            __typename: 'EditorFormFieldValueConstraint'
                        },
                        {
                            value: {
                                type: 'String',
                                string: 'j:lastPublishedBy',
                                __typename: 'EditorFormFieldValue'
                            },
                            displayValue: 'Last Publisher',
                            properties: [],
                            __typename: 'EditorFormFieldValueConstraint'
                        },
                        {
                            value: {
                                type: 'String',
                                string: 'text',
                                __typename: 'EditorFormFieldValue'
                            },
                            displayValue: 'Text',
                            properties: [],
                            __typename: 'EditorFormFieldValueConstraint'
                        }
                    ],
                    defaultValues: [],
                    __typename: 'EditorFormField'
                },
                {
                    nodeType: 'jmix:orderedList',
                    name: 'thirdDirection',
                    displayName: 'Order direction',
                    description: '',
                    errorMessage: '',
                    mandatory: false,
                    i18n: false,
                    multiple: false,
                    readOnly: propsReadOnly,
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
                                string: 'asc',
                                __typename: 'EditorFormFieldValue'
                            },
                            displayValue: 'ascending',
                            properties: [],
                            __typename: 'EditorFormFieldValueConstraint'
                        },
                        {
                            value: {
                                type: 'String',
                                string: 'desc',
                                __typename: 'EditorFormFieldValue'
                            },
                            displayValue: 'descending',
                            properties: [],
                            __typename: 'EditorFormFieldValueConstraint'
                        }
                    ],
                    defaultValues: [
                        {
                            string: 'asc',
                            __typename: 'EditorFormFieldValue'
                        }
                    ],
                    __typename: 'EditorFormField'
                }
            ],
            __typename: 'EditorFormFieldSet'
        }
    ],
    __typename: 'EditorFormSection'
});
