import React, {useEffect, useRef} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {replaceFragmentsInDocument, useNodeInfo} from '@jahia/data-helper';
import {useQuery} from '@apollo/react-hooks';
import {GET_PICKER_NODE} from '~/SelectorTypes/Picker';
import {
    cePickerMode,
    cePickerModes,
    cePickerOpenPaths,
    cePickerPath,
    cePickerSetSelection,
    cePickerSetSort,
    cePickerSetTableViewType,
    cePickerSite
} from '~/SelectorTypes/Picker/Picker.redux';
import {registry} from '@jahia/ui-extender';
import {getDetailedPathArray, getPathWithoutFile} from '~/SelectorTypes/Picker/Picker.utils';
import {batchActions} from 'redux-batched-actions';
import PropTypes from 'prop-types';
import {configPropType} from '~/SelectorTypes/Picker/configs/configPropType';
import {LoaderOverlay} from '~/DesignSystem/LoaderOverlay';
import {Constants} from '~/SelectorTypes/Picker/Picker.constants';
import {jcontentUtils} from '@jahia/jcontent';

function getSite(selectedItem) {
    const pathElements = selectedItem.split('/');
    return (pathElements[1] === 'sites') ? pathElements[2] : undefined;
}

export const SelectionHandler = ({initialSelectedItem, site, pickerConfig, accordionItemProps, lang, children}) => {
    const state = useSelector(state => ({
        mode: state.contenteditor.picker.mode,
        modes: state.contenteditor.picker.modes,
        preSearchModeMemo: state.contenteditor.picker.preSearchModeMemo,
        path: state.contenteditor.picker.path,
        openPaths: state.contenteditor.picker.openPaths,
        site: state.contenteditor.picker.site,
        viewType: state.contenteditor.picker.tableView.viewType
    }), shallowEqual);

    const dispatch = useDispatch();
    const uilang = useSelector(state => state.uilang);

    const currentFolderInfo = useNodeInfo({path: state.path}, {skip: !state.path});
    const paths = (Array.isArray(initialSelectedItem) ? initialSelectedItem : [initialSelectedItem]).filter(f => f);
    let accordion;
    if (state.mode === '') {
        accordion = registry.find({type: 'accordionItem', target: pickerConfig.key})[0];
    } else if (state.mode === Constants.mode.SEARCH) {
        accordion = registry.get('accordionItem', state.preSearchModeMemo);
    } else {
        accordion = registry.get('accordionItem', state.mode);
    }

    accordion = jcontentUtils.getAccordionItem(accordion, accordionItemProps);

    const fragments = [...(accordion?.tableConfig?.queryHandler?.getFragments() || []), ...(accordion?.tableConfig?.fragments || [])];
    const selectionQuery = replaceFragmentsInDocument(GET_PICKER_NODE, fragments);
    const nodesInfo = useQuery(selectionQuery, {
        variables: {
            paths: paths,
            language: lang,
            uilang: uilang,
            selectableTypesTable: pickerConfig.selectableTypesTable
        }
    });

    useEffect(() => {
        if (nodesInfo.data) {
            dispatch(cePickerSetSelection(nodesInfo.data.jcr.nodesByPath.map(n => n.uuid)));
        }
    }, [nodesInfo.data, dispatch]);

    const previousState = useRef(state);
    useEffect(() => {
        if (currentFolderInfo.loading || nodesInfo.loading || state.mode === Constants.mode.SEARCH) {
            return;
        }

        const newState = {...state, isOpen: true};

        const selectedNode = nodesInfo.data && nodesInfo.data.jcr.nodesByPath.length > 0 && nodesInfo.data.jcr.nodesByPath[0];

        const allAccordionItems = jcontentUtils.getAccordionItems(pickerConfig.key, accordionItemProps);

        const valid = accord =>
            (!accord.isEnabled || accord.isEnabled(newState.site)) &&
            (!accord.canDisplayItem || !selectedNode || previousState.current.isOpen || accord.canDisplayItem({selectionNode: selectedNode}));

        const firstMatchingAccordion = allAccordionItems.find(accord => (accord.key === accordion.key) && valid(accord)) ||
            allAccordionItems.find(accord => valid(accord)) ||
            allAccordionItems[0];

        if (!previousState.current.isOpen) {
            newState.site = site;
        }

        // If selection exists we don't care about previous state, need to update state in accordance with selection
        // Initialize site when opening dialog
        if (selectedNode && !previousState.current.isOpen) {
            // If an item is selected, preselect site/mode/path
            newState.site = getSite(selectedNode.path);
            newState.mode = firstMatchingAccordion.key;
            if (firstMatchingAccordion.getPathForItem) {
                // Todo: Must implement something for pages accordion, where the selected path is not the direct parent
                newState.path = firstMatchingAccordion.getPathForItem(selectedNode);
            } else {
                newState.path = firstMatchingAccordion.getRootPath(newState.site);
            }

            if (firstMatchingAccordion.getViewTypeForItem) {
                newState.viewType = firstMatchingAccordion.getViewTypeForItem(selectedNode);
            }
        } else if (!currentFolderInfo.node || state.path.startsWith(currentFolderInfo.node.path)) {
            if (firstMatchingAccordion.tableConfig.defaultViewType && !previousState.current.isOpen) {
                newState.viewType = firstMatchingAccordion.tableConfig.defaultViewType;
            }

            newState.mode = firstMatchingAccordion.key;
            const rootPath = firstMatchingAccordion.getRootPath(newState.site);

            // If picker default path does not target any site use it
            if ((!currentFolderInfo.node) ||
                (firstMatchingAccordion.canDisplayItem && !firstMatchingAccordion.canDisplayItem({folderNode: currentFolderInfo.node})) ||
                (!newState.path.startsWith(rootPath)) ||
                (!jcontentUtils.booleanValue(pickerConfig.pickerDialog.displayTree))
            ) {
                newState.path = rootPath;
            }
        }

        const accordionItems = allAccordionItems
            .filter(accordionItem => !accordionItem.isEnabled || accordionItem.isEnabled(newState.site));
        newState.modes = accordionItems.map(item => item.key);

        newState.openPaths = [...new Set([...newState.openPaths, ...getDetailedPathArray(getPathWithoutFile(newState.path), newState.site)])];
        if (selectedNode && !previousState.current.isOpen) {
            newState.openPaths = [...new Set([...newState.openPaths, ...getDetailedPathArray(getPathWithoutFile(selectedNode.path), newState.site)])];
        }

        if (previousState.current.mode !== newState.mode && firstMatchingAccordion.tableConfig.defaultSort) {
            newState.sort = firstMatchingAccordion.tableConfig.defaultSort;
        }

        const actions = ([
            (newState.site !== state.site) && cePickerSite(newState.site),
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
    }, [dispatch, site, pickerConfig, state, nodesInfo, currentFolderInfo, accordion.key, accordionItemProps]);

    if (currentFolderInfo.loading || nodesInfo.loading) {
        return <LoaderOverlay/>;
    }

    return children;
};

SelectionHandler.propTypes = {
    initialSelectedItem: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    site: PropTypes.string.isRequired,
    pickerConfig: configPropType.isRequired,
    accordionItemProps: PropTypes.object,
    lang: PropTypes.string,
    children: PropTypes.node
};
