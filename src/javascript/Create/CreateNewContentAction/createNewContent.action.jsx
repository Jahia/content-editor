import React from 'react';
import {CreateNewContentDialog} from './CreateNewContentDialog';
import {componentRendererAction, composeActions} from '@jahia/react-material';
import {reduxAction} from '../../actions/redux.action';
import {Constants} from '~/ContentEditor.constants';
import {cmGoto} from '~/JContent.redux-actions';
import {withApolloAction} from './withApolloAction';
import {from} from 'rxjs';
import {share} from 'rxjs/operators';
import {transformNodeTypesToActions, getCreatableNodetypes} from './createNewContent.utits';

// Should continue to use redux here, because this action is used to replace JContent create action, so it's only displayed in JContent
const mapDispatchToProps = dispatch => ({
    gotToCE: gotoParams => dispatch(cmGoto(gotoParams))
});

const mapStateToProps = state => {
    return {
        uilang: state.uilang,
        language: state.language,
        siteKey: state.site
    };
};

export default composeActions(
    componentRendererAction,
    withApolloAction,
    reduxAction(mapStateToProps, mapDispatchToProps),
    {
        init: context => {
            const creatableNodeTypesActions = from(
                getCreatableNodetypes(
                    context.client,
                    undefined,
                    false,
                    context.path,
                    context.uilang,
                    ['jmix:studioOnly', 'jmix:hiddenType'],
                    context.showOnNodeTypes,
                    transformNodeTypesToActions)
            ).pipe(share());
            context.actions = creatableNodeTypesActions;
            context.enabled = creatableNodeTypesActions;
        },
        onClick: context => {
            if (context.openEditor) {
                context.gotToCE({
                    site: context.siteKey,
                    language: context.language,
                    mode: Constants.routes.baseCreateRoute,
                    path: context.path,
                    params: {
                        contentType: context.nodeTypes[0]
                    }
                });
            } else {
                let handler = context.renderComponent(
                    <CreateNewContentDialog
                        open
                        parentPath={context.path}
                        uilang={context.uilang}
                        onClose={() => {
                            handler.setProps({open: false});
                        }}
                        onExited={() => {
                            handler.destroy();
                        }}
                        onCreateContent={contentType => {
                            context.gotToCE({
                                site: context.siteKey,
                                language: context.language,
                                mode: Constants.routes.baseCreateRoute,
                                path: context.path,
                                params: {
                                    contentType: contentType.name
                                }
                            });
                            handler.setProps({open: false});
                        }}
                    />);
            }
        }
    });
