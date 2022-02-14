import React from 'react';
import PropTypes from 'prop-types';

import {ButtonGroup, Chip, Edit, Typography} from '@jahia/moonstone';
import {DisplayAction, DisplayActions} from '@jahia/ui-extender';

import {useTranslation} from 'react-i18next';

import PublicationInfoBadge from '~/PublicationInfo/PublicationInfo.badge';
import LockInfoBadge from '~/Lock/LockInfo.badge';
import WipInfoChip from '~/EditPanel/WorkInProgress/Chip/WipInfo.Chip';
import {Constants} from '~/ContentEditor.constants';
import {truncate} from '~/utils/helper';
import styles from './UpperSection.scss';
import {ButtonRenderer, ButtonWithPastilleRenderer} from '~/actions/ActionsButtons';
import ContentBreadcrumb from '~/EditPanel/header/ContentBreadcrumb';
import {useContentEditorContext} from '~/ContentEditor.context';
import {useFormikContext} from 'formik';

export const HeaderUpperSection = React.memo(({title, isCompact, isShowPublish}) => {
    const {t} = useTranslation('content-editor');
    const {nodeData, lang, mode, nodeTypeDisplayName} = useContentEditorContext();
    const formik = useFormikContext();

    const wipInfo = formik.values[Constants.wip.fieldName];
    const isWip = wipInfo.status === Constants.wip.status.ALL_CONTENT ||
    (wipInfo.status === Constants.wip.status.LANGUAGES && wipInfo.languages.includes(lang));

    return (
        <>
            {!isCompact && <div className={styles.padder}/>}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <DisplayAction
                        componentProps={{
                            'data-sel-role': 'backButton'
                        }}
                        actionKey="backButton"
                        render={ButtonRenderer}
                    />

                    <Typography isNowrap className={styles.headerTypography} variant="title" data-sel-role="title">
                        {truncate(title, 60)}
                    </Typography>
                </div>

                <div className={styles.headerRight}>
                    <div className={styles.saveActions}>
                        <DisplayActions
                            componentProps={{
                                color: 'accent',
                                size: 'big',
                                className: styles.mainActions
                            }}
                            target="content-editor/header/main-save-actions"
                            render={ButtonWithPastilleRenderer}
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
                                componentProps={{
                                    color: 'accent',
                                    size: 'big',
                                    className: styles.mainActions
                                }}
                                target="content-editor/header/main-publish-actions"
                                render={ButtonWithPastilleRenderer}
                            />
                            <DisplayAction
                                menuUseElementAnchor
                                actionKey="publishMenu"
                                componentProps={{
                                    'data-sel-role': 'ContentEditorHeaderMenu',
                                    color: 'accent',
                                    size: 'big',
                                    className: styles.menu
                                }}
                                enabled={!formik.dirty && !nodeData.lockedAndCannotBeEdited && !isWip}
                                render={ButtonRenderer}
                            />
                        </ButtonGroup>
                    )}
                </div>
            </div>
            {!isCompact && (
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        {nodeData?.path?.startsWith('/sites') ?
                            <ContentBreadcrumb path={nodeData.path}/> :
                            <Chip label={nodeTypeDisplayName} color="accent"/>}
                    </div>

                    <div className={styles.headerChips}>
                        <PublicationInfoBadge/>
                        <LockInfoBadge/>
                        <WipInfoChip wipInfo={wipInfo}/>
                        {(formik.dirty || mode === Constants.routes.baseCreateRoute) &&
                        <Chip
                            icon={<Edit/>}
                            data-sel-role="unsaved-info-chip"
                            label={t('content-editor:label.contentEditor.header.chips.unsavedLabel')}
                            color="warning"
                        />}
                    </div>
                </div>
            )}
        </>
    );
});

HeaderUpperSection.propTypes = {
    title: PropTypes.string.isRequired,
    isCompact: PropTypes.bool,
    isShowPublish: PropTypes.bool
};
