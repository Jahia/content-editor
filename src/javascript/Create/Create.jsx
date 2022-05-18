import React, {useEffect, useState} from 'react';
import {useNotifications} from '@jahia/react-material';
import {Formik} from 'formik';
import EditPanel from '~/EditPanel';
import {useTranslation} from 'react-i18next';
import {useContentEditorConfigContext, useContentEditorContext} from '~/ContentEditor.context';
import {useContentEditorSectionContext} from '~/ContentEditorSection/ContentEditorSection.context';

import {validate} from '~/Validation/validation';
import {createNode} from './CreateForm/create.request';
import {useApolloClient} from '@apollo/react-hooks';

export const Create = () => {
    const notificationContext = useNotifications();
    const client = useApolloClient();
    const {t} = useTranslation('content-editor');
    const contentEditorConfigContext = useContentEditorConfigContext();
    const {nodeData, formQueryParams, initialValues, title, i18nContext} = useContentEditorContext();
    const {sections} = useContentEditorSectionContext();
    const createAnotherState = useState(false);
    const createAnother = {
        value: createAnotherState[0], set: createAnotherState[1]
    };

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
                values,
                i18nContext
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
            validateOnChange={false}
            validateOnBlur={false}
            initialValues={initialValues}
            validate={validate(sections)}
            onSubmit={handleSubmit}
        >
            {props => <EditPanel {...props} createAnother={createAnother} title={title}/>}
        </Formik>
    );
};

Create.displayName = 'Create';
export default Create;
