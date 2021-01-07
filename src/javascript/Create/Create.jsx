import React from 'react';
import {withNotifications} from '@jahia/react-material';
import {Formik} from 'formik';
import EditPanel from '~/EditPanel';
import * as PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {
    useContentEditorConfigContext,
    useContentEditorContext,
    withContentEditorDataContextProvider
} from '~/ContentEditor.context';
import {useContentEditorSectionContext} from '~/ContentEditorSection/ContentEditorSection.context';

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
    const {t} = useTranslation('content-editor');
    const contentEditorConfigContext = useContentEditorConfigContext();
    const {nodeData, formQueryParams, initialValues, title} = useContentEditorContext();
    const {sections} = useContentEditorSectionContext();

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
            validate={validate(sections)}
            onSubmit={handleSubmit}
        >
            {props => <EditPanel {...props} title={title}/>}
        </Formik>
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
