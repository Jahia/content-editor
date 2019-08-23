import React from 'react';
import {CreateNewContentDialog} from './CreateNewContentDialog';
import {composeActions, componentRendererAction} from '@jahia/react-material';
import {reduxAction} from '../reduxAction';

const mapStateToProps = state => {
    return {
        uiLang: state.uiLang
    };
};

export default composeActions(
    componentRendererAction,
    reduxAction(mapStateToProps),
    {
        onClick: context => {
            context.renderComponent(<CreateNewContentDialog uiLang={context.uiLang}/>);
        }
    }
);
