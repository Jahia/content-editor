import React, {useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ContentEditor} from './ContentEditor';
import PropTypes from 'prop-types';
import {Constants} from '~/ContentEditor.constants';
import {useContentEditorHistory} from '~/ContentEditorHistory';
import {useTranslation} from 'react-i18next';
import {replaceOpenedPath} from '~/JContent.redux-actions';
import {useContentEditorHistoryContext} from '~/ContentEditorHistory/ContentEditorHistory.context';
import {registry} from '@jahia/ui-extender';
import {useApolloClient, useQuery} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/data-helper';

const ContentEditorRedux = ({mode, uuid, lang, contentType}) => {
    const client = useApolloClient();
    const {redirect, hasHistory, exit, registerBlockListener, unRegisterBlockListener} = useContentEditorHistory();
    const {storedLocation, setStoredLocation} = useContentEditorHistoryContext();
    const {uilang, openPaths} = useSelector(state => ({uilang: state.uilang, openPaths: state.jcontent.openPaths}));
    const dispatch = useDispatch();
    const formikRef = useRef();
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
    if (window.authoringApi.switchLanguage) {
        window.authoringApi.switchLanguage(lang);
    }

    const handleRename = (node, mutateNode) => {
        if (mutateNode && mutateNode.rename) {
            if (storedLocation && storedLocation.location) {
                if (openPaths) {
                    dispatch(replaceOpenedPath(openPaths.map(openPath => openPath.replace(node.path, mutateNode.rename))));
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
                            path: path.replace(node.path, mutateNode.rename)
                        })
                    }
                };
                setStoredLocation(newStoredLocation);
                return newStoredLocation;
            }
        }
    };

    const envProps = {
        formikRef,
        setFormikRef: formik => {
            formikRef.current = formik;
        },
        setUrl: (mode, language, uuid, contentType) => redirect({mode, language, uuid, rest: contentType}),
        back: (uuid, operator, overridedStoredLocation) => {
            client.cache.flushNodeEntryById(uuid);
            exit(overridedStoredLocation);
        },
        disabledBack: () => !hasHistory(),
        setLanguage: language => redirect({language}),
        registerListeners: () => {
            registerBlockListener(t('content-editor:label.contentEditor.edit.action.goBack.alert'));
        },
        unregisterListeners: () => {
            unRegisterBlockListener();
        },
        shouldRedirectBreadcrumb: () => false,
        handleRename: handleRename
    };
    return Boolean(site) && (
        <ContentEditor env={Constants.env.redux}
                       mode={mode}
                       uuid={uuid}
                       lang={lang}
                       uilang={uilang}
                       site={site}
                       contentType={contentType}
                       envProps={envProps}/>
    );
};

ContentEditorRedux.propTypes = {
    mode: PropTypes.oneOf(['create', 'edit']).isRequired,
    uuid: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
    contentType: PropTypes.string
};

ContentEditorRedux.displayName = 'ContentEditorRedux';
export default ContentEditorRedux;
