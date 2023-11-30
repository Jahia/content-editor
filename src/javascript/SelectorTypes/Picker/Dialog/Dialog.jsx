import {Dialog as MuiDialog, Slide} from '@material-ui/core';
import styles from './Dialog.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {configPropType} from '~/SelectorTypes/Picker/configs/configPropType';
const DefaultTransition = props => (
    <Slide direction="up"
           {...props}
           onEntered={node => {
               // Remove transform style after transition to fix internal positioning
               node.style = {};
           }}
    />
);

export const Dialog = ({isOpen, onClose, pickerConfig, Transition, children}) => {
    const TransitionComponent = Transition || DefaultTransition;
    return (
        <MuiDialog
            fullWidth
            maxWidth="xl"
            data-sel-role="picker-dialog"
            data-sel-type={pickerConfig.key}
            classes={{paper: styles.paper}}
            open={isOpen}
            TransitionComponent={TransitionComponent}
            onClose={onClose}
        >
            {children}
        </MuiDialog>
    );
};

Dialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    pickerConfig: configPropType.isRequired,
    Transition: PropTypes.elementType,
    children: PropTypes.node.isRequired
};
