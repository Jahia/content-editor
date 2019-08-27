import React from 'react';
import {CreateNewContentDialog} from './CreateNewContentDialog';
import {composeActions, componentRendererAction} from '@jahia/react-material';
import {reduxAction} from '../redux.action';

const mapStateToProps = state => {
    return {
        uiLang: state.uiLang
    };
};

export default composeActions(
    componentRendererAction,
    reduxAction(mapStateToProps),
    {
        init: context => {
            context.enabled = context.path.startsWith(`/sites/${contextJsParameters.siteKey}/contents/`);
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
                />);
        }
    }
);
