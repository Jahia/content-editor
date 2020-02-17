import React from 'react';
import {ContentEditorConfigContext} from '~/ContentEditor.context';

let withContentEditorConfigContextAction = {
    init: (context, props) => {
        context.contentEditorConfigContext = props.contentEditorConfigContext;
    },

    wrappers: [
        component => <ContentEditorConfigContext.Consumer>{contentEditorConfigContext => React.cloneElement(component, {contentEditorConfigContext})}</ContentEditorConfigContext.Consumer>
    ]
};

export {withContentEditorConfigContextAction};
