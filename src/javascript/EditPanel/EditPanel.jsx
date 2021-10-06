import React, {useContext, useEffect, useState} from 'react';
import {withNotifications} from '@jahia/react-material';
import PropTypes from 'prop-types';
import {withApollo} from 'react-apollo';
import {compose} from '~/utils';
import {useTranslation} from 'react-i18next';
import {connect} from 'formik';
import {HeaderLowerSection, HeaderUpperSection} from './header';
import {useContentEditorConfigContext, useContentEditorContext} from '~/ContentEditor.context';
import {PublicationInfoContext} from '~/PublicationInfo/PublicationInfo.context';
import classes from './EditPanel.scss';
import classnames from 'clsx';
import {registry} from '@jahia/ui-extender';

import MainLayout from '~/DesignSystem/ContentLayout/MainLayout';
import ContentHeader from '~/DesignSystem/ContentLayout/ContentHeader';
import {Separator} from '@jahia/moonstone';
import {Constants} from '~/ContentEditor.constants';

const handleBeforeUnloadEvent = ev => {
    ev.preventDefault();
    ev.returnValue = '';
};

const registerListeners = envProps => {
    // Prevent close browser's tab when there is unsaved content
    window.addEventListener('beforeunload', handleBeforeUnloadEvent);
    if (envProps.registerListeners) {
        envProps.registerListeners();
    }
};

const unregisterListeners = envProps => {
    window.removeEventListener('beforeunload', handleBeforeUnloadEvent);
    if (envProps.unregisterListeners) {
        envProps.unregisterListeners();
    }
};

const EditPanelCmp = ({formik, title, notificationContext, client}) => {
    const [activeTab, setActiveTab] = useState(Constants.editPanel.editTab);
    const {t} = useTranslation('content-editor');
    const {nodeData, siteInfo, lang, uilang, mode, nodeTypeDisplayName, nodeTypeName} = useContentEditorContext();
    const {envProps} = useContentEditorConfigContext();
    const publicationInfoContext = useContext(PublicationInfoContext);

    useEffect(() => {
        if (envProps.setFormikRef) {
            envProps.setFormikRef(formik);
        }
    }, [envProps, formik]);

    useEffect(() => {
        if (formik.dirty) {
            registerListeners(envProps);
        }

        return () => unregisterListeners(envProps);
    }, [envProps, formik.dirty]);

    const actionContext = {
        nodeData,
        language: lang,
        uilang,
        mode,
        t,
        client, // TODO BACKLOG-11290 find another way to inject apollo-client, i18n, ...}
        notificationContext,
        publicationInfoContext,
        formik,
        siteInfo,
        nodeTypeDisplayName,
        nodeTypeName
    };

    // Without edit tab, no content editor
    const tabs = registry.find({target: 'editHeaderTabsActions'});
    const EditTabComponent = tabs.find(tab => tab.value === Constants.editPanel.editTab).displayableComponent;
    const OtherTabComponent = tabs.find(tab => tab.value === activeTab && tab.value !== Constants.editPanel.editTab)?.displayableComponent;

    return (
        <MainLayout
            header={
                <ContentHeader>
                    <HeaderUpperSection actionContext={actionContext} title={title}/>
                    <Separator spacing="none"/>
                    <HeaderLowerSection activeTab={activeTab}
                                        setActiveTab={setActiveTab}
                                        actionContext={actionContext}/>
                </ContentHeader>
            }
        >
            <div className={classnames(activeTab === Constants.editPanel.editTab ? classes.tab : classes.hideTab, 'flexCol')}>
                <EditTabComponent isDirty={formik.dirty} formik={formik} nodePath={nodeData.path} lang={lang}/>
            </div>
            {OtherTabComponent && (
                <div className={classnames(Constants.editPanel.editTab === activeTab ? classes.hideTab : classes.tab, 'flexCol')}>
                    <OtherTabComponent isDirty={formik.dirty} formik={formik} nodePath={nodeData.path} lang={lang}/>
                </div>
            )}
        </MainLayout>
    );
};

EditPanelCmp.propTypes = {
    formik: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    client: PropTypes.object.isRequired,
    notificationContext: PropTypes.object.isRequired
};

const EditPanel = compose(
    connect,
    withNotifications(),
    withApollo
)(EditPanelCmp);
EditPanel.displayName = 'EditPanel';
export default EditPanel;
