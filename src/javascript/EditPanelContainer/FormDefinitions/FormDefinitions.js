import {useQuery} from 'react-apollo-hooks';
import {FormQuery} from './FormDefinition.gql-queries';
import {adaptFormData} from './FormData.adapter';

export const useFormDefinition = (queryParams, t) => {
    const {loading, error, data} = useQuery(FormQuery, {
        variables: queryParams,
        fetchPolicy: 'cache-first'
    });

    if (error || loading) {
        return {
            loading,
            error,
            errorMessage: error && t('content-media-manager:label.contentManager.error.queryingContent', {details: (error.message ? error.message : '')})
        };
    }

    return adaptFormData(data);
};
