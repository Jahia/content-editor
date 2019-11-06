import React from 'react';
import {withApollo} from 'react-apollo';

let Component = withApollo(props => props.children(props.client));

let withApolloAction = {
    init: (context, props) => {
        context.client = props.client;
    },

    wrappers: [
        component => <Component>{client => React.cloneElement(component, {client})}</Component>
    ]
};

export {withApolloAction};
