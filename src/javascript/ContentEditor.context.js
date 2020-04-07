import React, {useContext, useState} from 'react';
import {ProgressOverlay, withNotifications} from '@jahia/react-material';
import {useFormDefinition} from '~/FormDefinitions';
import {useSiteInfo} from '@jahia/data-helper';
import * as PropTypes from 'prop-types';
import {Constants} from './ContentEditor.constants';
import {useTranslation} from 'react-i18next';
import {compose} from '~/utils';

export const ContentEditorContext = React.createContext({});

export const useContentEditorContext = () => useContext(ContentEditorContext);

export const ContentEditorConfigContext = React.createContext({});

export const useContentEditorConfigContext = () => useContext(ContentEditorConfigContext);

export const withContentEditorDataContextProvider = (formQuery, formDataAdapter) => Children => {
    const ContentEditorDataContextProvider = props => {
        const {notificationContext} = props;
        const {t} = useTranslation();
        const {lang, uilang, site, uuid, contentType, mode} = useContentEditorConfigContext();
        const [previousLocation, setPreviousLocation] = useState(undefined);

        // Get Data
        const formQueryParams = {
            uuid,
            language: lang,
            uilang: Constants.supportedLocales.includes(uilang) ? uilang : Constants.defaultLocale,
            primaryNodeType: contentType
        };
        const {loading, error, errorMessage, nodeData, initialValues, details, technicalInfo, sections, title, nodeTypeName} = useFormDefinition(formQuery, formQueryParams, formDataAdapter, t);
        const siteInfoResult = useSiteInfo({
            siteKey: site,
            displayLanguage: lang
        });

        if (error) {
            console.error(error);
            return <>{errorMessage}</>;
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

        // Build editor context
        const editorContext = {
            path: nodeData.path,
            lang,
            uilang,
            site,
            mode,
            siteInfo: {...siteInfoResult.siteInfo,
                languages: siteInfoResult.siteInfo.languages.filter(language => language.activeInEdit)
            },
            sections,
            nodeData,
            details,
            technicalInfo,
            initialValues,
            title,
            formQueryParams,
            previousLocation,
            setPreviousLocation,
            nodeTypeName
        };

        return (
            <ContentEditorContext.Provider value={editorContext}>
                <Children {...props}/>
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
