import React, {useContext} from 'react';
import {CreateNewContentDialog} from './CreateNewContentDialog';
import {Constants} from '~/ContentEditor.constants';
import {transformNodeTypesToActions, useCreatableNodetypes} from './createNewContent.utits';
import {useSelector} from 'react-redux';
import {useNodeInfo} from '@jahia/data-helper';
import {ComponentRendererContext} from '@jahia/ui-extender';
import * as PropTypes from 'prop-types';
import {useContentEditorHistory} from '~/ContentEditorHistory';
import {useTranslation} from 'react-i18next';

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
                open,
                parentPath: context.path,
                uilang: context.uilang,
                onClose: closeDialog,
                onExited: closeDialog,
                onCreateContent: contentType => {
                    redirect({mode: Constants.routes.baseCreateRoute, language, uuid, rest: encodeURI(contentType.name)});
                    closeDialog();
                }
            });
    }
};

const CreateNewContent = ({context, render: Render, loading: Loading}) => {
    const {redirect} = useContentEditorHistory();
    const {t} = useTranslation();
    const componentRenderer = useContext(ComponentRendererContext);
    const {language, uilang} = useSelector(state => ({language: state.language, uilang: state.uilang}));
    const res = useNodeInfo({path: context.path, language}, {getDisplayName: true});
    const {loadingTypes, error, nodetypes} = useCreatableNodetypes(
        undefined,
        false,
        context.path,
        uilang,
        ['jmix:studioOnly', 'jmix:hiddenType'],
        context.showOnNodeTypes,
        transformNodeTypesToActions);

    if (Loading && (loadingTypes || res.loading)) {
        return <Loading context={context}/>;
    }

    if (error) {
        const message = t(
            'content-media-manager:label.contentManager.error.queryingContent',
            {details: error.message ? error.message : ''}
        );
        return <>{message}</>;
    }

    if (!res || !res.node) {
        return <></>;
    }

    return (nodetypes || [{id: 'toto'}]).map(result => (
        <Render key={result.id}
                context={{
                    ...context,
                    ...result,
                    onClick: ctx => onClick(res.node.uuid, language, ctx, redirect, componentRenderer)
                }}/>
    ));
};

CreateNewContent.defaultProps = {
    loading: undefined
};

CreateNewContent.propTypes = {
    context: PropTypes.object.isRequired,
    render: PropTypes.func.isRequired,
    loading: PropTypes.func
};

const createNewContentAction = {
    component: CreateNewContent
};

export default createNewContentAction;
