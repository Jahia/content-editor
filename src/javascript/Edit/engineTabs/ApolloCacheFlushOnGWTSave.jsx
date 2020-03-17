import * as PropTypes from 'prop-types';
import React, {useEffect} from 'react';
import {withApollo} from 'react-apollo';

const ApolloCacheFlushOnGWTSaveCmp = ({client}) => {
    useEffect(() => {
        // Register flush on GWT save
        window.contentModificationEventHandlers = window.contentModificationEventHandlers || [];
        var length = window.contentModificationEventHandlers.push(nodeUuid => {
            client.cache.flushNodeEntryById(nodeUuid);
        });

        // Unregister flush on GWT save at unload
        return () => {
            window.contentModificationEventHandlers.splice(length - 1, 1);
        };
    });

    return <></>;
};

ApolloCacheFlushOnGWTSaveCmp.propTypes = {
    client: PropTypes.object.isRequired
};

export const ApolloCacheFlushOnGWTSave = withApollo(ApolloCacheFlushOnGWTSaveCmp);
ApolloCacheFlushOnGWTSave.displayName = 'ApolloCacheFlushOnGWTSave';
export default ApolloCacheFlushOnGWTSave;
