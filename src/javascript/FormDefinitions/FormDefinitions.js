import {useQuery} from '@apollo/react-hooks';

export const useFormDefinition = (setSections, query, queryParams, adapter, t) => {
    const {loading, error, data, refetch} = useQuery(query, {
        variables: queryParams,
        fetchPolicy: 'network-only'
    });
    console.log('trigger data load!!');
    setSections([]);
    if (error || loading || !data.jcr) {
        return {
            loading,
            error,
            errorMessage: error && t('content-media-manager:label.contentManager.error.queryingContent', {details: (error.message ? error.message : '')})
        };
    }
    console.log('data loaded');
    return {data: adapter(data, queryParams.uilang, t), refetch};
};
