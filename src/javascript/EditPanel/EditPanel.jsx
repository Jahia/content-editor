import React, {useContext, useEffect, useState} from 'react';
import {withNotifications} from '@jahia/react-material';
import PropTypes from 'prop-types';
import {withApollo} from 'react-apollo';
import {compose} from '~/utils';
import {useTranslation} from 'react-i18next';
import {connect} from 'formik';
import {HeaderLowerSection, HeaderUpperSection} from './header';
import {useContentEditorContext, useContentEditorConfigContext} from '~/ContentEditor.context';
import {PublicationInfoContext} from '~/PublicationInfo/PublicationInfo.context';
import classes from './EditPanel.scss';
import {registry} from '@jahia/ui-extender';

import MainLayout from '~/DesignSystem/ContentLayout/MainLayout';
import ContentHeader from '~/DesignSystem/ContentLayout/ContentHeader';
import {Separator} from '@jahia/moonstone';
import {Constants} from '~/ContentEditor.constants';

const EditPanelCmp = ({formik, title, notificationContext, client}) => {
    const [activeTab, setActiveTab] = useState(Constants.editPanel.editTab);
    const {t} = useTranslation();
    const {nodeData, siteInfo, lang, uilang, mode, nodeTypeName} = useContentEditorContext();
    const {envProps} = useContentEditorConfigContext();
    const publicationInfoContext = useContext(PublicationInfoContext);

    useEffect(() => {
        if (envProps.initCallback) {
            envProps.initCallback(formik);
        }

        const handleBeforeUnloadEvent = ev => {
            ev.preventDefault();
            ev.returnValue = '';
        };

        const registerListeners = () => {
            // Prevent close browser's tab when there is unsaved content
            window.addEventListener('beforeunload', handleBeforeUnloadEvent);
            if (envProps.registerListeners) {
                envProps.registerListeners();
            }
        };

        const unregisterListeners = () => {
            window.removeEventListener('beforeunload', handleBeforeUnloadEvent);
            if (envProps.unregisterListeners) {
                envProps.unregisterListeners();
            }
        };

        if (formik.dirty) {
            registerListeners();
        } else {
            unregisterListeners();
        }

        return unregisterListeners;
    }, [formik.dirty]);

    useEffect(() => {
        return () => {
            if (envProps.unregisterListeners) {
                envProps.unregisterListeners();
            }
        };
    }, []);

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
                    <Separator/>
                    <HeaderLowerSection activeTab={activeTab}
                                        setActiveTab={setActiveTab}
                                        actionContext={actionContext}/>
                </ContentHeader>
            }
        >
            <div className={activeTab === Constants.editPanel.editTab ? classes.tab : classes.hideTab}>
                <EditTabComponent isDirty={formik.dirty} formik={formik} nodePath={nodeData.path} lang={lang}/>
            </div>
            {OtherTabComponent && (
                <div className={Constants.editPanel.editTab === activeTab ? classes.hideTab : classes.tab}>
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
