import React from 'react';
import PropTypes from 'prop-types';
import {Dialog, Paper, Slide} from '@material-ui/core';
import styles from './PickerDialog.scss';
import {configPropType} from '~/SelectorTypes/Picker/configs/configPropType';
import clsx from 'clsx';
import {useExternalPickersInfo} from '~/SelectorTypes/Picker/useExternalPickersInfo';
import {PaperWithSelector} from '~/SelectorTypes/Picker/PickerDialog/PaperWithSelector';

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
    isOpen,
    onClose,
    initialSelectedItem,
    site,
    pickerConfig,
    lang,
    uilang,
    isMultiple,
    accordionItemProps,
    onItemSelection
}) => {
    const {availableExternalPickerConfigs, externalPickerConfig, loading} = useExternalPickersInfo(site, initialSelectedItem, pickerConfig);
    const [currentExternalPicker, setCurrentExternalPicker] = React.useState();

    const damSelector = availableExternalPickerConfigs?.length > 1;
    const current = currentExternalPicker || externalPickerConfig;

    return (
        <Dialog
            fullWidth
            maxWidth="xl"
            data-sel-role="picker-dialog"
            data-sel-type={pickerConfig.key}
            classes={{paper: styles.paper}}
            open={isOpen && !loading}
            PaperComponent={damSelector ? PaperWithSelector : Paper}
            PaperProps={damSelector ? {currentExternalPicker: current, setCurrentExternalPicker, availableExternalPickerConfigs} : {}}
            TransitionComponent={Transition}
            onClose={onClose}
        >
            {availableExternalPickerConfigs && availableExternalPickerConfigs.map(({key, pickerDialog: {cmp: Component}}) => {
                return (
                    <div key={key} className={clsx('flexFluid', 'flexRow_nowrap', styles.navigation, {[styles.isVisible]: current?.key === key})}>
                        <Component {...{
                            className: 'flexFluid',
                            isOpen,
                            site,
                            pickerConfig,
                            initialSelectedItem,
                            accordionItemProps,
                            lang,
                            uilang,
                            isMultiple,
                            onClose,
                            onItemSelection
                        }}/>
                    </div>
                );
            })}
        </Dialog>
    );
};

PickerDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    site: PropTypes.string.isRequired,
    pickerConfig: configPropType.isRequired,
    initialSelectedItem: PropTypes.arrayOf(PropTypes.object),
    accordionItemProps: PropTypes.object,
    lang: PropTypes.string,
    uilang: PropTypes.string,
    isMultiple: PropTypes.bool,
    onItemSelection: PropTypes.func.isRequired
};

PickerDialog.defaultValues = {
    initialSelectedItem: []
};
