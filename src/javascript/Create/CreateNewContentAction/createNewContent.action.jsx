import React from 'react';
import {CreateNewContentDialog} from './CreateNewContentDialog';
import {componentRendererAction, composeActions} from '@jahia/react-material';
import {reduxAction} from '../../actions/redux.action';
import {Constants} from '~/ContentEditor.constants';
import {cmGoto} from '../../ContentManager.redux-actions';
import {withApolloAction} from './withApolloAction';
import {from} from 'rxjs';
import {getActions} from './createNewContent.utits';

const mapDispatchToProps = dispatch => ({
    gotToCE: gotoParams => dispatch(cmGoto(gotoParams))
});

const mapStateToProps = state => {
    return {
        uiLang: state.uiLang,
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
            const variables = {
                uiLang: context.uiLang,
                path: context.path,
                excludedNodeTypes: ['jmix:studioOnly', 'jmix:hiddenType']
            };
            context.actions = from(getActions(context, variables));
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
                        uiLang={context.uiLang}
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

