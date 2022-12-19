import React from 'react';
import {DisplayAction, DisplayActions} from '@jahia/ui-extender';
import {ButtonRendererNoLabel, ButtonRendererShortLabel, getButtonRenderer, getNodeTypeIcon, truncate} from '~/utils';
import {ArrowLeft, ButtonGroup, Chip, Header, Separator, Tab, TabItem} from '@jahia/moonstone';
import styles from './EditPanelHeader.scss';
import {PublishMenu} from './PublishMenu';
import {useTranslation} from 'react-i18next';
import {useContentEditorContext} from '~/contexts/ContentEditor';
import {EditPanelLanguageSwitcher} from '../EditPanelLanguageSwitcher';
import {HeaderBadges} from '../HeaderBadges';
import PropTypes from 'prop-types';
import {ContentPath} from './ContentPath';

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
        color: 'accent'
    }
});

const DotsButtonRenderer = getButtonRenderer({
    labelStyle: 'none',
    defaultButtonProps: {
        variant: 'ghost'
    }
});

export const EditPanelHeader = ({title, isShowPublish, activeTab, setActiveTab}) => {
    const {nodeData, nodeTypeName, nodeTypeDisplayName, mode} = useContentEditorContext();

    const backButton = (
        <DisplayAction actionKey="backButton" render={ButtonRendererNoLabel} buttonProps={{variant: 'outlined', icon: <ArrowLeft/>}}/>
    );

    return (
        <Header backButton={backButton}
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
                        <EditPanelLanguageSwitcher/>

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
