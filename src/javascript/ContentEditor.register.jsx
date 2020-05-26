import React from 'react';
import {registry} from '@jahia/ui-extender';
import {registerCEActions} from './registerCEActions';
import {Constants} from '~/ContentEditor.constants';
import ContentEditorApi from '~/Api/ContentEditor.api';
import ContentEditorRedux from './ContentEditor.redux';
import {ContentEditorHistoryContextProvider} from '~/ContentEditorHistory/ContentEditorHistory.context';

registry.add('app', 'content-editor-history-context', {
    targets: ['root:2.05'],
    render: next => <ContentEditorHistoryContextProvider>{next}</ContentEditorHistoryContextProvider>
});

registry.add('app', 'content-editor-api', {
    targets: ['root:16.5'],
    render: next => <><ContentEditorApi/>{next}</>
});

registerCEActions(registry);

registry.add('route', 'content-editor-edit-route', {
    targets: ['main:2.1'],
    path: '/content-editor/:lang/edit/:uuid',
    // eslint-disable-next-line react/prop-types
    render: ({match}) => (
        <ContentEditorRedux uuid={match.params.uuid}
                            mode={Constants.routes.baseEditRoute}
                            lang={match.params.lang}/>
    )
});

registry.add('route', 'content-editor-create-route', {
    targets: ['main:2.1'],
    path: '/content-editor/:lang/create/:parentUuid/:contentType',
    // eslint-disable-next-line react/prop-types
    render: ({match}) => (
        <ContentEditorRedux uuid={match.params.parentUuid}
                            mode={Constants.routes.baseCreateRoute}
                            lang={match.params.lang}
                            contentType={decodeURI(match.params.contentType)}/>
    )
});

registry.add('selectorType', 'callBacks', {
    targets: ['addMixin'],
    undo: (value, context) => {
        // Remove mixin and hide fields from previous values
        const previousMixin = value.properties.find(entry => entry.name === 'addMixin').value;
        let removedFields = [];
        let editorSection = context.editorContext.sections.reduce(
            (sections, section) =>
                [...sections, {
                    ...section, fieldSets: section.fieldSets.reduce((fieldSets, fieldSet) =>
                            [...fieldSets, {
                                ...fieldSet, fields: fieldSet.fields.reduce((fields, field) => {
                                    if (field.nodeType === previousMixin) {
                                        removedFields.push(field);
                                        return [...fields];
                                    }

                                    return [...fields, field];
                                }, [])
                            }]
                        , [])
                }]
            , []);
        editorSection = editorSection.reduce(
            (sections, section) =>
                [...sections, {
                    ...section, fieldSets: section.fieldSets.reduce((fieldSets, fieldSet) => {
                            if (fieldSet.name === previousMixin) {
                                fieldSet.fields = removedFields;
                                fieldSet.activated = false;
                            }

                            return [...fieldSets, fieldSet];
                        }
                        , [])
                }]
            , []);
        context.editorContext.setSections(editorSection);
    },
    do: (value, context) => {
        // Add mixin and display fields from new value
        const addedMixin = value.properties.find(entry => entry.name === 'addMixin').value;
        let addedFields = [];
        let editorSection = context.editorContext.sections.reduce(
            (sections, section) =>
                [...sections, {
                    ...section, fieldSets: section.fieldSets.reduce((fieldSets, fieldSet) =>
                            [...fieldSets, {
                                ...fieldSet, fields: fieldSet.fields.reduce((fields, field) => {
                                    if (field.nodeType === addedMixin) {
                                        addedFields.push(field);
                                        return [...fields];
                                    }

                                    return [...fields, field];
                                }, [])
                            }]
                        , [])
                }]
            , []);

        editorSection = editorSection.reduce(
            (sections, section) =>
                [...sections, {
                    ...section, fieldSets: section.fieldSets.reduce((fieldSets, fieldSet) => {
                            let updatedFields = fieldSet.fields;
                            if (fieldSet.name === context.field.nodeType) {
                                updatedFields = fieldSet.fields.reduce((fields, field) => {
                                    if (field.name === context.field.name) {
                                        return [...fields, field, ...addedFields];
                                    }

                                    return [...fields, field];
                                }, []);
                            }

                            if (fieldSet.name === addedMixin) {
                                fieldSet.dynamic = true;
                                fieldSet.activated = true;
                            }

                            return [...fieldSets, {...fieldSet, fields: updatedFields}];
                        }
                        , [])
                }]
            , []);
        context.editorContext.setSections(editorSection);
    }
});

// Register GWT Hooks
window.top.jahiaGwtHook = {
    // Hook on edit engine opening
    edit: ({uuid, lang, siteKey, uilang}) => {
        window.CE_API.edit(uuid, siteKey, lang, uilang);
    },
    // Hook on create engine opening, also hook on create content type selector
    create: ({uuid, path, lang, siteKey, uilang, contentTypes, excludedNodeTypes, includeSubTypes}) => {
        window.CE_API.create(uuid, path, siteKey, lang, uilang, contentTypes, excludedNodeTypes, includeSubTypes);
    }
};

console.debug('%c Content Editor is activated', 'color: #3c8cba');
