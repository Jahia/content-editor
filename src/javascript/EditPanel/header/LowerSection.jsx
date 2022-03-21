import React from 'react';

import styles from './LowerSection.scss';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {DisplayAction, DisplayActions} from '@jahia/ui-extender';
import {EditPanelLanguageSwitcher} from '../EditPanelLanguageSwitcher';
import {Button, Separator, Tab, TabItem} from '@jahia/moonstone';
import {useContentEditorContext} from '~/ContentEditor.context';

export const HeaderLowerSection = ({setActiveTab, activeTab}) => {
    const {t} = useTranslation('content-editor');
    const {siteInfo, lang} = useContentEditorContext();
    return (
        <div className={styles.headerToolBar}>
            <EditPanelLanguageSwitcher lang={lang} siteInfo={siteInfo}/>

            <Separator variant="vertical" size="medium"/>

            <Tab>
                <DisplayActions
                    setActiveTab={setActiveTab}
                    activeTab={activeTab}
                    target="editHeaderTabsActions"
                    render={renderProps => {
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
                    }}
                />
            </Tab>

            <Separator variant="vertical" size="medium"/>

            <DisplayAction
                actionKey="content-editor/header/3dots"
                render={({dataSelRole, buttonIcon, onClick, ...props}) => (
                    <Button
                        data-sel-role={dataSelRole}
                        icon={buttonIcon}
                        variant="ghost"
                        onClick={e => {
                            e.stopPropagation();
                            onClick(props, e);
                        }}
                    />
                )}/>
        </div>
    );
};

HeaderLowerSection.propTypes = {
    setActiveTab: PropTypes.func.isRequired,
    activeTab: PropTypes.string.isRequired
};
