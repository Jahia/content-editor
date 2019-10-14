import React from 'react';
import {ProgressOverlay} from '@jahia/react-material';
import {Formik} from 'formik';
import EditPanel from '~/EditPanelContainer/EditPanel';
import * as PropTypes from 'prop-types';
import {useFormDefinition} from '~/EditPanelContainer/EditPanel/FormDefinitions';

import {ContentEditorContext} from '~/ContentEditor.context';

import {requiredValidation} from '~/Validation/required';
import {saveNode} from './save/save.request';

export const Edit = ({
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
        saveNode({
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

Edit.defaultProps = {
    setUrl: () => {}
};

Edit.propTypes = {
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
