import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useContentEditorContext} from '~/contexts/ContentEditor';
import styles from './EditPanel.scss';
import clsx from 'clsx';
import {registry} from '@jahia/ui-extender';
import {LayoutContent} from '@jahia/moonstone';
import {Constants} from '~/ContentEditor.constants';
import {EditPanelHeader} from './EditPanelHeader';

export const EditPanelFullscreen = ({title}) => {
    const [activeTab, setActiveTab] = useState(Constants.editPanel.editTab);
    const {mode} = useContentEditorContext();

    // Without edit tab, no content editor
    const tabs = registry.find({target: 'editHeaderTabsActions'});
    const EditPanelContent = tabs.find(tab => tab.value === Constants.editPanel.editTab).displayableComponent;
    const OtherTabComponent = tabs.find(tab => tab.value === activeTab && tab.value !== Constants.editPanel.editTab)?.displayableComponent;

    return (
        <LayoutContent
            className={styles.main}
            hasPadding={false}
            header={(
                <EditPanelHeader title={title}
                                 isShowPublish={mode === Constants.routes.baseEditRoute}
                                 activeTab={activeTab}
                                 setActiveTab={setActiveTab}
                />
            )}
            content={(
                <>
                    <div className={clsx(
                        activeTab === Constants.editPanel.editTab ? 'flexFluid' : styles.hideTab,
                        'flexCol'
                    )}
                    >
                        <EditPanelContent/>
                    </div>
                    {OtherTabComponent && (
                        <div className={clsx(
                            Constants.editPanel.editTab === activeTab ? styles.hideTab : 'flexFluid',
                            'flexCol'
                        )}
                        >
                            <OtherTabComponent/>
                        </div>
                    )}
                </>
            )}
        />
    );
};

EditPanelFullscreen.propTypes = {
    title: PropTypes.string.isRequired
};

