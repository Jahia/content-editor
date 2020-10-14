import React from 'react';

import styles from './LowerSection.scss';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {DisplayAction, DisplayActions} from '@jahia/ui-extender';
import {EditPanelLanguageSwitcher} from '../EditPanelLanguageSwitcher';
import {Button, Separator, Tab, TabItem} from '@jahia/moonstone';

export const HeaderLowerSection = ({actionContext, setActiveTab, activeTab}) => {
    const {t} = useTranslation();
    return (
        <div className={styles.headerToolBar}>
            <EditPanelLanguageSwitcher lang={actionContext.language} siteInfo={actionContext.siteInfo}/>

            <Separator variant="vertical" size="medium"/>

            <Tab>
                <DisplayActions
                    {...actionContext}
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
                {...actionContext}
                render={({dataSelRole, buttonIcon, onClick, ...props}) => (
                    <Button
                        data-sel-role={dataSelRole}
                        icon={buttonIcon}
                        variant="ghost"
                        {...props}
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
    actionContext: PropTypes.shape({
        language: PropTypes.string.isRequired,
        siteInfo: PropTypes.object.isRequired
    }).isRequired,
    setActiveTab: PropTypes.func.isRequired,
    activeTab: PropTypes.string.isRequired
};
