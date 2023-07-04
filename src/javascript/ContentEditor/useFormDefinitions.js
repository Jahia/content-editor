import {useQuery} from '@apollo/react-hooks';
import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {useContentEditorConfigContext} from '~/contexts';
import {Constants} from '~/ContentEditor.constants';
import {useSelector} from 'react-redux';

export const useFormDefinition = (query, adapter) => {
    const {t} = useTranslation();
    const contentEditorConfigContext = useContentEditorConfigContext();
    const {lang, uuid, contentType} = contentEditorConfigContext;
    const uilang = useSelector(state => state.uilang);

    // Get Data
    const formQueryParams = {
        uuid,
        language: lang,
        uilang,
        primaryNodeType: contentType,
        writePermission: `jcr:modifyProperties_default_${lang}`,
        childrenFilterTypes: Constants.childrenFilterTypes
    };

    const {loading, error, data, refetch} = useQuery(query, {
        variables: formQueryParams,
        fetchPolicy: 'network-only',
        errorPolicy: 'all'
    });

    const dataCached = useMemo(() => {
        if (!error && !loading && data?.jcr) {
            return adapter(data, uilang, t, contentEditorConfigContext);
        }
    }, [data, uilang, t, contentEditorConfigContext, error, loading, adapter]);

    if (error || loading || !data?.jcr) {
        return {
            loading,
            error,
            errorMessage: error && t('content-editor:label.contentEditor.error.queryingContent', {details: (error.message ? error.message : '')})
        };
    }

    return {data: dataCached, refetch};
};
