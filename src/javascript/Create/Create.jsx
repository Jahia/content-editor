import React, {useEffect, useState} from 'react';
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

const CreateCmp = ({notificationContext}) => {
    const client = useApolloClient();
    const {t} = useTranslation('content-editor');
    const contentEditorConfigContext = useContentEditorConfigContext();
    const {lang, nodeData, formQueryParams, initialValues, title, i18nContext} = useContentEditorContext();
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
        <Formik
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
            {props => <EditPanel {...props} createAnother={createAnother} title={title}/>}
        </Formik>
    );
};

CreateCmp.propTypes = {
    notificationContext: PropTypes.object.isRequired
};

export const Create = withNotifications()(CreateCmp);
Create.displayName = 'Create';
export default Create;
