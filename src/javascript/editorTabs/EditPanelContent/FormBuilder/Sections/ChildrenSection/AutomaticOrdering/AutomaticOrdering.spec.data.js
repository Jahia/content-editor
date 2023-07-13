export const listOrderingFieldSet = (fieldSetReadOnly, propsReadOnly) => ({
    name: 'jmix:orderedList',
    displayName: 'List ordering (automatic)',
    description: '',
    dynamic: true,
    activated: false,
    displayed: true,
    readOnly: fieldSetReadOnly,
    fields: [
        {
            name: 'jmix:orderedList_ce:manualOrdering'
        },
        {
            nodeType: 'jmix:orderedList',
            name: 'jmix:orderedList_ignoreCase',
            propertyName: 'ignoreCase',
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
            name: 'jmix:orderedList_firstField',
            propertyName: 'firstField',
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
            name: 'jmix:orderedList_firstDirection',
            propertyName: 'firstDirection',
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
            name: 'jmix:orderedList_secondField',
            propertyName: 'secondField',
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
            name: 'jmix:orderedList_secondDirection',
            propertyName: 'secondDirection',
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
            name: 'jmix:orderedList_thirdField',
            propertyName: 'thirdField',
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
            name: 'jmix:orderedList_thirdDirection',
            propertyName: 'thirdDirection',
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
});
