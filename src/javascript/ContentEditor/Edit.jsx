import React, {useCallback, useEffect} from 'react';
import {useNotifications} from '@jahia/react-material';
import {Formik} from 'formik';
import {EditPanel} from './EditPanel';
import {
    PublicationInfoContextProvider,
    useContentEditorConfigContext,
    useContentEditorContext,
    useContentEditorSectionContext
} from '~/contexts';
import {validate} from '~/validation';
import {updateNode} from './updateNode';
import {LockManager} from './LockManager';
import {useTranslation} from 'react-i18next';
import {useApolloClient} from '@apollo/react-hooks';

export const Edit = () => {
    const notificationContext = useNotifications();
    const client = useApolloClient();
    const {t} = useTranslation('content-editor');
    const contentEditorConfigContext = useContentEditorConfigContext();
    const {onClosedCallback, editCallback} = contentEditorConfigContext;
    const {lang, nodeData, initialValues, title, i18nContext} = useContentEditorContext();
    const {sections} = useContentEditorSectionContext();

    useEffect(() => {
        return () => {
            // If nodeData.lockedAndCannotBeEdited, rely on callback after lock released
            if (nodeData.lockedAndCannotBeEdited) {
                onClosedCallback();
            }
        };
    }, [onClosedCallback, nodeData.lockedAndCannotBeEdited]);

    const handleSubmit = useCallback((values, actions) => {
        return updateNode({
            client,
            t,
            notificationContext,
            actions,
            data: {
                nodeData,
                sections,
                values,
                language: lang,
                i18nContext
            },
            editCallback: info => {
                const {originalNode, updatedNode} = info;

                editCallback(info, contentEditorConfigContext);

                // Hard reFetch to be able to enable publication menu from jContent menu displayed in header
                // Note that node cache is flushed in save.request.js, we should probably replace this operation with
                // Something less invasive as this one reloads ALL queries.
                if (originalNode.path === updatedNode.path) {
                    client.reFetchObservableQueries();
                }
            }
        });
    }, [client, t, notificationContext, editCallback, contentEditorConfigContext, lang, nodeData, sections, i18nContext]);

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
            {!nodeData.lockedAndCannotBeEdited && <LockManager uuid={nodeData.uuid} onLockReleased={onClosedCallback}/>}
        </>
    );
};

