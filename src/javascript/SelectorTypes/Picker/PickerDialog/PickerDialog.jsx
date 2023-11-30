import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
// Import {Dialog, Slide} from '@material-ui/core';
import {Dialog} from '~/SelectorTypes/Picker/Dialog';
import styles from './PickerDialog.scss';
import {
    cePickerClearSelection,
    cePickerMode,
    cePickerPath,
    cePickerSetMultiple,
    cePickerSetPage,
    cePickerSetSearchTerm
} from '~/SelectorTypes/Picker/Picker.redux';
import {batchActions} from 'redux-batched-actions';
import {configPropType} from '~/SelectorTypes/Picker/configs/configPropType';
import {booleanValue} from '~/SelectorTypes/Picker/Picker.utils';
import {useDispatch} from 'react-redux';
import RightPanel from './RightPanel';
import {ContentNavigation} from '@jahia/jcontent';
import {SelectionHandler} from '~/SelectorTypes/Picker/PickerDialog/SelectionHandler';
import {PickerSiteSwitcher} from '~/SelectorTypes/Picker/PickerDialog/PickerSiteSwitcher';
import clsx from 'clsx';

// Const Transition = props => (
//     <Slide direction="up"
//            {...props}
//            onEntered={node => {
//                // Remove transform style after transition to fix internal positioning
//                node.style = {};
//            }}
//     />
// );

const selector = state => ({
    mode: state.contenteditor.picker.mode,
    siteKey: state.contenteditor.picker.site,
    language: state.contenteditor.ceLanguage
});

// Const Wrapper = ({isOpen, onClose, pickerConfig, inlineContainer, children}) => {
//     if (inlineContainer) {
//         return children;
//     }
//
//     return (
//         <Dialog
//             fullWidth
//             maxWidth="xl"
//             data-sel-role="picker-dialog"
//             data-sel-type={pickerConfig.key}
//             classes={{paper: styles.paper}}
//             open={isOpen}
//             TransitionComponent={Transition}
//             onClose={onClose}
//         >
//             {children}
//         </Dialog>
//     );
// };

const Wrapper = ({isOpen, onClose, pickerConfig, inlineContainer, children}) => {
    if (inlineContainer) {
        return children;
    }

    return (
        <Dialog {...{
            isOpen,
            onClose,
            pickerConfig
        }}
        >
            {children}
        </Dialog>
    );
};

Wrapper.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    pickerConfig: configPropType.isRequired,
    inlineContainer: PropTypes.bool,
    children: PropTypes.node.isRequired
};

export const PickerDialog = ({
    isOpen,
    onClose,
    initialSelectedItem,
    site,
    pickerConfig,
    lang,
    isMultiple,
    accordionItemProps,
    onItemSelection,
    inlineContainer
}) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (isOpen) {
            dispatch(batchActions([
                cePickerSetSearchTerm(''),
                cePickerSetPage(0),
                cePickerSetMultiple(isMultiple)
            ]));
        }

        return () => {
            if (isOpen) {
                dispatch(cePickerClearSelection());
            }
        };
    }, [dispatch, pickerConfig.key, isOpen, isMultiple]);

    return (
        <Wrapper {...{
            isOpen,
            onClose,
            pickerConfig,
            inlineContainer
        }}
        >
            <div className={clsx('flexFluid', 'flexRow_nowrap', styles.navigation)}>
                <SelectionHandler site={site} pickerConfig={pickerConfig} accordionItemProps={accordionItemProps} initialSelectedItem={initialSelectedItem} lang={lang}>
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
                    <RightPanel pickerConfig={pickerConfig} accordionItemProps={accordionItemProps} isMultiple={isMultiple} lang={lang} onClose={onClose} onItemSelection={onItemSelection}/>
                </SelectionHandler>
            </div>
        </Wrapper>
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
    onItemSelection: PropTypes.func.isRequired,
    inlineContainer: PropTypes.bool
};

PickerDialog.defaultValues = {
    initialSelectedItem: [],
    inlineContainer: false
};
