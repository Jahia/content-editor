import React from 'react';
import {compose, withApollo} from 'react-apollo';
import {translate} from 'react-i18next';
import {ProgressOverlay, withNotifications} from '@jahia/react-material';
import EditPanelConstants from './EditPanel/EditPanelConstants';
import {Formik} from 'formik';
import EditPanel from './EditPanel';
import * as PropTypes from 'prop-types';
import {useFormDefinition} from './FormDefinitions';
import {withSiteInfo} from './SiteData';
import {publishNode, saveNode, unpublishNode} from './EditPanel.redux-actions';

import {ContentEditorContext} from '../ContentEditor.context';

const submitActionMapper = {
    [EditPanelConstants.submitOperation.SAVE]: saveNode,
    [EditPanelConstants.submitOperation.SAVE_PUBLISH]: publishNode,
    [EditPanelConstants.submitOperation.UNPUBLISH]: unpublishNode
};

export const EditPanelContainer = ({
    client,
    notificationContext,
    t,
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
        const submitAction = submitActionMapper[values[EditPanelConstants.systemFields.SYSTEM_SUBMIT_OPERATION]];

        if (!submitAction) {
            console.warn(
                'Unknown submit operation: ' +
                values[EditPanelConstants.systemFields.SYSTEM_SUBMIT_OPERATION]
            );
            actions.setSubmitting(false);
        }

        submitAction({
            client,
            nodeData,
            lang,
            uiLang,
            notificationContext,
            actions,
            t,
            path,
            values,
            sections
        });
    };

    return (
        <ContentEditorContext.Provider value={editorContext}>
            <Formik
                initialValues={initialValues}
                render={props => <EditPanel {...props} title={title}/>}
                onSubmit={handleSubmit}
            />
        </ContentEditorContext.Provider>
    );
};

EditPanelContainer.propTypes = {
    client: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
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
