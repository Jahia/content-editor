import React from 'react';
import {LockedEditorContext} from '~/Lock/LockedEditor.context';

let withLockedEditorContextAction = {
    init: (context, props) => {
        context.lockedEditorContext = props.lockedEditorContext;
    },

    wrappers: [
        component => <LockedEditorContext.Consumer>{lockedEditorContext => React.cloneElement(component, {lockedEditorContext})}</LockedEditorContext.Consumer>
    ]
};

export {withLockedEditorContextAction};
