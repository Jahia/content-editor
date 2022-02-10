import {useQuery} from '@apollo/react-hooks';
import {PublicationInfoQuery} from './PublicationInfo.gql-queries';
import {useEffect, useState} from 'react';

export const usePublicationInfo = (queryParams, t) => {
    const [polling, setPolling] = useState(false);
    const {loading, error, data, refetch} = useQuery(PublicationInfoQuery, {
        variables: queryParams,
        fetchPolicy: 'network-only',
        pollInterval: polling ? 5000 : 0
    });

    // Refresh publication info when GWT do publication
    useEffect(() => {
        const index = window.authoringApi.pushEventHandlers.length;

        window.authoringApi.pushEventHandlers[index] = jobsData => {
            // Only refresh in case there is content unpublished or ended jobs
            if (jobsData && (jobsData.type === 'contentUnpublished' || (jobsData.endedJobs && jobsData.endedJobs.length > 0))) {
                refetch();
            }
        };

        return () => {
            window.authoringApi.pushEventHandlers.splice(index, 1);
        };
    }, [refetch]);

    if (error || loading || !data?.jcr) {
        return {
            publicationInfoPolling: polling,
            publicationInfoLoading: loading,
            publicationInfoError: error,
            publicationInfoErrorMessage: error && t('content-editor:label.contentEditor.error.queryingContent', {details: (error.message ? error.message : '')})
        };
    }

    return {
        publicationStatus: data.jcr.nodeById.aggregatedPublicationInfo.publicationStatus,
        lastModified: data.jcr.nodeById.lastModified?.value,
        lastModifiedBy: data.jcr.nodeById.lastModifiedBy?.value,
        lastPublished: data.jcr.nodeById.lastPublished?.value,
        lastPublishedBy: data.jcr.nodeById.lastPublishedBy?.value,
        publicationInfoPolling: polling,
        startPublicationInfoPolling: () => {
            setPolling(true);
        },
        stopPublicationInfoPolling: () => {
            setPolling(false);
        }
    };
};
