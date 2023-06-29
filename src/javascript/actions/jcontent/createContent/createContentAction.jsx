import React from 'react';
import {
    childrenLimitReachedOrExceeded,
    flattenNodeTypes,
    transformNodeTypesToActions,
    useCreatableNodetypesTree
} from './createContent.utils';
import {useSelector} from 'react-redux';
import {useNodeChecks, useNodeInfo} from '@jahia/data-helper';
import * as PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {useContentEditorApiContext} from '~/contexts/ContentEditorApi/ContentEditorApi.context';

export const CreateContent = ({contextNodePath, path, showOnNodeTypes, nodeTypes, name, includeSubTypes, isFullscreen, hasBypassChildrenLimit, onCreate, onClosed, render: Render, loading: Loading, ...otherProps}) => {
    const api = useContentEditorApiContext();
    const {t} = useTranslation('content-editor');
    const {language, uilang} = useSelector(state => ({language: state.language, uilang: state.uilang}));

    const res = useNodeChecks(
        {path: contextNodePath || path, language: language},
        {...otherProps, getLockInfo: true}
    );

    const nodeInfo = useNodeInfo(
        {path: path, language},
        {
            getPrimaryNodeType: true,
            getSubNodesCount: true,
            getIsNodeTypes: ['jmix:listSizeLimit'],
            getProperties: ['limit']
        }
    );
    const excludedNodeTypes = ['jmix:studioOnly', 'jmix:hiddenType'];
    const {loadingTypes, error, nodetypes: nodeTypesTree} = useCreatableNodetypesTree(
        nodeTypes,
        name,
        includeSubTypes || false,
        contextNodePath || path,
        uilang,
        excludedNodeTypes,
        showOnNodeTypes
    );

    if (Loading && (loadingTypes || res.loading || nodeInfo.loading)) {
        return <Loading {...otherProps}/>;
    }

    if (error) {
        const message = t(
            'content-editor:label.contentEditor.error.queryingContent',
            {details: error.message ? error.message : ''}
        );
        console.error(message);
        return <Render {...otherProps} isVisible={false} onClick={() => {}}/>;
    }

    if (!res || !res.node || (nodeTypesTree && nodeTypesTree.length === 0) || childrenLimitReachedOrExceeded(nodeInfo?.node)) {
        return <Render {...otherProps} isVisible={false} onClick={() => {}}/>;
    }

    const flattenedNodeTypes = flattenNodeTypes(nodeTypesTree);
    const actions = transformNodeTypesToActions(flattenedNodeTypes, hasBypassChildrenLimit);

    const onClick = ({nodeTypesTree}) => {
        api.create({uuid: nodeInfo.node.uuid, path, lang: language, nodeTypesTree, name, isFullscreen, createCallback: onCreate, onClosedCallback: onClosed});
    };

    return (actions || [{key: 'allTypes', nodeTypeIcon: otherProps.defaultIcon}]).map(result => (
        <Render
            key={result.key}
            enabled={!res.node?.lockOwner}
            buttonIcon={result.nodeTypeIcon || otherProps.defaultIcon}
            {...otherProps}
            flattenedNodeTypes={flattenedNodeTypes}
            nodeTypesTree={nodeTypesTree}
            path={path}
            uilang={uilang}
            isVisible={res.checksResult}
            isAllTypes={result.key === 'allTypes'}
            {...result}
            onClick={onClick}
        />
    ));
};

CreateContent.defaultProps = {
    contextNodePath: undefined,
    loading: undefined
};

CreateContent.propTypes = {
    contextNodePath: PropTypes.string,
    path: PropTypes.string.isRequired,
    isFullscreen: PropTypes.bool,
    showOnNodeTypes: PropTypes.array,
    nodeTypes: PropTypes.array,
    name: PropTypes.string,
    includeSubTypes: PropTypes.bool,
    render: PropTypes.func.isRequired,
    onCreate: PropTypes.func,
    onClosed: PropTypes.func,
    loading: PropTypes.func,
    hasBypassChildrenLimit: PropTypes.bool
};

export const createContentAction = {
    component: CreateContent
};
