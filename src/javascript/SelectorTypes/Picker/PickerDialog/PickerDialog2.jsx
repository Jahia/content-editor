import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {Dialog, Slide} from '@material-ui/core';
import styles from './PickerDialog.scss';
import {
    cePickerClearSelection,
    cePickerMode,
    cePickerPath,
    cePickerSetPage,
    cePickerSetSearchTerm
} from '~/SelectorTypes/Picker/Picker2.redux';
import {batchActions} from 'redux-batched-actions';
import {configPropType} from '~/SelectorTypes/Picker/configs/configPropType';
import {booleanValue} from '~/SelectorTypes/Picker/Picker2.utils';
import {useDispatch} from 'react-redux';
import RightPanel from './RightPanel';
import {ContentNavigation} from '@jahia/jcontent';
import {SelectionHandler} from '~/SelectorTypes/Picker/PickerDialog/SelectionHandler';
import {PickerSiteSwitcher} from '~/SelectorTypes/Picker/PickerDialog/PickerSiteSwitcher';

const Transition = props => {
    return <Slide direction="up" {...props}/>;
};

const selector = state => ({
    mode: state.contenteditor.picker.mode,
    siteKey: state.contenteditor.picker.site,
    language: state.contenteditor.ceLanguage
});

export const PickerDialog = ({
    isOpen,
    onClose,
    initialSelectedItem,
    editorContext,
    pickerConfig,
    accordionItemProps,
    onItemSelection
}) => {
    const dispatch = useDispatch();
    useEffect(() => {
        if (isOpen) {
            dispatch(batchActions([
                cePickerSetSearchTerm(''),
                cePickerSetPage(0)
            ]));
        }

        return () => {
            if (isOpen) {
                dispatch(cePickerClearSelection());
            }
        };
    }, [dispatch, pickerConfig.key, isOpen]);

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
            <div className="flexFluid flexRow_nowrap">
                <SelectionHandler editorContext={editorContext} pickerConfig={pickerConfig} accordionItemProps={accordionItemProps} initialSelectedItem={initialSelectedItem}>
                    {booleanValue(pickerConfig.pickerDialog.displayTree) && (
                        <aside>
                            <ContentNavigation
                                isReversed={false}
                                header={(booleanValue(pickerConfig.pickerDialog.displaySiteSwitcher) && (
                                    <div>
                                        <PickerSiteSwitcher pickerConfig={pickerConfig} accordionItemProps={accordionItemProps}/>
                                    </div>
                                ))}
                                accordionItemTarget={pickerConfig.key}
                                accordionItemProps={accordionItemProps}
                                selector={selector}
                                handleNavigationAction={(mode, path) => (batchActions([cePickerPath(path), cePickerMode(mode)]))}
                            />
                        </aside>
                    )}
                    <RightPanel pickerConfig={pickerConfig} accordionItemProps={accordionItemProps} onClose={onClose} onItemSelection={onItemSelection}/>
                </SelectionHandler>
            </div>
        </Dialog>
    );
};

PickerDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    editorContext: PropTypes.object.isRequired,
    pickerConfig: configPropType.isRequired,
    initialSelectedItem: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    accordionItemProps: PropTypes.object,
    onItemSelection: PropTypes.func.isRequired
};

PickerDialog.defaultValues = {
    initialSelectedItem: []
};
