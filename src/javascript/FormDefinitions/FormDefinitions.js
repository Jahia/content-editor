import {useQuery} from '@apollo/react-hooks';
import {useMemo} from 'react';

export const useFormDefinition = (query, queryParams, adapter, t, contentEditorConfigContext) => {
    const {loading, error, data, refetch} = useQuery(query, {
        variables: queryParams,
        fetchPolicy: 'network-only'
    });

    const dataCached = useMemo(() => {
        if (!error && !loading && data.jcr) {
            return adapter(data, queryParams.uilang, t, contentEditorConfigContext);
        }
    }, [data, queryParams.uilang, t, contentEditorConfigContext, error, loading]);

    if (error || loading || !data.jcr) {
        return {
            loading,
            error,
            errorMessage: error && t('content-editor:label.contentEditor.error.queryingContent', {details: (error.message ? error.message : '')})
        };
    }

    return {data: dataCached, refetch};
};
