import React from 'react';
import {connect, useDispatch, useSelector} from 'react-redux';
import {ContentEditor} from './ContentEditor';
import PropTypes from 'prop-types';
import {compose} from '~/utils';
import {Constants} from '~/ContentEditor.constants';
import {useContentEditorHistory} from '~/ContentEditorHistory';
import {useTranslation} from 'react-i18next';
import {withApollo} from 'react-apollo';
import {replaceOpenedPath} from '~/JContent.redux-actions';
import {useContentEditorHistoryContext} from '~/ContentEditorHistory/ContentEditorHistory.context';
import {registry} from '@jahia/ui-extender';

const mapStateToProps = state => {
    return {
        uilang: state.uilang,
        site: state.site
    };
};

const ContentEditorReduxCmp = ({client, mode, uuid, lang, uilang, site, contentType}) => {
    const {redirect, hasHistory, exit, registerBlockListener, unRegisterBlockListener} = useContentEditorHistory();
    const {storedLocation, setStoredLocation} = useContentEditorHistoryContext();
    const {openPaths} = useSelector(state => ({openPaths: state.jcontent.openPaths}));
    const dispatch = useDispatch();
    const {t} = useTranslation('content-editor');
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
        shouldRedirectBeadCrumb: () => false,
        handleRename: handleRename
    };
    return (
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

ContentEditorReduxCmp.propTypes = {
    client: PropTypes.object.isRequired,
    mode: PropTypes.oneOf(['create', 'edit']).isRequired,
    uuid: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
    uilang: PropTypes.string.isRequired,
    site: PropTypes.string.isRequired,
    contentType: PropTypes.string
};

export const ContentEditorRedux = compose(
    withApollo,
    connect(mapStateToProps)
)(ContentEditorReduxCmp);
ContentEditorRedux.displayName = 'ContentEditorRedux';
export default ContentEditorRedux;
