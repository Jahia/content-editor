import {useQuery} from '@apollo/react-hooks';

export const useFormDefinition = (query, queryParams, adapter, t, contentEditorConfigContext) => {
    const {loading, error, data, refetch} = useQuery(query, {
        variables: queryParams,
        fetchPolicy: 'network-only'
    });

    if (error || loading || !data.jcr) {
        return {
            loading,
            error,
            errorMessage: error && t('content-media-manager:label.contentManager.error.queryingContent', {details: (error.message ? error.message : '')})
        };
    }

    return {data: adapter(data, queryParams.uilang, t, contentEditorConfigContext), refetch};
};
