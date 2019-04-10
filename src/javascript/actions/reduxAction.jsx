// TODO: This file should be removed
// We should use/get the action from CMM directly
// The task was created: https://jira.jahia.org/browse/QA-11544

import React from 'react';
import {connect} from 'react-redux';

let count = 0;
let reduxAction = (mapStateToProps, mapDispatchToProps) => {
    let Component = connect(mapStateToProps, mapDispatchToProps)(props => {
        const {children, context, ...rest} = props;
        return props.children(rest);
    });
    let id = 'reduxProps' + (count++);
    return {
        init(context, props) {
            context = {
                ...context,
                ...props[id]
            };
        },

        wrappers: [
            component => <Component>{reduxProps => React.cloneElement(component, {[id]: reduxProps})}</Component>
        ]
    };
};

export {reduxAction};
