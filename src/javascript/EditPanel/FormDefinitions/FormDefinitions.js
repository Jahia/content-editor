import {useQuery} from 'react-apollo-hooks';
import {adaptFormData} from './FormData.adapter';

export const useFormDefinition = (query, queryParams, t) => {
    const {loading, error, data} = useQuery(query, {
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

    return adaptFormData(data, queryParams.uilang, t);
};
