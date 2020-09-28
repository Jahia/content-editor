import React from 'react';
import PropTypes from 'prop-types';

import {Typography, ButtonGroup, Chip, Edit} from '@jahia/moonstone';
import {DisplayActions, DisplayAction} from '@jahia/ui-extender';

import {useTranslation} from 'react-i18next';

import PublicationInfoBadge from '~/PublicationInfo/PublicationInfo.badge';
import LockInfoBadge from '~/Lock/LockInfo.badge';
import WipInfoChip from '~/EditPanel/WorkInProgress/Chip/WipInfo.Chip';
import {Constants} from '~/ContentEditor.constants';
import {truncate} from '~/utils/helper';
import styles from './UpperSection.scss';
import {ButtonWithPastilleRenderer, ButtonRenderer} from './ActionsButtons';
import ContentBreadcrumb from '~/EditPanel/header/ContentBreadcrumb';

export const HeaderUpperSection = ({title, actionContext}) => {
    const {t} = useTranslation();
    const {mode, nodeData, formik, nodeTypeName, language} = actionContext;

    const wipInfo = formik.values[Constants.wip.fieldName];
    const isWip = wipInfo.status === Constants.wip.status.ALL_CONTENT ||
    (wipInfo.status === Constants.wip.status.LANGUAGES && wipInfo.languages.includes(language));

    const EditActions = mode === Constants.routes.baseEditRoute ? (
        <DisplayAction
            menuUseElementAnchor
            actionKey="publishMenu"
            language={language}
            path={nodeData.path}
            componentProps={{
                'data-sel-role': 'ContentEditorHeaderMenu',
                color: 'accent',
                size: 'big',
                className: styles.menu
            }}
            enabled={!formik.dirty && !nodeData.lockedAndCannotBeEdited && !isWip}
            render={ButtonRenderer}
        />
    ) : '';

    return (
        <>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <DisplayAction
                        uuid={nodeData.uuid}
                        operator={mode === Constants.routes.baseEditRoute ? Constants.operators.update : Constants.operators.create}
                        componentProps={{
                            'data-sel-role': 'backButton'
                        }}
                        formik={formik}
                        isDirty={formik.dirty}
                        actionKey="backButton"
                        render={ButtonRenderer}
                        {...actionContext}
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
                            errors={formik.errors}
                            values={formik.values}
                            dirty={formik.dirty}
                            mode={mode}
                            target="content-editor/header/main-save-actions"
                            render={ButtonWithPastilleRenderer}
                            {...actionContext}
                        />
                    </div>

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
                            values={formik.values}
                            dirty={formik.dirty}
                            hasPublishPermission={nodeData.hasPublishPermission}
                            hasStartPublicationWorkflowPermission={nodeData.hasStartPublicationWorkflowPermission}
                            lockedAndCannotBeEdited={nodeData.lockedAndCannotBeEdited}
                            target="content-editor/header/main-publish-actions"
                            render={ButtonWithPastilleRenderer}
                            {...actionContext}
                        />
                        {EditActions}
                    </ButtonGroup>
                </div>
            </div>

            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    {nodeData?.path?.startsWith('/sites') ?
                        <ContentBreadcrumb path={nodeData.path} {...actionContext}/> :
                        <Chip label={nodeTypeName} color="accent"/>}
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

        </>
    );
};

HeaderUpperSection.propTypes = {
    title: PropTypes.string.isRequired,
    actionContext: PropTypes.shape({
        mode: PropTypes.string.isRequired,
        language: PropTypes.string.isRequired,
        nodeData: PropTypes.object.isRequired,
        formik: PropTypes.object.isRequired,
        nodeTypeName: PropTypes.string.isRequired
    }).isRequired
};
