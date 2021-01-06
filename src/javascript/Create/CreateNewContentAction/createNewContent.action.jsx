import React, {useContext} from 'react';
import {CreateNewContentDialog} from './CreateNewContentDialog';
import {Constants} from '~/ContentEditor.constants';
import {transformNodeTypesToActions, useCreatableNodetypes} from './createNewContent.utits';
import {useSelector} from 'react-redux';
import {useNodeChecks, useNodeInfo} from '@jahia/data-helper';
import {ComponentRendererContext} from '@jahia/ui-extender';
import * as PropTypes from 'prop-types';
import {useContentEditorHistory} from '~/ContentEditorHistory';
import {useTranslation} from 'react-i18next';

// eslint-disable-next-line
const onClick = (uuid, language, context, redirect, componentRenderer) => {
    if (context.openEditor) {
        redirect({mode: Constants.routes.baseCreateRoute, language, uuid, rest: encodeURI(context.nodeTypes[0])});
    } else {
        const closeDialog = () => {
            componentRenderer.destroy('CreateNewContentDialog');
        };

        componentRenderer.render(
            'CreateNewContentDialog',
            CreateNewContentDialog,
            {
                open: true,
                parentPath: context.path,
                uilang: context.uilang,
                onClose: closeDialog,
                onExited: closeDialog,
                onCreateContent: contentType => {
                    redirect({
                        mode: Constants.routes.baseCreateRoute,
                        language,
                        uuid,
                        rest: encodeURI(contentType.name)
                    });
                    closeDialog();
                }
            });
    }
};

const CreateNewContent = ({contextNodePath, path, showOnNodeTypes, render: Render, loading: Loading, ...otherProps}) => {
    const {redirect} = useContentEditorHistory();
    const {t} = useTranslation('content-editor');
    const componentRenderer = useContext(ComponentRendererContext);
    const {uilang, language} = useSelector(state => ({language: state.language, uilang: state.uilang}));

    const res = useNodeChecks(
        {path: contextNodePath || path, language: language},
        {...otherProps}
    );

    const nodeInfo = useNodeInfo({path: path, language}, {getPrimaryNodeType: true});

    const {loadingTypes, error, nodetypes} = useCreatableNodetypes(
        undefined,
        undefined,
        false,
        contextNodePath || path,
        uilang,
        ['jmix:studioOnly', 'jmix:hiddenType'],
        showOnNodeTypes,
        transformNodeTypesToActions);

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

    if (!res || !res.node || (nodetypes && nodetypes.length === 0)) {
        return <Render {...otherProps} isVisible={false} onClick={() => {}}/>;
    }

    return (nodetypes || [{id: 'allTypes'}]).map(result => (
        <Render {...otherProps}
                {...result}
                key={result.id}
                path={path}
                uilang={uilang}
                isVisible={res.checksResult}
                onClick={ctx => onClick(nodeInfo.node.uuid, language, ctx, redirect, componentRenderer)}/>
    ));
};

CreateNewContent.defaultProps = {
    contextNodePath: undefined,
    loading: undefined
};

CreateNewContent.propTypes = {
    contextNodePath: PropTypes.string,
    path: PropTypes.string.isRequired,
    showOnNodeTypes: PropTypes.array,
    render: PropTypes.func.isRequired,
    loading: PropTypes.func
};

const createNewContentAction = {
    component: CreateNewContent
};

export default createNewContentAction;
