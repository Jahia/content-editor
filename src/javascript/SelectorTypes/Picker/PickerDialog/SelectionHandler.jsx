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
    cePickerSetSort, cePickerSetTableViewType,
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
        viewType: state.contenteditor.picker.tableView.viewType
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
            return (!accord.isEnabled || accord.isEnabled(newState.site)) && accord.canDisplayItem && accord.canDisplayItem({selectionNode: selectedNode, folderNode: currentFolderInfo.node});
        });

        if (!firstMatchingAccordion) {
            // This case can happen when we have two pickers site and editorial, site picker with selection,
            // open site picker, close it, open editorial picker: picker key is correct, selection is false and
            // currentFolderInfo still points at /sites so there is no way it can get past those canDisplayItems checks
            console.info(`Cannot find a matching accordion for picker with key ${pickerConfig.key}`);
            firstMatchingAccordion = allAccordionItems[0];
        }

        // If selection exists we don't care about previous state, need to update state in accordance with selection
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
                newState.path = firstMatchingAccordion.defaultPath(newState.site);
            }

            if (firstMatchingAccordion.getViewTypeForItem) {
                newState.viewType = firstMatchingAccordion.getViewTypeForItem(selectedNode);
            }
        } else {
            if (previousState.current.contextSite !== newState.contextSite && newState.site !== newState.contextSite) {
                // If context site has changed, reset to the current site (otherwise keep current site)
                newState.site = pickerConfig.targetSite ? pickerConfig.targetSite : newState.contextSite;
            }

            newState.mode = firstMatchingAccordion.key;
            const defaultPath = firstMatchingAccordion.defaultPath(newState.site);
            // If picker default path does not target any site use it
            newState.path = getSite(newState.path) === newState.site &&
            defaultPath.indexOf(`/${newState.site}`) !== -1 &&
            previousState.current.mode === newState.mode ? newState.path :
                defaultPath;
        }

        const accordionItems = allAccordionItems
            .filter(accordionItem => !accordionItem.isEnabled || accordionItem.isEnabled(newState.site));
        newState.modes = accordionItems.map(item => item.key);

        newState.openPaths = [...new Set([...newState.openPaths, ...getDetailedPathArray(getPathWithoutFile(newState.path), newState.site)])];

        if (previousState.current.mode !== newState.mode && firstMatchingAccordion.defaultSort) {
            newState.sort = firstMatchingAccordion.defaultSort;
        }

        const actions = ([
            (newState.site !== state.site) && cePickerSite(newState.site),
            (newState.contextSite !== state.contextSite) && cePickerContextSite(newState.contextSite),
            (newState.mode !== state.mode) && cePickerMode(newState.mode),
            (newState.sort !== state.sort) && cePickerSetSort(newState.sort),
            (newState.modes.length !== state.modes?.length || newState.modes.some(mode => !state.modes.includes(mode))) && cePickerModes(newState.modes),
            (newState.path !== state.path) && cePickerPath(newState.path),
            (newState.viewType !== state.viewType) && cePickerSetTableViewType(newState.viewType),
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
