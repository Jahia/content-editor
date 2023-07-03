import {flattenNodeTypes, getCreatableNodetypesTree} from '~/actions/jcontent/createContent/createContent.utils';
import {Constants} from '~/ContentEditor.constants';
import {useCallback} from 'react';
import {useApolloClient} from '@apollo/react-hooks';
import {useSelector} from 'react-redux';

const create = async (setEditorConfig, setContentTypeSelectorConfig, client, data, uilang) => {
    const {
        path, name, nodeTypes, excludedNodeTypes, includeSubTypes, nodeTypesTree, ...editorConfig
    } = data;

    const resolvedCreatableNodeTypesTree = nodeTypesTree || await getCreatableNodetypesTree(
        client,
        nodeTypes,
        name,
        includeSubTypes,
        path,
        uilang,
        (excludedNodeTypes && excludedNodeTypes.length) > 0 ? excludedNodeTypes : ['jmix:studioOnly', 'jmix:hiddenType'],
        []
    );

    const flattenedNodeTypes = flattenNodeTypes(resolvedCreatableNodeTypesTree);

    // Only one type allowed, open directly CE
    if (flattenedNodeTypes.length === 1) {
        setEditorConfig({
            name,
            contentType: flattenedNodeTypes[0].name,
            mode: Constants.routes.baseCreateRoute,
            ...editorConfig
        });
    }

    // Multiple nodetypes allowed, open content type selector
    if (flattenedNodeTypes.length > 1) {
        setContentTypeSelectorConfig({
            nodeTypesTree: resolvedCreatableNodeTypesTree,
            includeSubTypes,
            name,
            path,
            editorConfig
        });
    }
};

export const useCreate = (setEditorConfig, setContentTypeSelectorConfig) => {
    const client = useApolloClient();
    const uilang = useSelector(state => state.uilang);

    /**
     * Open content type selection then content editor as a modal to create a new content
     * @param uuid of the parent node path where the content will be created
     * @param path of the parent node path where the content will be created
     * @param site the current site
     * @param lang the current lang from url
     * @param uilang deprecated
     * @param nodeTypes (optional) required in case you want to open CE directly for this content type,
     *                    if not specified: will try to resolve the content types available for creation
     *                    - in case of one content type resolved and includeSubTypes to false: open directly CE for this content type
     *                    - in case of multiple content types resolved: open content type selector
     * @param excludedNodeTypes (optional) The node types excluded for creation, by default: ['jmix:studioOnly', 'jmix:hiddenType']
     * @param includeSubTypes (optional) if true, subtypes of nodeTypes provided will be resolved.
     * @param name the name of the child node (only specified in case of named child node, null/undefined otherwise)
     * @param isFullscreen open editor in fullscreen
     */
    return useCallback(async (uuid, path, site, lang, _, nodeTypes, excludedNodeTypes, includeSubTypes, name, isFullscreen, createCallback, onClosedCallback) => {
        if (typeof uuid === 'object') {
            return create(setEditorConfig, setContentTypeSelectorConfig, client, uuid, uilang);
        }

        return create(setEditorConfig, setContentTypeSelectorConfig, client, {
            uuid, path, site, lang, nodeTypes, excludedNodeTypes, includeSubTypes, name, isFullscreen, createCallback, onClosedCallback
        });
    }, [uilang, client, setEditorConfig, setContentTypeSelectorConfig]);
};
