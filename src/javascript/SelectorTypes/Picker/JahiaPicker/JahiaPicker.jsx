import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {
    cePickerClearSelection,
    cePickerMode,
    cePickerPath,
    cePickerSetMultiple,
    cePickerSetPage,
    cePickerSetSearchTerm
} from '~/SelectorTypes/Picker/Picker.redux';
import {batchActions} from 'redux-batched-actions';
import {configPropType} from '../configs/configPropType';
import {booleanValue} from '../Picker.utils';
import {useDispatch} from 'react-redux';
import RightPanel from './RightPanel';
import {ContentNavigation} from '@jahia/jcontent';
import {SelectionHandler} from './SelectionHandler';
import {PickerSiteSwitcher} from './PickerSiteSwitcher';

const selector = state => ({
    mode: state.contenteditor.picker.mode,
    siteKey: state.contenteditor.picker.site,
    language: state.contenteditor.ceLanguage
});

export const JahiaPicker = ({
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
        <SelectionHandler site={site}
                          pickerConfig={pickerConfig}
                          accordionItemProps={accordionItemProps}
                          initialSelectedItem={initialSelectedItem}
                          lang={lang}
                          uilang={uilang}
        >
            {booleanValue(pickerConfig.pickerDialog.displayTree) && (
                <aside>
                    <ContentNavigation
                        isReversed={false}
                        header={(booleanValue(pickerConfig.pickerDialog.displaySiteSwitcher) && (
                            <div>
                                <PickerSiteSwitcher pickerConfig={pickerConfig}
                                                    accordionItemProps={accordionItemProps}/>
                            </div>
                        ))}
                        accordionItemTarget={pickerConfig.key}
                        accordionItemProps={accordionItemProps}
                        selector={selector}
                        handleNavigationAction={(mode, path) => (batchActions([cePickerPath(path), cePickerMode(mode)]))}
                    />
                </aside>
            )}
            <RightPanel pickerConfig={pickerConfig}
                        accordionItemProps={accordionItemProps}
                        isMultiple={isMultiple}
                        lang={lang}
                        uilang={uilang}
                        onClose={onClose}
                        onItemSelection={onItemSelection}/>
        </SelectionHandler>
    );
};

JahiaPicker.propTypes = {
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

JahiaPicker.defaultValues = {
    initialSelectedItem: []
};
