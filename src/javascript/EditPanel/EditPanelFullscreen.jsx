import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useContentEditorContext} from '~/contexts';
import styles from './EditPanel.scss';
import clsx from 'clsx';
import {registry} from '@jahia/ui-extender';

import MainLayout from '~/DesignSystem/ContentLayout/MainLayout';
import {Constants} from '~/ContentEditor.constants';
import {WindowListeners} from './WindowListeners';
import {EditPanelHeader} from './EditPanelHeader';

export const EditPanelFullscreen = ({title}) => {
    const [activeTab, setActiveTab] = useState(Constants.editPanel.editTab);
    const {nodeData, lang, mode} = useContentEditorContext();

    // Without edit tab, no content editor
    const tabs = registry.find({target: 'editHeaderTabsActions'});
    const EditTabComponent = tabs.find(tab => tab.value === Constants.editPanel.editTab).displayableComponent;
    const OtherTabComponent = tabs.find(tab => tab.value === activeTab && tab.value !== Constants.editPanel.editTab)?.displayableComponent;

    return (
        <MainLayout
            header={(
                <EditPanelHeader title={title}
                                 isShowPublish={mode === Constants.routes.baseEditRoute}
                                 activeTab={activeTab}
                                 setActiveTab={setActiveTab}
                />
            )}
        >
            <WindowListeners/>
            <div className={clsx(
                activeTab === Constants.editPanel.editTab ? styles.tab : styles.hideTab,
                'flexCol'
            )}
            >
                <EditTabComponent nodePath={nodeData.path} lang={lang}/>
            </div>
            {OtherTabComponent && (
                <div className={clsx(
                    Constants.editPanel.editTab === activeTab ? styles.hideTab : styles.tab,
                    'flexCol'
                )}
                >
                    <OtherTabComponent nodePath={nodeData.path} lang={lang}/>
                </div>
            )}
        </MainLayout>
    );
};

EditPanelFullscreen.propTypes = {
    title: PropTypes.string.isRequired
};

