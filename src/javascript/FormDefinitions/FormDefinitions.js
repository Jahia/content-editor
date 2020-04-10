import {useQuery} from '@apollo/react-hooks';

export const useFormDefinition = (query, queryParams, adapter, t) => {
    const {loading, error, data, refetch} = useQuery(query, {
        variables: queryParams,
        fetchPolicy: 'cache-and-network'
    });

    if (error || loading || !data.jcr) {
        return {
            loading,
            error,
            errorMessage: error && t('content-media-manager:label.contentManager.error.queryingContent', {details: (error.message ? error.message : '')})
        };
    }

    return {data: adapter(data, queryParams.uilang, t), refetch};
};
