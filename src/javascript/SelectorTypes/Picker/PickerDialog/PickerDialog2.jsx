import React from 'react';
import PropTypes from 'prop-types';
import {Dialog, Slide} from '@material-ui/core';
import styles from './PickerDialog.scss';
import {cePickerMode, cePickerOpenPaths, cePickerPath, cePickerSite} from '~/SelectorTypes/Picker/Picker2.redux';
import {getItemTarget} from '~/SelectorTypes/Picker/accordionItems/accordionItems';
import {batchActions} from 'redux-batched-actions';
import {configPropType} from '~/SelectorTypes/Picker/configs/configPropType';
import {booleanValue, getDetailedPathArray} from '~/SelectorTypes/Picker/Picker2.utils';
import {registry} from '@jahia/ui-extender';
import {shallowEqual, useSelector} from 'react-redux';
import RightPanel from './RightPanel';
import {ContentNavigation, SiteSwitcher} from '@jahia/jcontent';
import {SelectionHandler} from '~/SelectorTypes/Picker/PickerDialog/SelectionHandler';

const Transition = props => {
    return <Slide direction="up" {...props}/>;
};

const selector = state => ({
    mode: state.contenteditor.picker.mode,
    siteKey: state.contenteditor.picker.site,
    language: state.language
});

const switcherSelector = state => ({
    siteKey: state.contenteditor.picker.site,
    currentLang: state.language
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
    const state = useSelector(state => ({
        mode: state.contenteditor.picker.mode,
        path: state.contenteditor.picker.path,
        openPaths: state.contenteditor.picker.openPaths,
        site: state.contenteditor.picker.site,
        contextSite: state.contenteditor.picker.contextSite,
        jcontentMode: state.jcontent.mode,
        jcontentPath: state.jcontent.path
    }), shallowEqual);

    return (
        <Dialog
            fullWidth
            maxWidth="xl"
            data-sel-role="picker-dialog"
            classes={{paper: styles.paper}}
            open={isOpen}
            TransitionComponent={Transition}
            onClose={onClose}
        >
            <div className="flexFluid flexRow_nowrap">
                <SelectionHandler editorContext={editorContext} pickerConfig={pickerConfig} initialSelectedItem={initialSelectedItem}>
                    {booleanValue(pickerConfig.pickerDialog.displayTree) && (
                        <aside>
                            <ContentNavigation
                                isReversed={false}
                                header={(booleanValue(pickerConfig.pickerDialog.displaySiteSwitcher) && (
                                    <div>
                                        <SiteSwitcher selector={switcherSelector}
                                                      onSelectAction={siteNode => {
                                                          const actions = [];
                                                          actions.push(cePickerSite(siteNode.name));
                                                          const accordionItems = registry.find({type: 'accordionItem', target: getItemTarget(pickerConfig.key)})
                                                              .filter(accordionItem => !accordionItem.isEnabled || accordionItem.isEnabled(siteNode.name));
                                                          const selectedAccordion = accordionItems.find(item => item.key === state.mode) || accordionItems[0];
                                                          const newPath = selectedAccordion.defaultPath(siteNode.name);
                                                          actions.push(cePickerPath(newPath));
                                                          actions.push(cePickerMode(selectedAccordion.key));
                                                          actions.push(cePickerOpenPaths([...state.openPaths, ...getDetailedPathArray(newPath, siteNode.name)]));

                                                          return batchActions(actions);
                                                      }}
                                        />
                                    </div>
                                ))}
                                accordionItemTarget={getItemTarget(pickerConfig.key)}
                                accordionItemProps={accordionItemProps}
                                selector={selector}
                                handleNavigationAction={(mode, path) => (batchActions([cePickerPath(path), cePickerMode(mode)]))}
                            />
                        </aside>
                    )}
                    <RightPanel pickerConfig={pickerConfig} onClose={onClose} onItemSelection={onItemSelection}/>
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
