import React, {useCallback, useContext, useState} from 'react';
import {useNotifications} from '@jahia/react-material';
import {useSiteInfo} from '@jahia/data-helper';
import * as PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {ApolloCacheFlushOnGWTSave} from './ApolloCacheFlushOnGWTSave';
import {ContentEditorSectionContextProvider} from '../ContentEditorSection';
import {useContentEditorConfigContext} from '../ContentEditorConfig';
import {shallowEqual, useSelector} from 'react-redux';
import {LoaderOverlay} from '~/DesignSystem/LoaderOverlay';
import {CeModalError} from '~/ContentEditorApi/ContentEditorError';

export const ContentEditorContext = React.createContext({});

export const useContentEditorContext = () => useContext(ContentEditorContext);

export const ContentEditorContextProvider = ({useFormDefinition, children}) => {
    const notificationContext = useNotifications();
    const {t} = useTranslation('content-editor');
    const [errors, setErrors] = useState(null);
    const contentEditorConfigContext = useContentEditorConfigContext();
    // Get information from page composer to display the preview.
    const {pageComposerCurrentPage, pageComposerActive} = useSelector(state => ({
        pageComposerCurrentPage: state.pagecomposer.currentPage,
        pageComposerActive: state.pagecomposer.active
    }), shallowEqual);
    const [i18nContext, setI18nContext] = useState({
        memo: {
            count: 1
        }
    });

    // Persist 'create another' chekbox state during language switch
    const createAnotherState = useState(false);
    const createAnother = {
        value: createAnotherState[0], set: createAnotherState[1]
    };

    const resetI18nContext = useCallback(() => {
        setI18nContext(prev => ({
            memo: {
                count: (prev.memo?.count || 0) + 1
            }
        }));
    }, [setI18nContext]);

    const {lang, mode, name} = contentEditorConfigContext;

    // Get user navigator locale preference
    const browserLang = navigator.language;

    const {
        loading,
        error,
        data: formDefinition,
        refetch: refetchFormData
    } = useFormDefinition();

    const {
        nodeData,
        expandedSections,
        initialValues,
        hasPreview,
        details,
        technicalInfo,
        sections,
        title,
        nodeTypeName,
        nodeTypeDisplayName
    } = formDefinition || {};

    const site = nodeData?.site?.name || 'systemsite';

    const siteInfoResult = useSiteInfo({
        siteKey: site,
        displayLanguage: lang
    });

    if (error) {
        // Check for ItemNotFound exception
        const is404 = (error.graphQLErrors || []).some(e => e.message?.includes('ItemNotFoundException'));
        if (is404) {
            throw new CeModalError('ItemNotFoundException', {cause: error});
        }
    }

    if (siteInfoResult.error) {
        console.error('Error when fetching data: ' + siteInfoResult.error);
        let message = t('label.contentEditor.error.queryingContent', {details: (siteInfoResult.error.message ? siteInfoResult.error.message : '')});
        notificationContext.notify(message, ['closeButton', 'noAutomaticClose']);
        return null;
    }

    if (loading || siteInfoResult.loading) {
        return <LoaderOverlay/>;
    }

    // Don't use full page rendering for folders.
    const isFullPage = nodeData.displayableNode && !nodeData.displayableNode.isFolder;
    // Set main resource path, currently used by preview:
    //  - path: path to display
    //  - template: view or template to use
    //  - templatetype: extension to use
    //  - config: page if content can be displayed as full page or module
    const currentPage = pageComposerActive ? pageComposerCurrentPage :
        {
            path: (isFullPage && nodeData.displayableNode.path) || nodeData.path,
            template: nodeData.displayableNode ? 'default' : 'cm',
            templateType: '.html'
        };
    currentPage.config = isFullPage ? 'page' : 'module';

    // Build editor context
    const editorContext = {
        path: nodeData.path,
        currentPage,
        lang,
        browserLang,
        site,
        mode,
        name,
        siteInfo: {
            ...siteInfoResult.siteInfo,
            languages: siteInfoResult.siteInfo.languages.filter(language => language.activeInEdit)
        },
        nodeData,
        details,
        technicalInfo,
        initialValues,
        expandedSections,
        hasPreview,
        title,
        nodeTypeName,
        nodeTypeDisplayName,
        refetchFormData,
        errors,
        setErrors,
        i18nContext,
        setI18nContext,
        resetI18nContext,
        createAnother
    };

    return (
        <ContentEditorContext.Provider value={editorContext}>
            <ContentEditorSectionContextProvider formSections={JSON.parse(JSON.stringify(sections))}>
                <ApolloCacheFlushOnGWTSave/>
                {children}
            </ContentEditorSectionContextProvider>
        </ContentEditorContext.Provider>
    );
};

ContentEditorContextProvider.propTypes = {
    useFormDefinition: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
};

export default ContentEditorContextProvider;
