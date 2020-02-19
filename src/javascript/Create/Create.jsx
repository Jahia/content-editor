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
import {Constants} from '~/ContentEditor.constants';

const CreateCmp = ({
    client,
    notificationContext
}) => {
    const {t} = useTranslation();
    const {setUrl, createCallback} = useContentEditorConfigContext();
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
            createCallback: createdNodePath => {
                // TODO add genericity here
                // redux create
                if (setUrl) {
                    setUrl({
                        language: formQueryParams.language,
                        mode: Constants.routes.baseEditRoute,
                        path: createdNodePath,
                        params: {}
                    });
                // Custom create callback
                } else if (createCallback) {
                    createCallback(createdNodePath);
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
    withContentEditorDataContextProvider(FormQuery)
)(CreateCmp);
Create.displayName = 'Create';
export default Create;
