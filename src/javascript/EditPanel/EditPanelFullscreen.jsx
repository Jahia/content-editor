import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {HeaderLowerSection, HeaderUpperSection} from './header';
import {useContentEditorContext} from '~/ContentEditor.context';
import classes from './EditPanel.scss';
import clsx from 'clsx';
import {registry} from '@jahia/ui-extender';

import MainLayout from '~/DesignSystem/ContentLayout/MainLayout';
import ContentHeader from '~/DesignSystem/ContentLayout/ContentHeader';
import {Constants} from '~/ContentEditor.constants';
import {Separator} from '@jahia/moonstone';
import {WindowListeners} from './WindowListeners';

const EditPanelFullscreen = ({title}) => {
    const [activeTab, setActiveTab] = useState(Constants.editPanel.editTab);
    const {nodeData, lang, mode} = useContentEditorContext();

    // Without edit tab, no content editor
    const tabs = registry.find({target: 'editHeaderTabsActions'});
    const EditTabComponent = tabs.find(tab => tab.value === Constants.editPanel.editTab).displayableComponent;
    const OtherTabComponent = tabs.find(tab => tab.value === activeTab && tab.value !== Constants.editPanel.editTab)?.displayableComponent;

    return (
        <MainLayout
            header={(
                <ContentHeader>
                    <HeaderUpperSection title={title}
                                        isShowPublish={mode === Constants.routes.baseEditRoute}/>
                    <Separator spacing="none"/>
                    <HeaderLowerSection activeTab={activeTab} setActiveTab={setActiveTab}/>
                </ContentHeader>
            )}
        >
            <WindowListeners/>
            <div className={clsx(
                activeTab === Constants.editPanel.editTab ? classes.tab : classes.hideTab,
                'flexCol'
            )}
            >
                <EditTabComponent nodePath={nodeData.path} lang={lang}/>
            </div>
            {OtherTabComponent && (
                <div className={clsx(
                    Constants.editPanel.editTab === activeTab ? classes.hideTab : classes.tab,
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

EditPanelFullscreen.displayName = 'EditPanelFullscreen';
export default EditPanelFullscreen;
