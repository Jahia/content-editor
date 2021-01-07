import React from 'react';
import PropTypes from 'prop-types';
import {Button} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
import {Error} from '@material-ui/icons';
import styles from './ActionsButtons.scss';

export const ButtonWithPastilleRenderer = props => {
    const {enabled, componentProps, addWarningBadge, actionKey, buttonIcon, buttonLabel, disabled, dataSelRole, onClick} = props;
    const {t} = useTranslation('content-editor');

    if (!enabled) {
        return '';
    }

    return (
        <>
            <Button
                {...componentProps}
                icon={buttonIcon}
                label={t(buttonLabel).toUpperCase()}
                disabled={disabled}
                data-sel-role={dataSelRole}
                onClick={e => {
                    e.stopPropagation();
                    onClick(props, e);
                }}
            />

            {addWarningBadge && (
                <Error data-sel-role={`${actionKey}_pastille`}
                       className={styles.warningBadge}/>
            )}
        </>
    );
};

ButtonWithPastilleRenderer.propTypes = {
    enabled: PropTypes.bool.isRequired,
    disabled: PropTypes.bool.isRequired,
    addWarningBadge: PropTypes.bool.isRequired,
    buttonLabel: PropTypes.string.isRequired,
    dataSelRole: PropTypes.string.isRequired,
    actionKey: PropTypes.string.isRequired,
    componentProps: PropTypes.object.isRequired,
    buttonIcon: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired
};

export const ButtonRenderer = props => {
    const {componentProps, buttonIcon, onClick} = props;
    return (
        <Button
            {...componentProps}
            icon={buttonIcon}
            onClick={e => {
                e.stopPropagation();
                onClick(props, e);
            }}
    />
    );
};

ButtonRenderer.propTypes = {
    componentProps: PropTypes.object.isRequired,
    buttonIcon: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired
};
