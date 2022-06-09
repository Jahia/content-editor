import React from 'react';
import {DisplayAction, DisplayActions} from '@jahia/ui-extender';
import {ButtonRendererNoLabel, ButtonRendererShortLabel, getButtonRenderer} from '~/utils/getButtonRenderer';
import {truncate} from '~/utils';
import {ButtonGroup, Chip, Header, Separator, Tab, TabItem} from '@jahia/moonstone';
import styles from '~/EditPanel/EditPanelHeader/EditPanelHeader.scss';
import {PublishMenu} from './PublishMenu';
import {useTranslation} from 'react-i18next';
import {useContentEditorContext} from '~/ContentEditor.context';
import {EditPanelLanguageSwitcher} from '~/EditPanel/EditPanelLanguageSwitcher';
import HeaderBadges from './HeaderBadges';
import PropTypes from 'prop-types';
import {getNodeTypeIcon} from '~/EditPanel/EditPanel.utils';
import ContentPath from '~/EditPanel/EditPanelHeader/ContentPath';

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

const ButtonRenderer = getButtonRenderer({
    defaultButtonProps: {
        size: 'big',
        color: 'accent',
    }
});

const DotsButtonRenderer = getButtonRenderer({
    labelStyle: 'none',
    defaultButtonProps: {
        variant: 'ghost'
    }
});

export const EditPanelHeader = ({title, isShowPublish, activeTab, setActiveTab}) => {
    const {nodeData, nodeTypeName, nodeTypeDisplayName, mode, siteInfo, lang} = useContentEditorContext();

    return (
        <Header backButton={<DisplayAction actionKey="backButton" render={ButtonRendererNoLabel}/>}
                title={truncate(title, 60)}
                breadcrumb={(
                    nodeData?.path?.startsWith('/sites') && <ContentPath path={nodeData.path}/>
                )}
                contentType={(
                    <Chip color="accent" label={nodeTypeDisplayName || nodeTypeName} icon={getNodeTypeIcon(nodeTypeName)}/>
                )}
                mainActions={(
                    <div className="flexRow_center alignCenter">
                        <div className={styles.saveActions}>
                            <DisplayActions
                                target="content-editor/header/main-save-actions"
                                render={ButtonRenderer}
                            />
                        </div>

                        {isShowPublish && (
                            <ButtonGroup
                                color="accent"
                                size="big"
                                className={styles.publishActions}
                            >
                                <DisplayActions
                                    isMainButton
                                    target="content-editor/header/main-publish-actions"
                                    buttonProps={{size: 'big', color: 'accent'}}
                                    render={ButtonRendererShortLabel}
                                />

                                <PublishMenu/>
                            </ButtonGroup>
                        )}
                    </div>
                )}
                toolbarLeft={(
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
                )}
                status={<HeaderBadges mode={mode}/>}
        />
    );
};

EditPanelHeader.propTypes = {
    title: PropTypes.string.isRequired,
    isShowPublish: PropTypes.bool,
    setActiveTab: PropTypes.func.isRequired,
    activeTab: PropTypes.string.isRequired
};
