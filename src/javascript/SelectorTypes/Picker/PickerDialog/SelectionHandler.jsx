import React, {useEffect, useRef} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {useNodeInfo} from '@jahia/data-helper';
import {useContentEditorConfigContext} from '~/contexts';
import {useQuery} from '@apollo/react-hooks';
import {GET_PICKER_NODE} from '~/SelectorTypes/Picker';
import {
    cePickerContextSite,
    cePickerMode,
    cePickerModes,
    cePickerOpenPaths,
    cePickerPath,
    cePickerSetSelection,
    cePickerSite
} from '~/SelectorTypes/Picker/Picker2.redux';
import {registry} from '@jahia/ui-extender';
import {getItemTarget} from '~/SelectorTypes/Picker/accordionItems/accordionItems';
import {getDetailedPathArray, getPathWithoutFile} from '~/SelectorTypes/Picker/Picker2.utils';
import {batchActions} from 'redux-batched-actions';
import PropTypes from 'prop-types';
import {configPropType} from '~/SelectorTypes/Picker/configs/configPropType';
import {LoaderOverlay} from '~/DesignSystem/LoaderOverlay';
import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';

function getSite(selectedItem) {
    const pathElements = selectedItem.split('/');
    return (pathElements[1] === 'sites') ? pathElements[2] : undefined;
}

export const SelectionHandler = ({initialSelectedItem, editorContext, pickerConfig, children}) => {
    const state = useSelector(state => ({
        mode: state.contenteditor.picker.mode,
        modes: state.contenteditor.picker.modes,
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

    const paths = (Array.isArray(initialSelectedItem) ? initialSelectedItem : [initialSelectedItem]).filter(f => f);
    const nodesInfo = useQuery(GET_PICKER_NODE, {
        variables: {
            paths, lang, uilang
        }
    });

    useEffect(() => {
        if (nodesInfo.data) {
            const nodes = nodesInfo.data.jcr.nodesByPath;
            dispatch(cePickerSetSelection(nodes));
        }
    }, [nodesInfo.data, dispatch]);

    const previousState = useRef(state);
    useEffect(() => {
        if (currentFolderInfo.loading || nodesInfo.loading || state.mode === Constants.mode.SEARCH) {
            return;
        }

        const newState = {...state, isOpen: true};

        const selectedNode = nodesInfo.data && nodesInfo.data.jcr.nodesByPath.length > 0 && nodesInfo.data.jcr.nodesByPath[0];

        const allAccordionItems = registry.find({
            type: 'accordionItem',
            target: getItemTarget(pickerConfig.key)
        });

        let firstMatchingAccordion = allAccordionItems.find(accord => {
            return accord.canDisplayItem && accord.canDisplayItem({selectionNode: selectedNode, folderNode: currentFolderInfo.node});
        });

        if (!firstMatchingAccordion) {
            // This case can happen when we have two pickers site and editorial, site picker with selection,
            // open site picker, close it, open editorial picker: picker key is correct, selection is false and
            // currentFolderInfo still points at /sites so there is no way it can get past those canDisplayItems checks
            console.info(`Cannot find a matching accordion for picker with key ${pickerConfig.key}`);
            firstMatchingAccordion = allAccordionItems[0];
        }

        let somethingChanged = false;
        if (!previousState.current.isOpen) {
            // Initialize site when opening dialog
            newState.contextSite = editorContext.site;
            if (selectedNode) {
                // If an item is selected, preselect site/mode/path
                newState.site = getSite(selectedNode.path);
                newState.mode = firstMatchingAccordion.key;
                if (firstMatchingAccordion.getPathForItem) {
                    // Todo: Must implement something for pages accordion, where the selected path is not the direct parent
                    newState.path = firstMatchingAccordion.getPathForItem(selectedNode);
                } else {
                    newState.path = getPathWithoutFile(selectedNode.path);
                }
            } else if (previousState.current.contextSite !== newState.contextSite || newState.site !== newState.contextSite) {
                // If context site has changed, reset to the current site (otherwise keep current site)
                newState.site = pickerConfig.targetSite ? pickerConfig.targetSite : newState.contextSite;
            }

            somethingChanged = true;
        }

        const accordionItems = allAccordionItems
            .filter(accordionItem => !accordionItem.isEnabled || accordionItem.isEnabled(newState.site));
        newState.modes = accordionItems.map(item => item.key);

        if (somethingChanged || newState.site !== previousState.current.site) {
            // Picker just opened or site has changed, select mode
            if (newState.mode && firstMatchingAccordion.key === newState.mode) {
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
            if (getSite(newState.path) === newState.site && firstMatchingAccordion.key === newState.mode && currentFolderInfo.node) {
                // 2 - Update path for new mode
            } else if (getSite(state.jcontentPath) === newState.site && firstMatchingAccordion.key === newState.mode && !pickerConfig.doNotUseJcontentPath) {
                // 3 - Jcontent path is also valid here, use it
                newState.path = state.jcontentPath;
            } else {
                // 4 - Use default path of the current mode
                newState.path = firstMatchingAccordion.defaultPath(newState.site);
            }

            // Extend the list of openPath with the currently selected path
            newState.openPaths = [...new Set([...newState.openPaths, ...getDetailedPathArray(getPathWithoutFile(newState.path), newState.site)])];
        }

        const actions = ([
            (newState.site !== state.site) && cePickerSite(newState.site),
            (newState.contextSite !== state.contextSite) && cePickerContextSite(newState.contextSite),
            (newState.mode !== state.mode) && cePickerMode(newState.mode),
            (newState.modes.length !== state.modes?.length || newState.modes.some(mode => !state.modes.includes(mode))) && cePickerModes(newState.modes),
            (newState.path !== state.path) && cePickerPath(newState.path),
            (newState.openPaths.length !== state.openPaths.length || newState.openPaths.some(value => state.openPaths.indexOf(value) === -1)) && cePickerOpenPaths(newState.openPaths)
        ]).filter(f => f);

        if (actions.length > 0) {
            dispatch(batchActions(actions));
        }

        previousState.current = newState;
    }, [dispatch, editorContext, pickerConfig, state, nodesInfo, currentFolderInfo]);

    if (currentFolderInfo.loading || nodesInfo.loading) {
        return <LoaderOverlay/>;
    }

    return children;
};

SelectionHandler.propTypes = {
    initialSelectedItem: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    editorContext: PropTypes.object.isRequired,
    pickerConfig: configPropType.isRequired,
    children: PropTypes.node
};
