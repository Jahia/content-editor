import React from 'react';
import {compose, withApollo} from 'react-apollo';
import {translate} from 'react-i18next';
import {ProgressOverlay, withNotifications} from '@jahia/react-material';
import {Constants} from '~/ContentEditor.constants';
import {Formik} from 'formik';
import EditPanel from './EditPanel';
import * as PropTypes from 'prop-types';
import {useFormDefinition} from './FormDefinitions';
import {withSiteInfo} from './SiteData';
import {saveNode} from '~/Edit/save/save.request';
import {createNode} from '~/Create/create.request';

import {ContentEditorContext} from '../ContentEditor.context';

import {requiredValidation} from './validation/required';

const submitActionMapper = {
    [Constants.editPanel.submitOperation.SAVE]: saveNode,
    [Constants.editPanel.submitOperation.CREATE]: createNode
};

export const EditPanelContainer = ({
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
        const operation = values[Constants.editPanel.OPERATION_FIELD];
        const submitAction = submitActionMapper[operation];

        if (!submitAction) {
            console.warn(`Unknown submit operation: ${operation}`);
            actions.setSubmitting(false);
        }

        submitAction({
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

EditPanelContainer.defaultProps = {
    setUrl: () => {}
};

EditPanelContainer.propTypes = {
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

const EditPanelContainerCmp = compose(
    translate(),
    withNotifications(),
    withApollo,
    withSiteInfo
)(EditPanelContainer);

EditPanelContainerCmp.displayName = 'EditPanelContainer';

export default EditPanelContainerCmp;
