import React from 'react';

import styles from './HeaderLowerSection.scss';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {DisplayAction, DisplayActions} from '@jahia/ui-extender';
import {EditPanelLanguageSwitcher} from '../EditPanelLanguageSwitcher';
import {Separator, Tab, TabItem} from '@jahia/moonstone';
import {useContentEditorContext} from '~/ContentEditor.context';
import {getButtonRenderer} from '~/utils/getButtonRenderer';

const DotsButtonRenderer = getButtonRenderer({
    labelStyle: 'none',
    defaultButtonProps: {
        variant: 'ghost'
    }
});

const TabItemRenderer = renderProps => {
    const {t} = useTranslation('content-editor');
    return (
        <TabItem
            data-sel-role={renderProps.dataSelRole}
            icon={renderProps.buttonIcon}
            label={t(renderProps.buttonLabel)}
            isSelected={renderProps.value === renderProps.activeTab}
            onClick={e => {
                e.stopPropagation();
                renderProps.onClick(renderProps, e);
            }}
        />
    );
};

export const HeaderLowerSection = ({setActiveTab, activeTab}) => {
    const {siteInfo, lang, nodeData} = useContentEditorContext();

    return (
        <div className={styles.headerToolBar}>
            <EditPanelLanguageSwitcher lang={lang} siteInfo={siteInfo}/>

            <Separator variant="vertical" size="medium"/>

            <Tab>
                <DisplayActions
                    setActiveTab={setActiveTab}
                    activeTab={activeTab}
                    target="editHeaderTabsActions"
                    nodeData={nodeData}
                    render={TabItemRenderer}
                />
            </Tab>

            <Separator variant="vertical" size="medium"/>

            <DisplayAction
                actionKey="content-editor/header/3dots"
                render={DotsButtonRenderer}/>
        </div>
    );
};

HeaderLowerSection.propTypes = {
    setActiveTab: PropTypes.func.isRequired,
    activeTab: PropTypes.string.isRequired
};
