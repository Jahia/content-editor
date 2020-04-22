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
import envEditCallbacks from './Edit.env';
import {adaptEditFormData} from './Edit.adapter';
import {Constants} from '~/ContentEditor.constants';

export const EditCmp = ({
    client,
    notificationContext
}) => {
    const {t} = useTranslation();
    const contentEditorConfigContext = useContentEditorConfigContext();
    const {path, lang, nodeData, sections, formQueryParams, initialValues, title} = useContentEditorContext();

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
            editCallback: nodeUuid => {
                if (values[Constants.systemFields.OVERRIDE_SUBMIT_CALLBACK]) {
                    values[Constants.systemFields.OVERRIDE_SUBMIT_CALLBACK]();
                } else {
                    const envEditCallback = envEditCallbacks[contentEditorConfigContext.env];
                    if (envEditCallback) {
                        envEditCallback(nodeUuid, contentEditorConfigContext);
                    }
                }
            }
        });
    };

    return (
        <PublicationInfoContextProvider uuid={nodeData.uuid} lang={lang}>
            <Formik
                initialValues={initialValues}
                render={props => <EditPanel {...props} title={title}/>}
                validate={validate(sections)}
                onSubmit={handleSubmit}
            />
            {!nodeData.lockedAndCannotBeEdited && <LockManager path={path}/>}
        </PublicationInfoContextProvider>
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
