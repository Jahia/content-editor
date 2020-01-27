import React from 'react';
import PropTypes from 'prop-types';
import {DisplayAction} from '@jahia/ui-extender';

export class ContextualMenu extends React.Component {
    open(e) {
        this.ctx.onClick(this.ctx, e);
        e.stopPropagation();
        e.preventDefault();
    }

    render() {
        return (
            <DisplayAction actionKey={this.props.actionKey}
                           context={this.props.context}
                           render={({context}) => {
                               this.ctx = context;
                               return false;
                           }}/>
        );
    }
}

ContextualMenu.propTypes = {
    context: PropTypes.object.isRequired,
    actionKey: PropTypes.string.isRequired
};
