import React from 'react';
import {withNotifications} from '@jahia/react-material';
import {Formik} from 'formik';
import EditPanel from '~/EditPanel';
import * as PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {useContentEditorConfigContext, useContentEditorContext, withContentEditorDataContextProvider} from '~/ContentEditor.context';
import {validate} from '~/Validation/validation';
import {createNode} from './CreateForm/create.request';
import {FormQuery} from './CreateForm/createForm.gql-queries';
import {withApollo} from 'react-apollo';
import {compose} from '~/utils';
import envCreateCallbacks from './Create.env';
import {adaptCreateFormData} from './Create.adapter';
import {Constants} from '~/ContentEditor.constants';

const CreateCmp = ({
    client,
    notificationContext
}) => {
    const {t} = useTranslation();
    const contentEditorConfigContext = useContentEditorConfigContext();
    const {nodeData, sections, formQueryParams, initialValues, title} = useContentEditorContext();

    const handleSubmit = (values, actions) => {
        createNode({
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
            createCallback: createdNodeUuid => {
                if (values[Constants.systemFields.OVERRIDE_SUBMIT_CALLBACK]) {
                    values[Constants.systemFields.OVERRIDE_SUBMIT_CALLBACK](createdNodeUuid);
                } else {
                    const envCreateCallback = envCreateCallbacks[contentEditorConfigContext.env];
                    if (envCreateCallback) {
                        envCreateCallback(createdNodeUuid, formQueryParams.language, contentEditorConfigContext);
                    }
                }
            }
        });
    };

    return (
        <Formik
            initialValues={initialValues}
            render={props => <EditPanel {...props} title={title}/>}
            validate={validate(sections)}
            onSubmit={handleSubmit}
        />
    );
};

CreateCmp.propTypes = {
    client: PropTypes.object.isRequired,
    notificationContext: PropTypes.object.isRequired
};

export const Create = compose(
    withApollo,
    withNotifications(),
    withContentEditorDataContextProvider(FormQuery, adaptCreateFormData)
)(CreateCmp);
Create.displayName = 'Create';
export default Create;
