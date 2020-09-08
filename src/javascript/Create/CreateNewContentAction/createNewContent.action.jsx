import React, {useContext} from 'react';
import {CreateNewContentDialog} from './CreateNewContentDialog';
import {Constants} from '~/ContentEditor.constants';
import {transformNodeTypesToActions, useCreatableNodetypes} from './createNewContent.utits';
import {useSelector} from 'react-redux';
import {useNodeChecks} from '@jahia/data-helper';
import {ComponentRendererContext, registry} from '@jahia/ui-extender';
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
                open,
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

const CreateNewContent = ({context, render: Render, loading: Loading}) => {
    const {redirect} = useContentEditorHistory();
    const {t} = useTranslation();
    const componentRenderer = useContext(ComponentRendererContext);
    const {uilang, language} = useSelector(state => ({language: state.language, uilang: state.uilang}));

    const resTargetPath = useNodeChecks(
        {path: context.path, language: language},
        {...context}
    );

    if (context.targetPath) {
        registry.addOrReplace('globalLinkContext', 'contextData', {uuid: resTargetPath?.node?.uuid});
    }

    const res = useNodeChecks(
        {path: context.targetPath || context.path, language: language},
        {...context}
    );
    const {loadingTypes, error, nodetypes} = useCreatableNodetypes(
        undefined,
        undefined,
        false,
        context.targetPath || context.path,
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
        console.error(message);
        return <Render context={{...context, isVisible: false}}/>;
    }

    if (!res || !res.node || (nodetypes && nodetypes.length === 0)) {
        return <Render context={{...context, isVisible: false}}/>;
    }

    return (nodetypes || [{id: 'allTypes'}]).map(result => (
        <Render key={result.id}
                context={{
                    ...context,
                    ...result,
                    isVisible: res.checksResult,
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
