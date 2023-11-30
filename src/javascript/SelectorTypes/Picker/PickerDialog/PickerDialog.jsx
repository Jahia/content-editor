import React from 'react';
import PropTypes from 'prop-types';
import {Dialog, Slide} from '@material-ui/core';
import styles from './PickerDialog.scss';
// Import {
//     cePickerClearSelection,
//     cePickerMode,
//     cePickerPath,
//     cePickerSetMultiple,
//     cePickerSetPage,
//     cePickerSetSearchTerm
// } from '~/SelectorTypes/Picker/Picker.redux';
// import {batchActions} from 'redux-batched-actions';
import {configPropType} from '~/SelectorTypes/Picker/configs/configPropType';
// Import {booleanValue} from '~/SelectorTypes/Picker/Picker.utils';
// import {useDispatch} from 'react-redux';
// import RightPanel from './RightPanel';
// import {ContentNavigation} from '@jahia/jcontent';
// import {SelectionHandler} from '~/SelectorTypes/Picker/PickerDialog/SelectionHandler';
// import {PickerSiteSwitcher} from '~/SelectorTypes/Picker/PickerDialog/PickerSiteSwitcher';
import clsx from 'clsx';
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

// Const selector = state => ({
//     mode: state.contenteditor.picker.mode,
//     siteKey: state.contenteditor.picker.site,
//     language: state.contenteditor.ceLanguage
// });

export const PickerDialog = ({
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
    // Const dispatch = useDispatch();
    //
    // useEffect(() => {
    //     if (isOpen) {
    //         dispatch(batchActions([
    //             cePickerSetSearchTerm(''),
    //             cePickerSetPage(0),
    //             cePickerSetMultiple(isMultiple)
    //         ]));
    //     }
    //
    //     return () => {
    //         if (isOpen) {
    //             dispatch(cePickerClearSelection());
    //         }
    //     };
    // }, [dispatch, pickerConfig.key, isOpen, isMultiple]);

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
            <div className={clsx('flexFluid', 'flexRow_nowrap', styles.navigation)}>
                <JahiaPicker {...{
                    isOpen,
                    onClose,
                    site,
                    pickerConfig,
                    initialSelectedItem,
                    accordionItemProps,
                    lang,
                    isMultiple,
                    onItemSelection}}/>
            </div>
        </Dialog>
    );
};

PickerDialog.propTypes = {
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
    initialSelectedItem: []
};
