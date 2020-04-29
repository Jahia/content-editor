import React from 'react';
import PropTypes from 'prop-types';
import {Button} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
import {Error} from '@material-ui/icons';
import styles from './ActionsButtons.scss';

export const ButtonWithPastilleRenderer = ({context}) => {
    const {t} = useTranslation();

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
};

ButtonWithPastilleRenderer.propTypes = {
    context: PropTypes.object.isRequired
};

export const ButtonRenderer = ({context, ...props}) => {
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
