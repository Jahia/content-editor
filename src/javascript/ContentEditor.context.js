import React, {useContext} from 'react';
import {ProgressOverlay, withNotifications} from '@jahia/react-material';
import {useFormDefinition} from '~/FormDefinitions';
import {useSiteInfo} from '@jahia/data-helper';
import * as PropTypes from 'prop-types';
import {Constants} from './ContentEditor.constants';
import {useTranslation} from 'react-i18next';
import {compose} from '~/utils';
import ApolloCacheFlushOnGWTSave from '~/Edit/engineTabs/ApolloCacheFlushOnGWTSave';
import {ContentEditorSectionContextProvider} from '~/ContentEditorSection/ContentEditorSection.context';
import {useSelector} from 'react-redux';

export const ContentEditorContext = React.createContext({});

export const useContentEditorContext = () => useContext(ContentEditorContext);

export const ContentEditorConfigContext = React.createContext({});

export const useContentEditorConfigContext = () => useContext(ContentEditorConfigContext);

export const withContentEditorDataContextProvider = (formQuery, formDataAdapter) => Children => {
    const ContentEditorDataContextProvider = props => {
        const {notificationContext} = props;
        const {t} = useTranslation('content-editor');
        const contentEditorConfigContext = useContentEditorConfigContext();
        // Get informations from page composer to display the preview.
        const {pageComposerCurrentPage, pageComposerActive} = useSelector(state => ({
            pageComposerCurrentPage: state.pagecomposer.currentPage,
            pageComposerActive: state.pagecomposer.active
        }));
        const {lang, uilang, site, uuid, contentType, mode, name} = contentEditorConfigContext;

        // Get user navigator locale preference
        const browserLang = navigator.language;

        // Get Data
        const formQueryParams = {
            uuid,
            language: lang,
            uilang: Constants.supportedLocales.includes(uilang) ? uilang : Constants.defaultLocale,
            primaryNodeType: contentType,
            writePermission: `jcr:modifyProperties_default_${lang}`,
            childrenFilterTypes: Constants.childrenFilterTypes
        };
        const {
            loading,
            error,
            data: formDefinition,
            refetch: refetchFormData
        } = useFormDefinition(formQuery, formQueryParams, formDataAdapter, t, contentEditorConfigContext);
        const {
            nodeData,
            initialValues,
            hasPreview,
            details,
            technicalInfo,
            sections,
            title,
            nodeTypeName,
            nodeTypeDisplayName
        } = formDefinition || {};
        const siteInfoResult = useSiteInfo({
            siteKey: site,
            displayLanguage: lang
        });

        if (error) {
            throw error;
        }

        if (siteInfoResult.error) {
            console.error('Error when fetching data: ' + siteInfoResult.error);
            let message = t('label.contentEditor.error.queryingContent', {details: (siteInfoResult.error.message ? siteInfoResult.error.message : '')});
            notificationContext.notify(message, ['closeButton', 'noAutomaticClose']);
            return null;
        }

        if (loading || siteInfoResult.loading) {
            return <ProgressOverlay/>;
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
            uilang,
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
            hasPreview,
            title,
            formQueryParams,
            nodeTypeName,
            nodeTypeDisplayName,
            refetchFormData
        };

        return (
            <ContentEditorContext.Provider value={editorContext}>
                <ContentEditorSectionContextProvider formSections={JSON.parse(JSON.stringify(sections))}>
                    <ApolloCacheFlushOnGWTSave/>
                    <Children {...props}/>
                </ContentEditorSectionContextProvider>
            </ContentEditorContext.Provider>
        );
    };

    ContentEditorDataContextProvider.propTypes = {
        notificationContext: PropTypes.object.isRequired
    };

    return compose(
        withNotifications()
    )(ContentEditorDataContextProvider);
};
