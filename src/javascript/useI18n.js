import {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';

export const useI18nCENamespace = () => {
    const {i18n} = useTranslation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        i18n.loadNamespaces('content-editor')
            .then(() => setLoading(false));
    }, [i18n]);

    return {loading};
};
