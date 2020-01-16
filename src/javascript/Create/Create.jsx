import React from 'react';
import {ProgressOverlay} from '@jahia/react-material';
import {Formik} from 'formik';
import EditPanel from '~/EditPanel';
import * as PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {useFormDefinition} from '~/EditPanel/FormDefinitions';

import {ContentEditorContext} from '~/ContentEditor.context';

import {validate} from '~/Validation/validation';
import {createNode} from './CreateForm/create.request';
import {Constants} from '../ContentEditor.constants';

export const Create = ({
    client,
    notificationContext,
    setUrl,
    path,
    lang,
    uilang,
    site,
    siteDisplayableName,
    siteInfo,
    formQuery,
    formQueryParams
}) => {
    const {t} = useTranslation();
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
        uilang,
        site,
        siteInfo,
        siteDisplayableName,
        sections,
        nodeData,
        details,
        technicalInfo,
        mode: Constants.routes.baseCreateRoute
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
                validate={validate(sections)}
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
    setUrl: PropTypes.func,
    path: PropTypes.string.isRequired,
    notificationContext: PropTypes.object.isRequired,
    lang: PropTypes.string.isRequired,
    uilang: PropTypes.string.isRequired,
    site: PropTypes.string.isRequired,
    siteDisplayableName: PropTypes.string.isRequired,
    siteInfo: PropTypes.object.isRequired,
    formQuery: PropTypes.object.isRequired,
    formQueryParams: PropTypes.object.isRequired
};
