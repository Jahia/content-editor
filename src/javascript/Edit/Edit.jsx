import React, {useCallback, useEffect} from 'react';
import {withNotifications} from '@jahia/react-material';
import {Formik} from 'formik';
import EditPanel from '~/EditPanel';
import * as PropTypes from 'prop-types';
import {
    useContentEditorConfigContext,
    useContentEditorContext,
    withContentEditorDataContextProvider
} from '~/ContentEditor.context';
import {validate} from '~/Validation/validation';
import {saveNode} from './save/save.request';
import {PublicationInfoContextProvider} from '~/PublicationInfo/PublicationInfo.context';
import {LockManager} from '~/Lock/LockManager';
import {useTranslation} from 'react-i18next';
import {FormQuery} from './EditForm.gql-queries';
import {compose} from '~/utils';
import {useContentEditorSectionContext} from '~/ContentEditorSection/ContentEditorSection.context';
import {useDispatch} from 'react-redux';

import envEditCallbacks from './Edit.env';
import {adaptEditFormData} from './Edit.adapter';
import {Constants} from '~/ContentEditor.constants';
import {pcNavigateTo} from '~/pagecomposer.redux-actions';
import {useApolloClient} from '@apollo/react-hooks';

export const EditCmp = ({
    notificationContext
}) => {
    const client = useApolloClient();
    const {t} = useTranslation('content-editor');
    const contentEditorConfigContext = useContentEditorConfigContext();
    const {lang, nodeData, formQueryParams, initialValues, title} = useContentEditorContext();
    const {sections} = useContentEditorSectionContext();
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            // If nodeData.lockedAndCannotBeEdited, rely on callback after lock released
            if (nodeData.lockedAndCannotBeEdited && contentEditorConfigContext.envProps.onClosedCallback) {
                contentEditorConfigContext.envProps.onClosedCallback();
            }
        };
    }, [contentEditorConfigContext.envProps, nodeData.lockedAndCannotBeEdited]);

    const handleSubmit = useCallback((values, actions) => {
        contentEditorConfigContext.envProps.isNeedRefresh = true;

        saveNode({
            client,
            t,
            notificationContext,
            actions,
            data: {
                ...formQueryParams,
                nodeData,
                sections,
                values
            },
            editCallback: (node, mutateNode) => {
                const overridedStoredLocation = contentEditorConfigContext.envProps.handleRename && contentEditorConfigContext.envProps.handleRename(node, mutateNode);
                // Trigger Page Composer to reload iframe if system name was renamed
                if (node.path !== mutateNode.node.path) {
                    if (contentEditorConfigContext.env === 'standalone') {
                        dispatch(pcNavigateTo({oldPath: node.path, newPath: mutateNode.node.path}));
                    }
                }

                if (values[Constants.systemFields.OVERRIDE_SUBMIT_CALLBACK]) {
                    values[Constants.systemFields.OVERRIDE_SUBMIT_CALLBACK](overridedStoredLocation);
                } else {
                    const envEditCallback = envEditCallbacks[contentEditorConfigContext.env];
                    if (envEditCallback) {
                        envEditCallback(node.uuid, contentEditorConfigContext);
                    }
                }

                // Hard reFetch to be able to enable publication menu from jContent menu displayed in header
                // Note that node cache is flushed in save.request.js, we should probably replace this operation with
                // Something less invasive as this one reloads ALL queries.
                if (node.path === mutateNode.node.path) {
                    client.reFetchObservableQueries();
                }
            }
        });
    }, [client, t, notificationContext, dispatch, contentEditorConfigContext, formQueryParams, nodeData, sections]);

    return (
        <>
            <PublicationInfoContextProvider uuid={nodeData.uuid} lang={lang}>
                <Formik
                    validateOnMount
                    innerRef={formik => {
                        if (contentEditorConfigContext.envProps.setFormikRef) {
                            contentEditorConfigContext.envProps.setFormikRef(formik);
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

EditCmp.propTypes = {
    notificationContext: PropTypes.object.isRequired
};

export const Edit = compose(
    withNotifications(),
    withContentEditorDataContextProvider(FormQuery, adaptEditFormData)
)(EditCmp);
Edit.displayName = 'Edit';
export default Edit;
