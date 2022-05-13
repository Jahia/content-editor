import React, {useCallback, useEffect} from 'react';
import {useNotifications} from '@jahia/react-material';
import {Formik} from 'formik';
import EditPanel from '~/EditPanel';
import {useContentEditorConfigContext, useContentEditorContext} from '~/ContentEditor.context';
import {validate} from '~/Validation/validation';
import {saveNode} from './save/save.request';
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
        return saveNode({
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

    // Todo share and centralize code
    useEffect(() => {
        let formikRef = contentEditorConfigContext.envProps.formikRef;
        console.log('update from i18nContext', formikRef.current);
        formikRef.current.setValues({
            ...formikRef.current.values,
            ...i18nContext.shared,
            ...i18nContext[lang]
        });
    }, [contentEditorConfigContext.envProps, i18nContext, lang]);

    return (
        <>
            <PublicationInfoContextProvider uuid={nodeData.uuid} lang={lang}>
                <Formik
                    validateOnMount
                    innerRef={formik => {
                        // Todo share and centralize code
                        if (contentEditorConfigContext.envProps.dirtyRef && formik) {
                            contentEditorConfigContext.envProps.dirtyRef.current = formik.dirty || Object.keys(i18nContext).some(k => k !== lang && k !== 'shared' && i18nContext[k] && Object.keys(i18nContext[k]).length > 0);
                        }

                        if (contentEditorConfigContext.envProps.formikRef) {
                            contentEditorConfigContext.envProps.formikRef.current = formik;
                        }
                    }}
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

Edit.displayName = 'Edit';
export default Edit;
