import React, {useContext, useEffect, useState} from 'react';
import {withNotifications} from '@jahia/react-material';
import PropTypes from 'prop-types';
import {withApollo} from 'react-apollo';
import {compose} from '~/utils';
import {useTranslation} from 'react-i18next';
import EditPanelContent from './EditPanelContent/EditPanelContent';
import AdvancedOptions from './AdvancedOptions/AdvancedOptions';
import {connect} from 'formik';
import {HeaderLowerSection, HeaderUpperSection} from './header';
import {useContentEditorContext, useContentEditorConfigContext} from '~/ContentEditor.context';
import {PublicationInfoContext} from '~/PublicationInfo/PublicationInfo.context';

import MainLayout from '~/DesignSystem/ContentLayout/MainLayout';
import ContentHeader from '~/DesignSystem/ContentLayout/ContentHeader';
import {Separator} from '@jahia/moonstone';

const EditPanelCmp = ({formik, title, notificationContext, client}) => {
    const {t} = useTranslation();
    const {nodeData, siteInfo, lang, uilang, mode} = useContentEditorContext();
    const {envProps} = useContentEditorConfigContext();

    useEffect(() => {
        if (envProps.initCallback) {
            envProps.initCallback(formik);
        }

        const handleBeforeUnloadEvent = ev => {
            if (formik.dirty) {
                ev.preventDefault();
                ev.returnValue = '';
            }
        };

        // Prevent close browser's tab when there is unsaved content
        window.addEventListener('beforeunload', handleBeforeUnloadEvent);
        return () => {
            window.removeEventListener(
                'beforeunload',
                handleBeforeUnloadEvent
            );
        };
    }, [formik.dirty]);

    const publicationInfoContext = useContext(PublicationInfoContext);

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
        siteInfo
    };

    const [activeTab, setActiveTab] = useState('edit');
    const SelectedTabComponents = {
        edit: EditPanelContent,
        advanced: AdvancedOptions
    };
    const SelectedTabComponent = SelectedTabComponents[activeTab];
    return (
        <MainLayout
            header={
                <ContentHeader>
                    <HeaderUpperSection actionContext={actionContext} title={title}/>
                    <Separator/>
                    <HeaderLowerSection activeTab={activeTab} setActiveTab={setActiveTab} actionContext={actionContext}/>
                </ContentHeader>
            }
        >
            <SelectedTabComponent isDirty={formik.dirty} formik={formik}/>
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
