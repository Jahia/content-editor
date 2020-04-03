import React from 'react';
import PropTypes from 'prop-types';

import {Button, Typography, ButtonGroup, Chip} from '@jahia/moonstone';
import {DisplayActions, DisplayAction} from '@jahia/ui-extender';
import {Error} from '@material-ui/icons';
import {useTranslation} from 'react-i18next';

import PublicationInfoBadge from '~/PublicationInfo/PublicationInfo.badge';
import LockInfoBadge from '~/Lock/LockInfo.badge';
import WipInfoChip from '~/EditPanel/WorkInProgress/Chip/WipInfo.Chip';
import {Constants} from '~/ContentEditor.constants';
import {Edit} from '@jahia/moonstone/dist/icons';
import {truncate} from '~/utils/helper';
import styles from './UpperSection.scss';

const ButtonRenderer = ({context, ...props}) => {
    return (
        <Button
            {...context.componentProps}
            {...props}
            icon={context.buttonIcon}
            onClick={e => {
                e.stopPropagation();
                context.onClick(context, e);
            }}
    />
    );
};

ButtonRenderer.propTypes = {
    context: PropTypes.object.isRequired
};

export const HeaderUpperSection = ({title, actionContext}) => {
    const {t} = useTranslation();
    const {mode, nodeData, formik} = actionContext;

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

    return (
        <>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <DisplayActions
                                context={{
                                    ...actionContext,
                                    componentProps: {
                                        'data-sel-role': 'backButton'
                                    }
                                }}
                                target="editHeaderPathActions"
                                render={ButtonRenderer}
                            />

                    <Typography isNowrap className={styles.headerTypography} variant="title">
                        {truncate(title, 60)}
                    </Typography>
                </div>

                <div className={styles.headerRight}>
                    <ButtonGroup
                            color="accent"
                            size="big"
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
                                target="content-editor/header/main-actions"
                                render={({context}) => {
                                    if (!context.enabled) {
                                        return '';
                                    }

                                    return (
                                        <>
                                            <Button
                                                {...context.componentProps}
                                                icon={context.buttonIcon}
                                                label={t(context.buttonLabel).toUpperCase()}
                                                disabled={context.disabled}
                                                data-sel-role={context.dataSelRole}
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    context.onClick(context, e);
                                                }}
                                            />

                                            {context.addWarningBadge && (
                                                <Error data-sel-role={`${context.actionKey}_pastille`}
                                                       className={styles.warningBadge}/>
                                            )}
                                        </>
                                    );
                                }}
                            />
                        {EditActions}
                    </ButtonGroup>
                </div>
            </div>

            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Chip label={nodeData.primaryNodeType.displayName} color="accent"/>
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
        formik: PropTypes.object.isRequired
    }).isRequired
};
