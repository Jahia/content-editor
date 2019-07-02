import React from 'react';
import {compose, withApollo} from 'react-apollo';
import {translate} from 'react-i18next';
import {ProgressOverlay, withNotifications} from '@jahia/react-material';
import EditPanelConstants from './EditPanel/EditPanelConstants';
import {Formik} from 'formik';
import {connect} from 'react-redux';
import EditPanel from './EditPanel';
import * as PropTypes from 'prop-types';
import {useFormDefinition} from './FormDefinitions';
import {withSiteInfo} from './SiteData';
import {publishNode, saveNode, unpublishNode} from './EditPanel.redux-actions';

import {ContentEditorContext} from './ContentEditor.context';

import '../date.config';

const submitActionMapper = {
    [EditPanelConstants.submitOperation.SAVE]: saveNode,
    [EditPanelConstants.submitOperation.SAVE_PUBLISH]: publishNode,
    [EditPanelConstants.submitOperation.UNPUBLISH]: unpublishNode
};

export const EditPanelContainer = ({client, notificationContext, t, path, lang, uiLang, site, siteDisplayableName, siteInfo}) => {
    const contentEditorUiLang = EditPanelConstants.supportedLocales.includes(uiLang) ?
        uiLang :
        EditPanelConstants.defaultLocale;

    const {
        loading,
        error,
        errorMessage,
        nodeData,
        fields,
        initialValues,
        details,
        technicalInfo
    } = useFormDefinition({path, language: lang, uiLang: contentEditorUiLang}, t);

    if (error) {
        console.error(error);
        return <>{errorMessage}</>;
    }

    if (loading) {
        return <ProgressOverlay/>;
    }

    const editorContext = {
        path: path,
        site: site,
        lang: lang,
        uiLang: contentEditorUiLang,
        siteDisplayableName: siteDisplayableName,
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
            notificationContext,
            actions,
            t,
            path,
            values,
            fields
        });
    };

    return (
        <ContentEditorContext.Provider value={editorContext}>
            <Formik
                initialValues={initialValues}
                render={() => {
                    return (
                        <EditPanel fields={fields}
                                   siteInfo={siteInfo}
                                   nodeData={nodeData}
                                   lang={lang}
                        />
                    );
                }}
                onSubmit={handleSubmit}
            />
        </ContentEditorContext.Provider>
    );
};

const mapStateToProps = state => ({
    path: state.path,
    lang: state.language,
    uiLang: state.uiLang,
    site: state.site,
    siteDisplayableName: state.siteDisplayableName
});

EditPanelContainer.propTypes = {
    client: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    path: PropTypes.string.isRequired,
    notificationContext: PropTypes.object.isRequired,
    lang: PropTypes.string.isRequired,
    uiLang: PropTypes.string.isRequired,
    site: PropTypes.string.isRequired,
    siteDisplayableName: PropTypes.string.isRequired,
    siteInfo: PropTypes.object.isRequired
};

const EditPanelContainerCmp = compose(
    translate(),
    withNotifications(),
    connect(mapStateToProps),
    withApollo,
    withSiteInfo
)(EditPanelContainer);

EditPanelContainerCmp.displayName = 'EditPanelContainer';

export default EditPanelContainerCmp;
