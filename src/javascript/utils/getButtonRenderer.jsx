import {useTranslation} from 'react-i18next';
import {Button} from '@jahia/moonstone';
import PropTypes from 'prop-types';
import React from 'react';
import {Error} from '@material-ui/icons';
import styles from './getButtonRenderer.scss';

export const getButtonRenderer = ({labelStyle, defaultButtonProps, noIcon} = {}) => {
    const ButtonRenderer = props => {
        const {addWarningBadge, buttonLabelNamespace, buttonLabelShort, buttonLabel, isVisible, buttonLabelParams, buttonIcon, actionKey, enabled, disabled, onClick, buttonProps} = props;
        const {t} = useTranslation(buttonLabelNamespace);

        let label = buttonLabel;
        if (labelStyle === 'none') {
            label = null;
        } else if (labelStyle === 'short' && buttonLabelShort) {
            label = buttonLabelShort;
        }

        let icon;
        if (!noIcon) {
            icon = buttonIcon;
        }

        if (isVisible === false) {
            return false;
        }

        let button = (
            <Button data-sel-role={actionKey}
                    label={t(label, buttonLabelParams)}
                    icon={icon}
                    isDisabled={enabled === false || disabled}
                    onClick={e => {
                        e.stopPropagation();
                        onClick(props, e);
                    }}
                    {...defaultButtonProps}
                    {...buttonProps}
            />
        );

        return !addWarningBadge ? button : (
            <div className={styles.pastilleWrapper}>
                {button}
                <Error data-sel-role={`${actionKey}_pastille`}
                       className={styles.warningBadge}/>
            </div>
        );
    };

    ButtonRenderer.propTypes = {
        buttonLabelNamespace: PropTypes.string,
        buttonLabelShort: PropTypes.string,
        buttonLabel: PropTypes.string,
        isVisible: PropTypes.bool,
        buttonLabelParams: PropTypes.object,
        buttonIcon: PropTypes.node,
        actionKey: PropTypes.string,
        enabled: PropTypes.bool,
        disabled: PropTypes.bool,
        onClick: PropTypes.func,
        buttonProps: PropTypes.object,
        addWarningBadge: PropTypes.bool
    };

    return ButtonRenderer;
};

export const ButtonRenderer = getButtonRenderer();
export const ButtonRendererNoLabel = getButtonRenderer({labelStyle: 'none'});
export const ButtonRendererShortLabel = getButtonRenderer({labelStyle: 'short'});
