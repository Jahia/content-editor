import React, {Suspense, useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {Dialog, Slide} from '@material-ui/core';
import styles from './PickerDialog.scss';
import {
    cePickerPath,
    cePickerSite,
    cePickerMode,
    cePickerOpenPaths,
    cePickerContextSite
} from '~/SelectorTypes/Picker/Picker2.redux';
import {getItemTarget} from '~/SelectorTypes/Picker/accordionItems/accordionItems';
import {batchActions} from 'redux-batched-actions';
import {configPropType} from '~/SelectorTypes/Picker/configs/configPropType';
import {
    booleanValue,
    getAccordionMode,
    getDetailedPathArray,
    getPathWithoutFile
} from '~/SelectorTypes/Picker/Picker2.utils';
import {registry} from '@jahia/ui-extender';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {useNodeInfo} from '@jahia/data-helper';
import RightPanel from './RightPanel';

const Transition = props => {
    return <Slide direction="up" {...props}/>;
};

const ContentNavigation = React.lazy(() => import('@jahia/jcontent').then(module => ({default: module.ContentNavigation})));

const SiteSwitcher = React.lazy(() => import('@jahia/jcontent').then(module => ({default: module.SiteSwitcher})));

const selector = state => ({
    mode: state.contenteditor.picker.mode,
    siteKey: state.contenteditor.picker.site,
    language: state.language
});

const switcherSelector = state => ({
    siteKey: state.contenteditor.picker.site,
    currentLang: state.language
});

function getSite(selectedItem) {
    const pathElements = selectedItem.split('/');
    return (pathElements[1] === 'sites') ? pathElements[2] : 'systemsite';
}

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

    const [selectedItem] = useState(initialSelectedItem);

    const dispatch = useDispatch();

    const currentFolderInfo = useNodeInfo({path: state.path}, {skip: !state.path});

    const previous = useRef(state);
    useEffect(() => {
        if (isOpen && !currentFolderInfo.loading) {
            const actions = [];
            const newState = {...state, isOpen: true};
            let somethingChanged = false;
            if (!previous.current.isOpen) {
                // Initialize site when opening dialog
                if (selectedItem) {
                    // If an item is selected, preselect site/mode/path
                    newState.site = getSite(selectedItem);
                    newState.contextSite = newState.site;
                } else if (editorContext.site !== newState.contextSite) {
                    // If context site has changed, reset to the current site (otherwise keep current site)
                    newState.site = pickerConfig.targetSite ? pickerConfig.targetSite : editorContext.site;
                    newState.contextSite = editorContext.site;
                }

                if (newState.site !== state.site) {
                    actions.push(cePickerSite(newState.site));
                }

                if (newState.contextSite !== state.contextSite) {
                    actions.push(cePickerContextSite(newState.contextSite));
                }

                somethingChanged = true;
            }

            const allAccordionItems = registry.find({type: 'accordionItem', target: getItemTarget(pickerConfig.key)});
            const accordionItems = allAccordionItems
                .filter(accordionItem => !accordionItem.isEnabled || accordionItem.isEnabled(newState.site));

            if (somethingChanged || newState.site !== previous.current.site) {
                // Picker just opened or site has changed, select mode
                if (selectedItem && getSite(selectedItem) === newState.site) {
                    // 1 - Mode of the current selected item is selected
                    newState.mode = getAccordionMode(selectedItem);
                } else if (newState.mode && accordionItems.find(item => item.key === newState.mode)) {
                    // 2 - Previously selected mode is valid, keep it
                } else if (accordionItems.find(item => item.key === 'picker-' + newState.jcontentMode)) {
                    // 3 - Jcontent mode is also valid here, use it
                    newState.mode = 'picker-' + newState.jcontentMode;
                } else {
                    // 4 - Take the first accordion as default
                    newState.mode = accordionItems[0].key;
                }

                if (newState.mode !== state.mode) {
                    actions.push(cePickerMode(newState.mode));
                }

                somethingChanged = true;
            }

            if (somethingChanged || newState.mode !== previous.current.mode) {
                // Mode has changed, select path
                if (selectedItem && getSite(selectedItem) === newState.site && getAccordionMode(selectedItem) === newState.mode) {
                    // 1 - Parent path of the select item is selected
                    newState.path = getPathWithoutFile(selectedItem);
                } else if (getSite(newState.path) === newState.site && getAccordionMode(newState.path) === newState.mode && currentFolderInfo.node) {
                    // 2 - Previously selected path is valid
                } else if (getSite(state.jcontentPath) === newState.site && getAccordionMode(state.jcontentPath) === newState.mode) {
                    // 3 - Jcontent path is also valid here, use it
                    newState.path = state.jcontentPath;
                } else {
                    // 4 - Use default path of the current mode
                    newState.path = accordionItems.find(item => item.key === newState.mode).defaultPath(newState.site);
                }

                // Extend the list of openPath with the currently selected path
                newState.openPaths = [...new Set([...newState.openPaths, ...getDetailedPathArray(getPathWithoutFile(newState.path), newState.site)])];

                if (newState.path !== state.path) {
                    actions.push(cePickerPath(newState.path));
                }

                if (newState.openPaths.length !== state.openPaths.length || newState.openPaths.some(value => state.openPaths.indexOf(value) === -1)) {
                    actions.push(cePickerOpenPaths(newState.openPaths));
                }
            }

            if (actions.length > 0) {
                dispatch(batchActions(actions));
            }

            previous.current = newState;
        } else {
            previous.current = {...state, isOpen: false};
        }
    }, [dispatch, editorContext, isOpen, initialSelectedItem, pickerConfig, selectedItem, state, currentFolderInfo]);

    return (
        <Dialog
            fullScreen
            classes={{root: styles.rootDialog}}
            open={isOpen}
            TransitionComponent={Transition}
            onClose={onClose}
        >
            <Suspense fallback={<div>Loading picker ...</div>}>
                <div className={styles.layout}>
                    {booleanValue(pickerConfig.pickerDialog.displayTree) && (
                        <ContentNavigation
                            header={(booleanValue(pickerConfig.pickerDialog.displaySiteSwitcher) && (
                                <div>
                                    <SiteSwitcher selector={switcherSelector}
                                                  onSelectAction={siteNode => {
                                                      const actions = [];
                                                      actions.push(cePickerSite(siteNode.name));
                                                      // Const accordionItems = registry.find({type: 'accordionItem', target: getItemTarget(pickerConfig.key)})
                                                      //     .filter(accordionItem => !accordionItem.isEnabled || accordionItem.isEnabled(siteNode.name));
                                                      // const selectedAccordion = accordionItems.find(item => item.key === mode) || accordionItems[0];
                                                      // const newPath = selectedAccordion.defaultPath(siteNode.name);
                                                      // actions.push(cePickerPath(newPath));
                                                      // actions.push(cePickerMode(selectedAccordion.key));
                                                      // actions.push(cePickerOpenPaths([...openPaths, ...getDetailedPathArray(newPath, siteNode.name)]));

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
                    )}
                    <RightPanel pickerConfig={pickerConfig} onClose={onClose} onItemSelection={onItemSelection}/>
                </div>
            </Suspense>
        </Dialog>
    );
};

PickerDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    editorContext: PropTypes.object.isRequired,
    pickerConfig: configPropType.isRequired,
    initialSelectedItem: PropTypes.string,
    accordionItemProps: PropTypes.object,
    onItemSelection: PropTypes.func.isRequired
};