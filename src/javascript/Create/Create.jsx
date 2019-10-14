import React from 'react';
import {ProgressOverlay} from '@jahia/react-material';
import {Formik} from 'formik';
import EditPanel from '~/EditPanel';
import * as PropTypes from 'prop-types';
import {useFormDefinition} from '~/EditPanel/FormDefinitions';

import {ContentEditorContext} from '~/ContentEditor.context';

import {requiredValidation} from '~/Validation/required';
import {createNode} from './CreateForm/create.request';

export const Create = ({
    client,
    notificationContext,
    t,
    setUrl,
    path,
    lang,
    uiLang,
    site,
    siteDisplayableName,
    siteInfo,
    formQuery,
    formQueryParams
}) => {
    const {
        loading,
        error,
        errorMessage,
        nodeData,
        initialValues,
        details,
        technicalInfo,
        sections,
        title
    } = useFormDefinition(formQuery, formQueryParams, t);

    if (error) {
        console.error(error);
        return <>{errorMessage}</>;
    }

    if (loading) {
        return <ProgressOverlay/>;
    }

    const editorContext = {
        path,
        lang,
        uiLang,
        site,
        siteInfo,
        siteDisplayableName,
        sections,
        nodeData,
        details,
        technicalInfo
    };

    const handleSubmit = (values, actions) => {
        createNode({
            client,
            t,
            notificationContext,
            actions,
            setUrl,
            data: {
                ...formQueryParams,
                nodeData,
                sections,
                values
            }
        });
    };

    return (
        <ContentEditorContext.Provider value={editorContext}>
            <Formik
                initialValues={initialValues}
                render={props => <EditPanel {...props} title={title}/>}
                validate={requiredValidation(sections)}
                onSubmit={handleSubmit}
            />
        </ContentEditorContext.Provider>
    );
};

Create.defaultProps = {
    setUrl: () => {}
};

Create.propTypes = {
    client: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    setUrl: PropTypes.func,
    path: PropTypes.string.isRequired,
    notificationContext: PropTypes.object.isRequired,
    lang: PropTypes.string.isRequired,
    uiLang: PropTypes.string.isRequired,
    site: PropTypes.string.isRequired,
    siteDisplayableName: PropTypes.string.isRequired,
    siteInfo: PropTypes.object.isRequired,
    formQuery: PropTypes.object.isRequired,
    formQueryParams: PropTypes.object.isRequired
};
