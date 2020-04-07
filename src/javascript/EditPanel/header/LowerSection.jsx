import React from 'react';

import styles from './LowerSection.scss';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {DisplayActions, DisplayAction} from '@jahia/ui-extender';
import {EditPanelLanguageSwitcher} from '../EditPanelLanguageSwitcher';
import {
    Button,
    Separator,
    Tab,
    TabItem
} from '@jahia/moonstone';

export const HeaderLowerSection = ({actionContext, setActiveTab, activeTab}) => {
    const {t} = useTranslation();
    return (
        <div className={styles.headerToolBar}>
            <EditPanelLanguageSwitcher lang={actionContext.language} siteInfo={actionContext.siteInfo}/>

            <Separator variant="vertical"/>

            <Tab>
                <DisplayActions
                    context={{
                        ...actionContext,
                        setActiveTab: setActiveTab,
                        activeTab: activeTab
                    }}
                    target="editHeaderTabsActions"
                    render={({context}) => {
                        return (
                            <TabItem
                            data-sel-role={context.dataSelRole}
                            icon={context.buttonIcon}
                            label={t(context.buttonLabel)}
                            isSelected={context.value === context.activeTab}
                            onClick={e => {
                                e.stopPropagation();
                                context.onClick(context, e);
                            }}
                        />
                    );
                }}
                />
            </Tab>

            <Separator variant="vertical"/>

            <DisplayAction
                actionKey="content-editor/header/3dots"
                context={actionContext}
                render={({context, ...props}) => (
                    <Button
                        data-sel-role={context.dataSelRole}
                        icon={context.buttonIcon}
                        variant="ghost"
                        {...props}
                        onClick={e => {
                            e.stopPropagation();
                            context.onClick(context, e);
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
