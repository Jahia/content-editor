import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {HeaderLowerSection, HeaderUpperSection} from './header';
import {useContentEditorConfigContext, useContentEditorContext} from '~/ContentEditor.context';
import classes from './EditPanel.scss';
import classnames from 'clsx';
import {registry} from '@jahia/ui-extender';

import MainLayout from '~/DesignSystem/ContentLayout/MainLayout';
import ContentHeader from '~/DesignSystem/ContentLayout/ContentHeader';
import {Constants} from '~/ContentEditor.constants';
import {Separator} from '@jahia/moonstone';
import {useFormikContext} from 'formik';

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

const EditPanel = ({title}) => {
    const formik = useFormikContext();
    const [activeTab, setActiveTab] = useState(Constants.editPanel.editTab);
    const {nodeData, lang, mode} = useContentEditorContext();
    const {envProps} = useContentEditorConfigContext();

    const previousDirty = useRef();

    useEffect(() => {
        if (envProps.setFormikRef) {
            envProps.setFormikRef(formik);
        }
    }, [envProps, formik]);

    useEffect(() => {
        if (!previousDirty.current && formik.dirty) {
            registerListeners(envProps);
        }

        previousDirty.current = formik.dirty;
        return () => unregisterListeners(envProps);
    }, [previousDirty, envProps, formik.dirty]);

    // Without edit tab, no content editor
    const tabs = registry.find({target: 'editHeaderTabsActions'});
    const EditTabComponent = tabs.find(tab => tab.value === Constants.editPanel.editTab).displayableComponent;
    const OtherTabComponent = tabs.find(tab => tab.value === activeTab && tab.value !== Constants.editPanel.editTab)?.displayableComponent;

    return (
        <MainLayout header={
            <ContentHeader>
                <HeaderUpperSection title={title}
                                    isCompact={envProps.isWindow}
                                    isShowPublish={!envProps.isWindow && mode === Constants.routes.baseEditRoute}/>
                {!envProps.isWindow && (
                    <>
                        <Separator spacing="none"/>
                        <HeaderLowerSection activeTab={activeTab}
                                            setActiveTab={setActiveTab}/>
                    </>
                )}
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

EditPanel.propTypes = {
    title: PropTypes.string.isRequired
};

EditPanel.displayName = 'EditPanel';
export default EditPanel;
