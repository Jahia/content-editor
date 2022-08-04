import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {Dialog, Slide} from '@material-ui/core';
import styles from './PickerDialog.scss';
import {
    cePickerContextSite,
    cePickerMode,
    cePickerOpenPaths,
    cePickerPath,
    cePickerSetSelection,
    cePickerSite
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
import {ContentNavigation, SiteSwitcher} from '@jahia/jcontent';
import {encodeJCRPath} from '~/utils';
import {useLazyQuery} from '@apollo/react-hooks';
import {useContentEditorConfigContext} from '~/contexts';
import {GET_PICKER_NODE} from '~/SelectorTypes/Picker/PickerDialog/PickerDialog2.gql-queries';

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

    const dispatch = useDispatch();

    const currentFolderInfo = useNodeInfo({path: state.path}, {skip: !state.path});
    const {lang, uilang} = useContentEditorConfigContext();

    const [getNode, nodesInfo] = useLazyQuery(GET_PICKER_NODE);

    useEffect(() => {
        if (isOpen) {
            const paths = (Array.isArray(initialSelectedItem) ? initialSelectedItem : [initialSelectedItem]).filter(f => f);
            getNode({
                variables: {
                    paths, lang, uilang
                }
            });
        }
    }, [isOpen, getNode, dispatch, initialSelectedItem, lang, uilang]);

    useEffect(() => {
        if (isOpen && nodesInfo.data) {
            const nodes = nodesInfo.data.jcr.nodesByPath;
            dispatch(cePickerSetSelection(nodes.map(n => ({
                uuid: n.uuid,
                path: n.path,
                url: encodeJCRPath(`${n.primaryNodeType.icon}.png`),
                name: n.displayName,
                info: n.primaryNodeType.displayName
            }))));
        }
    }, [isOpen, nodesInfo.data, dispatch]);

    const previousState = useRef(state);
    useEffect(() => {
        if (currentFolderInfo.loading || nodesInfo.loading || !nodesInfo.called) {
            return;
        }

        const newState = {...state, isOpen};
        if (isOpen) {
            const selectedNode = nodesInfo.data && nodesInfo.data.jcr.nodesByPath.length > 0 && nodesInfo.data.jcr.nodesByPath[0];

            const allAccordionItems = registry.find({
                type: 'accordionItem',
                target: getItemTarget(pickerConfig.key)
            });

            let somethingChanged = false;
            if (!previousState.current.isOpen) {
                // Initialize site when opening dialog
                newState.contextSite = editorContext.site;
                if (selectedNode) {
                    // If an item is selected, preselect site/mode/path
                    newState.site = getSite(selectedNode.path);
                    newState.mode = getAccordionMode(selectedNode.path);
                    const accordionItem = allAccordionItems.find(item => item.key === newState.mode);
                    if (accordionItem.getPathForItem) {
                        // Todo: Must implement something for pages accordion, where the selected path is not the direct parent
                        newState.path = accordionItem.getPathForItem(selectedNode);
                    } else {
                        newState.path = getPathWithoutFile(selectedNode.path);
                    }
                } else if (previousState.current.contextSite !== newState.contextSite) {
                    // If context site has changed, reset to the current site (otherwise keep current site)
                    newState.site = pickerConfig.targetSite ? pickerConfig.targetSite : newState.contextSite;
                }

                somethingChanged = true;
            }

            const accordionItems = allAccordionItems
                .filter(accordionItem => !accordionItem.isEnabled || accordionItem.isEnabled(newState.site));

            if (somethingChanged || newState.site !== previousState.current.site) {
                // Picker just opened or site has changed, select mode
                if (newState.mode && accordionItems.find(item => item.key === newState.mode)) {
                    // 2 - Previously selected mode is valid, keep it
                } else if (accordionItems.find(item => item.key === 'picker-' + newState.jcontentMode)) {
                    // 3 - Jcontent mode is also valid here, use it
                    newState.mode = 'picker-' + newState.jcontentMode;
                } else {
                    // 4 - Take the first accordion as default
                    newState.mode = accordionItems[0].key;
                }

                somethingChanged = true;
            }

            if (somethingChanged || newState.mode !== previousState.current.mode) {
                // Mode has changed, select path
                if (getSite(newState.path) === newState.site && getAccordionMode(newState.path) === newState.mode && currentFolderInfo.node) {
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
            }

            const actions = ([
                (newState.site !== state.site) && cePickerSite(newState.site),
                (newState.contextSite !== state.contextSite) && cePickerContextSite(newState.contextSite),
                (newState.mode !== state.mode) && cePickerMode(newState.mode),
                (newState.path !== state.path) && cePickerPath(newState.path),
                (newState.openPaths.length !== state.openPaths.length || newState.openPaths.some(value => state.openPaths.indexOf(value) === -1)) && cePickerOpenPaths(newState.openPaths)
            ]).filter(f => f);

            if (actions.length > 0) {
                dispatch(batchActions(actions));
            }
        }

        previousState.current = newState;
    }, [dispatch, editorContext, isOpen, pickerConfig, state, nodesInfo, currentFolderInfo]);

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
