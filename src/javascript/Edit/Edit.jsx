import React from 'react';
import {withNotifications} from '@jahia/react-material';
import {Formik} from 'formik';
import EditPanel from '~/EditPanel';
import * as PropTypes from 'prop-types';
import {useContentEditorContext, withContentEditorDataContextProvider} from '~/ContentEditor.context';
import {validate} from '~/Validation/validation';
import {saveNode} from './save/save.request';
import {PublicationInfoContextProvider} from '~/PublicationInfo/PublicationInfo.context';
import {LockManager} from '~/Lock/LockManager';
import {useTranslation} from 'react-i18next';
import {FormQuery} from './EditForm.gql-queries';
import {withApollo} from 'react-apollo';
import {compose} from '~/utils';
import {useContentEditorConfigContext} from '~/ContentEditor.context';
import {useContentEditorSectionContext} from '~/ContentEditorSection/ContentEditorSection.context';
import {useDispatch} from 'react-redux';
import {invalidateRefetch} from '~/EditPanel/EditPanel.refetches';

import envEditCallbacks from './Edit.env';
import {adaptEditFormData} from './Edit.adapter';
import {Constants} from '~/ContentEditor.constants';
import {getPreviewPath} from '~/EditPanel/EditPanelContent/Preview/Preview.utils';
import {pcNavigateTo} from '~/pagecomposer.redux-actions';

export const EditCmp = ({
    client,
    notificationContext
}) => {
    const {t} = useTranslation('content-editor');
    const contentEditorConfigContext = useContentEditorConfigContext();
    const {lang, nodeData, formQueryParams, initialValues, title} = useContentEditorContext();
    const {sections} = useContentEditorSectionContext();
    const dispatch = useDispatch();

    const handleSubmit = (values, actions) => {
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
                    dispatch(pcNavigateTo({oldPath: node.path, newPath: mutateNode.node.path}));
                    invalidateRefetch(`${getPreviewPath(nodeData)}_${lang}`);
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
                client.reFetchObservableQueries();
            }
        });
    };

    return (
        <>
            <PublicationInfoContextProvider uuid={nodeData.uuid} lang={lang}>
                <Formik
                    enableReinitialize
                    validateOnMount
                    initialValues={initialValues}
                    validate={validate(sections)}
                    onSubmit={handleSubmit}
                >
                    {props => <EditPanel {...props} title={title}/>}
                </Formik>
            </PublicationInfoContextProvider>
            {!nodeData.lockedAndCannotBeEdited && <LockManager uuid={nodeData.uuid}/>}
        </>
    );
};

EditCmp.propTypes = {
    client: PropTypes.object.isRequired,
    notificationContext: PropTypes.object.isRequired
};

export const Edit = compose(
    withApollo,
    withNotifications(),
    withContentEditorDataContextProvider(FormQuery, adaptEditFormData)
)(EditCmp);
Edit.displayName = 'Edit';
export default Edit;
