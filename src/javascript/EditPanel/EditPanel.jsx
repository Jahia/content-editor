import React, {useState} from 'react';
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
import {WindowListeners} from './WindowListeners';

const EditPanel = React.memo(({title}) => {
    const [activeTab, setActiveTab] = useState(Constants.editPanel.editTab);
    const {nodeData, lang, mode} = useContentEditorContext();
    const {envProps} = useContentEditorConfigContext();

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
            <WindowListeners/>
            <div className={classnames(activeTab === Constants.editPanel.editTab ? classes.tab : classes.hideTab, 'flexCol')}>
                <EditTabComponent nodePath={nodeData.path} lang={lang}/>
            </div>
            {OtherTabComponent && (
                <div className={classnames(Constants.editPanel.editTab === activeTab ? classes.hideTab : classes.tab, 'flexCol')}>
                    <OtherTabComponent nodePath={nodeData.path} lang={lang}/>
                </div>
            )}
        </MainLayout>
    );
});

EditPanel.propTypes = {
    title: PropTypes.string.isRequired
};

EditPanel.displayName = 'EditPanel';
export default EditPanel;
