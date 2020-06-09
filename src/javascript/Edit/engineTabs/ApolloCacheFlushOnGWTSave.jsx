import * as PropTypes from 'prop-types';
import React, {useEffect} from 'react';
import {withApollo} from 'react-apollo';
import {useContentEditorContext} from '~/ContentEditor.context';

const ApolloCacheFlushOnGWTSaveCmp = ({client}) => {
    const {refetchFormData} = useContentEditorContext();
    useEffect(() => {
        // Register flush on GWT save
        window.contentModificationEventHandlers = window.contentModificationEventHandlers || [];
        let handler = nodeUuid => {
            client.cache.flushNodeEntryById(nodeUuid);
            refetchFormData();
        };

        window.contentModificationEventHandlers.push(handler);

        // Unregister flush on GWT save at unload
        return () => {
            window.contentModificationEventHandlers.splice(window.contentModificationEventHandlers.indexOf(handler), 1);
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
