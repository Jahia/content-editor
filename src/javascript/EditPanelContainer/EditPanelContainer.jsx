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
import {publishNode} from '~/Edit/publish/publish.redux-actions';
import {saveNode} from '~/Edit/save/save.redux-actions';
import {unpublishNode} from '~/Edit/unpublish/unpublish.redux-actions';
import {createNode} from '~/Create/create.redux-actions';

import {ContentEditorContext} from '../ContentEditor.context';

const submitActionMapper = {
    [Constants.editPanel.submitOperation.SAVE]: saveNode,
    [Constants.editPanel.submitOperation.SAVE_PUBLISH]: publishNode,
    [Constants.editPanel.submitOperation.UNPUBLISH]: unpublishNode,
    [Constants.editPanel.submitOperation.CREATE]: createNode
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
