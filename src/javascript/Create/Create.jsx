import React, {useEffect} from 'react';
import {withNotifications} from '@jahia/react-material';
import {Formik} from 'formik';
import EditPanel from '~/EditPanel';
import * as PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {useContentEditorConfigContext, useContentEditorContext} from '~/ContentEditor.context';
import {useContentEditorSectionContext} from '~/ContentEditorSection/ContentEditorSection.context';

import {validate} from '~/Validation/validation';
import {createNode} from './CreateForm/create.request';
import {useApolloClient} from '@apollo/react-hooks';

const CreateCmp = ({
    notificationContext
}) => {
    const client = useApolloClient();
    const {t} = useTranslation('content-editor');
    const contentEditorConfigContext = useContentEditorConfigContext();
    const {nodeData, formQueryParams, initialValues, title} = useContentEditorContext();
    const {sections} = useContentEditorSectionContext();

    useEffect(() => {
        return () => {
            if (contentEditorConfigContext.envProps.onClosedCallback) {
                contentEditorConfigContext.envProps.onClosedCallback();
            }
        };
    }, [contentEditorConfigContext.envProps]);

    const handleSubmit = (values, actions) => {
        return createNode({
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
            createCallback: info => {
                const envCreateCallback = contentEditorConfigContext.envProps.createCallback;
                if (envCreateCallback) {
                    envCreateCallback(info, contentEditorConfigContext);
                }
            }
        });
    };

    return (
        <Formik
            innerRef={formik => {
                if (contentEditorConfigContext.envProps.formikRef) {
                    contentEditorConfigContext.envProps.formikRef.current = formik;
                }
            }}
            initialValues={initialValues}
            validate={validate(sections)}
            onSubmit={handleSubmit}
        >
            {props => <EditPanel {...props} title={title}/>}
        </Formik>
    );
};

CreateCmp.propTypes = {
    notificationContext: PropTypes.object.isRequired
};

export const Create = withNotifications()(CreateCmp);
Create.displayName = 'Create';
export default Create;
