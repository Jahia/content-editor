import React, {useEffect} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {ContentEditor} from '~/ContentEditor';
import PropTypes from 'prop-types';
import {Constants} from '~/ContentEditor.constants';
import {useContentEditorHistory, useContentEditorHistoryContext} from '~/contexts';
import {useTranslation} from 'react-i18next';
import {replaceOpenedPath} from '~/redux/JContent.redux-actions';
import {registry} from '@jahia/ui-extender';
import {useQuery} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/data-helper';
import {useNotifications} from '@jahia/react-material';

export const ContentEditorRoute = ({mode, uuid, lang, contentType, name}) => {
    const notificationContext = useNotifications();
    const {redirect, hasHistory, exit, registerBlockListener, unRegisterBlockListener} = useContentEditorHistory();
    const {storedLocation, setStoredLocation} = useContentEditorHistoryContext();
    const {uilang, openPaths} = useSelector(state => ({uilang: state.uilang, openPaths: state.jcontent.openPaths}), shallowEqual);
    const dispatch = useDispatch();

    const {t} = useTranslation('content-editor');
    const {data} = useQuery(gql`query($uuid:String!) {
        jcr {
            nodeById(uuid: $uuid) {
                ...NodeCacheRequiredFields
                site {
                    ...NodeCacheRequiredFields
                    name
                }
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}`, {
        variables: {
            uuid
        }
    });

    const site = data && data.jcr.nodeById.site.name;

    // Sync GWT language
    useEffect(() => {
        window.overrideLang = lang;
        window.previousLang = window.jahiaGWTParameters.lang;
        if (window.authoringApi.switchLanguage) {
            window.authoringApi.switchLanguage(lang);
        }

        return () => {
            delete window.overrideLang;
            if (window.authoringApi.switchLanguage) {
                window.authoringApi.switchLanguage(window.previousLang);
            }
        };
    }, [lang]);

    const handleRename = ({originalNode, updatedNode}) => {
        if (originalNode.path !== updatedNode.path) {
            if (storedLocation && storedLocation.location) {
                if (openPaths) {
                    dispatch(replaceOpenedPath(openPaths.map(openPath => openPath.replace(originalNode.path, updatedNode.path))));
                }

                const {site: currentSite, language, mode: currentMode, path} = registry.get('jcontent', 'utils').extractParamsFromUrl(storedLocation.location.pathname, storedLocation.location.search);
                const newStoredLocation = {
                    ...storedLocation,
                    location: {
                        ...storedLocation.location,
                        pathname: registry.get('jcontent', 'utils').buildUrl({
                            site: currentSite,
                            language,
                            mode: currentMode,
                            path: path.replace(originalNode.path, updatedNode.path)
                        })
                    }
                };
                setStoredLocation(newStoredLocation);
                return newStoredLocation;
            }
        }
    };

    const envProps = {
        back: () => {
            setTimeout(() => {
                unRegisterBlockListener();
                exit(envProps.overriddenStoredLocation);
            }, 0);
        },
        disabledBack: () => !hasHistory(),
        registerListeners: () => {
            registerBlockListener(t('content-editor:label.contentEditor.edit.action.goBack.alert'));
        },
        unregisterListeners: () => {
            unRegisterBlockListener();
        },
        onSavedCallback: ({newNode}) => {
            if (newNode) {
                redirect({mode: Constants.routes.baseEditRoute, language: lang, uuid: newNode.uuid, rest: ''});
            }
        },
        createCallback: () => {
            notificationContext.notify(t('content-editor:label.contentEditor.create.createButton.success'), ['closeButton']);
        },
        editCallback: data => {
            envProps.overriddenStoredLocation = handleRename(data);
            notificationContext.notify(t('content-editor:label.contentEditor.edit.action.save.success'), ['closeButton']);
        },
        switchLanguageCallback: language => {
            redirect({language});
        },
        confirmationDialog: true
    };
    return Boolean(site) && (
        <ContentEditor name={name}
                       mode={mode}
                       uuid={uuid}
                       lang={lang}
                       uilang={uilang}
                       site={site}
                       contentType={contentType}
                       count={0}
                       envProps={envProps}/>
    );
};

ContentEditorRoute.propTypes = {
    name: PropTypes.string,
    mode: PropTypes.oneOf(['create', 'edit']).isRequired,
    uuid: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
    contentType: PropTypes.string
};

