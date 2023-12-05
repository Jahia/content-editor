import React from 'react';
import PropTypes from 'prop-types';
import {Dialog, Slide} from '@material-ui/core';
import styles from './PickerDialog.scss';
import {configPropType} from '~/SelectorTypes/Picker/configs/configPropType';
import {DamPropsTypes} from '~/SelectorTypes/Picker/PickerWrapper/PickerWrapper.proptypes';
import {
    formatInitialSelectedItem, getInitialOption
} from '~/SelectorTypes/Picker/PickerDialog/Pickers.utils';

import {PickerSelector} from '~/SelectorTypes/Picker/PickerDialog/PickerSelector';
import {JahiaPicker} from '~/SelectorTypes/Picker';

const Transition = props => (
    <Slide direction="up"
           {...props}
           onEntered={node => {
               // Remove transform style after transition to fix internal positioning
               node.style = {};
           }}
    />
);

export const PickerDialog = ({
    dam,
    isCkEditor,
    isOpen,
    onClose,
    initialSelectedItem,
    site,
    pickerConfig,
    lang,
    isMultiple,
    accordionItemProps,
    onItemSelection
}) => {
    const initialSelectedValues = formatInitialSelectedItem(initialSelectedItem);
    const {pickerConfigsEnabled} = dam;
    let {currentPickerConfiguration} = dam;

    if (!currentPickerConfiguration) {
        currentPickerConfiguration = getInitialOption({pickerConfigsEnabled, valuePath: initialSelectedItem});
    }

    if (pickerConfigsEnabled.length === 1) {
        return (
            <Dialog
                fullWidth
                maxWidth="xl"
                data-sel-role="picker-dialog"
                data-sel-type={pickerConfig.key}
                classes={{paper: styles.paper}}
                open={isOpen}
                TransitionComponent={Transition}
                onClose={onClose}
            >
                <JahiaPicker {...{
                        isOpen,
                        onClose,
                        site,
                        pickerConfig,
                        initialSelectedItem: initialSelectedValues && initialSelectedValues.map(f => f.path),
                        accordionItemProps,
                        lang,
                        isMultiple,
                        onItemSelection}}/>

            </Dialog>
        );
    }

    return (
        <Dialog
            fullWidth
            maxWidth="xl"
            data-sel-role="picker-dialog"
            data-sel-type={pickerConfig.key}
            classes={{paper: styles.pickerDam}}
            open={isOpen}
            TransitionComponent={Transition}
            onClose={onClose}
        >
            <PickerSelector {...{
                pickerConfigsEnabled,
                initialOption: currentPickerConfiguration, // GetInitialOption({pickerConfigsEnabled, valueTypes}),
                isCkEditor,
                isOpen,
                onClose,
                site,
                pickerConfig,
                initialSelectedItem: initialSelectedValues,
                accordionItemProps,
                lang,
                isMultiple,
                onItemSelection}}/>
        </Dialog>
    );
};

PickerDialog.propTypes = {
    dam: DamPropsTypes,
    isCkEditor: PropTypes.bool,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    site: PropTypes.string.isRequired,
    pickerConfig: configPropType.isRequired,
    initialSelectedItem: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    accordionItemProps: PropTypes.object,
    lang: PropTypes.string,
    isMultiple: PropTypes.bool,
    onItemSelection: PropTypes.func.isRequired
};

PickerDialog.defaultValues = {
    initialSelectedItem: [],
    isCkEditor: false
};
