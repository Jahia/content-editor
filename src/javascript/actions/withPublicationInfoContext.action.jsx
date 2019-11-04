import React from 'react';
import {PublicationInfoContext} from '../PublicationInfo/PublicationInfo.context';

let withPublicationInfoContextAction = {
    init: (context, props) => {
        context.publicationInfoContext = props.publicationInfoContext;
    },

    wrappers: [
        component => <PublicationInfoContext.Consumer>{publicationInfoContext => React.cloneElement(component, {publicationInfoContext})}</PublicationInfoContext.Consumer>
    ]
};

export {withPublicationInfoContextAction};
