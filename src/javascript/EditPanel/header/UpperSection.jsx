import React from 'react';
import PropTypes from 'prop-types';

import {Typography, ButtonGroup, Chip} from '@jahia/moonstone';
import {DisplayActions, DisplayAction, registry} from '@jahia/ui-extender';

import {useTranslation} from 'react-i18next';

import PublicationInfoBadge from '~/PublicationInfo/PublicationInfo.badge';
import LockInfoBadge from '~/Lock/LockInfo.badge';
import WipInfoChip from '~/EditPanel/WorkInProgress/Chip/WipInfo.Chip';
import {Constants} from '~/ContentEditor.constants';
import {Edit} from '@jahia/moonstone/dist/icons';
import {truncate} from '~/utils/helper';
import styles from './UpperSection.scss';
import {ButtonWithPastilleRenderer, ButtonRenderer} from './ActionsButtons';

export const HeaderUpperSection = ({title, actionContext}) => {
    const {t} = useTranslation();
    const {mode, nodeData, formik, nodeTypeName} = actionContext;

    const wipInfo = formik.values[Constants.wip.fieldName];

    const EditActions = mode === Constants.routes.baseEditRoute ? (
        <DisplayAction
            actionKey="publishMenu"
            context={{
                path: nodeData.path,
                menuUseElementAnchor: true,
                componentProps: {
                    'data-sel-role': 'ContentEditorHeaderMenu',
                    color: 'accent',
                    size: 'big',
                    className: styles.menu
                }
            }}
            render={ButtonRenderer}
            />
    ) : '';

    const breadCrumb = registry.find({type: 'app', target: 'jcontent-bread-crumb'});

    return (
        <>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <DisplayAction
                                context={{
                                    uuid: nodeData.uuid,
                                    operator: mode === Constants.routes.baseEditRoute ? Constants.operators.update : Constants.operators.create,
                                    ...actionContext,
                                    componentProps: {
                                        'data-sel-role': 'backButton'
                                    }
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
                        <DisplayActions context={{
                                        ...actionContext,
                                        componentProps: {
                                            color: 'accent',
                                            size: 'big',
                                            className: styles.mainActions
                                        }

                                    }}
                                        target="content-editor/header/main-save-actions"
                                        render={ButtonWithPastilleRenderer}
                        />
                    </div>

                    <ButtonGroup
                            color="accent"
                            size="big"
                            className={styles.publishActions}
                    >
                        <DisplayActions
                                context={{
                                    ...actionContext,
                                    isMainButton: true,
                                    componentProps: {
                                        color: 'accent',
                                        size: 'big',
                                        className: styles.mainActions
                                    }
                                }}
                                target="content-editor/header/main-publish-actions"
                                render={ButtonWithPastilleRenderer}
                            />
                        {EditActions}
                    </ButtonGroup>
                </div>
            </div>

            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    {breadCrumb.length > 0 && nodeData.path.startsWith('/sites') ?
                        breadCrumb[0].render(nodeData.path) :
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
        nodeData: PropTypes.object.isRequired,
        formik: PropTypes.object.isRequired,
        nodeTypeName: PropTypes.string.isRequired
    }).isRequired
};
