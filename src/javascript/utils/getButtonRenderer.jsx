import {useTranslation} from 'react-i18next';
import {Button} from '@jahia/moonstone';
import PropTypes from 'prop-types';
import React from 'react';

export const getButtonRenderer = ({labelStyle, defaultButtonProps} = {}) => {
    const ButtonRenderer = props => {
        const {buttonLabelNamespace, buttonLabelShort, buttonLabel, isVisible, buttonLabelParams, buttonIcon, actionKey, enabled, isDisabled, onClick, buttonProps} = props;
        const {t} = useTranslation(buttonLabelNamespace);

        let label = buttonLabel;
        if (labelStyle === 'none') {
            label = null;
        } else if (labelStyle === 'short' && buttonLabelShort) {
            label = buttonLabelShort;
        }

        return (isVisible !== false &&
            <Button data-sel-role={actionKey}
                    label={t(label, buttonLabelParams)}
                    icon={buttonIcon}
                    disabled={enabled === false || isDisabled}
                    onClick={e => {
                        e.stopPropagation();
                        onClick(props, e);
                    }}
                    {...defaultButtonProps}
                    {...buttonProps}
            />
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
        isDisabled: PropTypes.bool,
        onClick: PropTypes.func,
        buttonProps: PropTypes.object
    };

    return ButtonRenderer;
};

export const ButtonRenderer = getButtonRenderer();
export const ButtonRendererNoLabel = getButtonRenderer({labelStyle: 'none'});
export const ButtonRendererShortLabel = getButtonRenderer({labelStyle: 'short'});
