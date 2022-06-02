import React from 'react';
import PropTypes from 'prop-types';
import {ButtonGroup, Chip, Typography} from '@jahia/moonstone';
import {DisplayAction, DisplayActions} from '@jahia/ui-extender';
import {truncate} from '~/utils/helper';
import styles from './HeaderUpperSection.scss';
import ContentBreadcrumb from '~/EditPanel/header/ContentBreadcrumb';
import {useContentEditorContext} from '~/ContentEditor.context';
import {PublishMenu} from '~/EditPanel/header/PublishMenu';
import {ButtonRendererNoLabel, ButtonRendererShortLabel, getButtonRenderer} from '~/utils/getButtonRenderer';
import HeaderBadges from '~/EditPanel/header/HeaderBadges/HeaderBadges';

const ButtonRenderer = getButtonRenderer({
    defaultButtonProps: {
        size: 'big',
        color: 'accent',
        className: styles.mainActions
    }
});

export const HeaderUpperSection = ({title, isShowPublish}) => {
    const {nodeData, nodeTypeDisplayName, mode} = useContentEditorContext();

    return (
        <>
            <div className={styles.padder}/>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <DisplayAction
                        actionKey="backButton"
                        render={ButtonRendererNoLabel}
                    />

                    <Typography isNowrap className={styles.headerTypography} variant="title" data-sel-role="title">
                        {truncate(title, 60)}
                    </Typography>
                </div>

                <div className={styles.headerRight}>
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
                                buttonProps={{className: styles.mainActions, size: 'big', color: 'accent'}}
                                render={ButtonRendererShortLabel}
                            />

                            <PublishMenu/>
                        </ButtonGroup>
                    )}
                </div>
            </div>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    {nodeData?.path?.startsWith('/sites') ?
                        <ContentBreadcrumb path={nodeData.path}/> :
                        <Chip label={nodeTypeDisplayName} color="accent"/>}
                </div>
                <HeaderBadges className={styles.headerChips} mode={mode}/>
            </div>
        </>
    );
};

HeaderUpperSection.propTypes = {
    title: PropTypes.string.isRequired,
    isShowPublish: PropTypes.bool
};
