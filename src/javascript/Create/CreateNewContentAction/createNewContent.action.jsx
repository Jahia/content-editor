import React from 'react';
import {CreateNewContentDialog} from './CreateNewContentDialog';
import {composeActions, componentRendererAction} from '@jahia/react-material';
import {reduxAction} from '../../actions/redux.action';
import {Constants} from '~/ContentEditor.constants';
import {cmGoto} from '../../ContentManager.redux-actions';

const mapDispatchToProps = dispatch => ({
    gotToCE: gotoParams => dispatch(cmGoto(gotoParams))
});

const mapStateToProps = state => {
    return {
        uiLang: state.uiLang
    };
};

export default composeActions(
    componentRendererAction,
    reduxAction(mapStateToProps, mapDispatchToProps),
    {
        init: context => {
            context.enabled = context.path.startsWith(`/sites/${contextJsParameters.siteKey}/contents`);
        },
        onClick: context => {
            let handler = context.renderComponent(
                <CreateNewContentDialog
                    open
                    uiLang={context.uiLang}
                    onClose={() => {
                        handler.setProps({open: false});
                    }}
                    onExited={() => {
                        handler.destroy();
                    }}
                    onCreateContent={contentType => {
                        context.gotToCE({
                            site: contextJsParameters.siteKey,
                            language: contextJsParameters.lang,
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
);
