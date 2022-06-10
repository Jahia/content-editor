import React, {useCallback, useEffect} from 'react';
import {useNotifications} from '@jahia/react-material';
import {Formik} from 'formik';
import {EditPanel} from '~/EditPanel';
import {useContentEditorConfigContext, useContentEditorContext} from '~/ContentEditor.context';
import {validate} from '~/Validation/validation';
import {updateNode} from './updateNode';
import {PublicationInfoContextProvider} from '~/PublicationInfo/PublicationInfo.context';
import {LockManager} from '~/Lock/LockManager';
import {useTranslation} from 'react-i18next';
import {useContentEditorSectionContext} from '~/ContentEditorSection/ContentEditorSection.context';
import {useApolloClient} from '@apollo/react-hooks';

export const Edit = () => {
    const notificationContext = useNotifications();
    const client = useApolloClient();
    const {t} = useTranslation('content-editor');
    const contentEditorConfigContext = useContentEditorConfigContext();
    const {lang, nodeData, formQueryParams, initialValues, title, i18nContext} = useContentEditorContext();
    const {sections} = useContentEditorSectionContext();

    useEffect(() => {
        return () => {
            // If nodeData.lockedAndCannotBeEdited, rely on callback after lock released
            if (nodeData.lockedAndCannotBeEdited && contentEditorConfigContext.envProps.onClosedCallback) {
                contentEditorConfigContext.envProps.onClosedCallback();
            }
        };
    }, [contentEditorConfigContext.envProps, nodeData.lockedAndCannotBeEdited]);

    const handleSubmit = useCallback((values, actions) => {
        return updateNode({
            client,
            t,
            notificationContext,
            actions,
            data: {
                ...formQueryParams,
                nodeData,
                sections,
                values,
                i18nContext
            },
            editCallback: info => {
                const {originalNode, updatedNode} = info;

                const envEditCallback = contentEditorConfigContext.envProps.editCallback;
                if (envEditCallback) {
                    envEditCallback(info, contentEditorConfigContext);
                }

                // Hard reFetch to be able to enable publication menu from jContent menu displayed in header
                // Note that node cache is flushed in save.request.js, we should probably replace this operation with
                // Something less invasive as this one reloads ALL queries.
                if (originalNode.path === updatedNode.path) {
                    client.reFetchObservableQueries();
                }
            }
        });
    }, [client, t, notificationContext, contentEditorConfigContext, formQueryParams, nodeData, sections, i18nContext]);

    return (
        <>
            <PublicationInfoContextProvider uuid={nodeData.uuid} lang={lang}>
                <Formik
                    validateOnMount
                    validateOnChange={false}
                    initialValues={initialValues}
                    validate={validate(sections)}
                    onSubmit={handleSubmit}
                >
                    {() => <EditPanel title={title}/>}
                </Formik>
            </PublicationInfoContextProvider>
            {!nodeData.lockedAndCannotBeEdited && <LockManager uuid={nodeData.uuid} onLockReleased={contentEditorConfigContext.envProps.onClosedCallback}/>}
        </>
    );
};

