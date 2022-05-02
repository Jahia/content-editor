import {useHistory} from 'react-router-dom';
import {splitPath} from './ContentEditorHistory.utils';
import {Constants} from '~/ContentEditor.constants';
import {useContentEditorHistoryContext} from './ContentEditorHistory.context';

export const useContentEditorHistory = () => {
    const {storedLocation, setStoredLocation} = useContentEditorHistoryContext();
    const history = useHistory();
    let unblock;
    const redirect = ({mode, language, uuid, rest}) => {
        const currentPath = history.location.pathname;
        const {appName, currentLanguage, currentMode, currentUuid, currentRest} = splitPath(currentPath);
        if (appName !== Constants.appName) {
            setStoredLocation({location: history.location, language: language || currentLanguage});
        }

        // Compute rest (end of the path)
        // Keep old rest if mode is the same or not changed
        let oldRest = (!mode || mode === currentMode) ? currentRest : '';
        // Use rest if provided
        let newRest = rest || (rest === '' ? '' : oldRest);
        // Add starting "/" if necessary
        newRest = newRest && (newRest.startsWith('/') ? newRest : ('/' + newRest));
        history.push(buildContentEditorURL(Constants.appName, mode || currentMode, language || currentLanguage, uuid || currentUuid, newRest));
    };

    const hasHistory = () => {
        return Boolean(storedLocation);
    };

    const exit = overriddenStoredLocation => {
        // Restore GWT language
        if (window.authoringApi.switchLanguage) {
            window.authoringApi.switchLanguage(storedLocation.language);
        }

        // In order use:
        // - Stored location
        // - Referer
        // - Back button
        if (overriddenStoredLocation && overriddenStoredLocation.location) {
            history.push(overriddenStoredLocation.location.pathname + overriddenStoredLocation.location.search);
        } else if (storedLocation.location) {
            history.push(storedLocation.location.pathname + storedLocation.location.search);
        } else if (document.referer) {
            window.history.push(document.referer);
        } else {
            window.history.back();
        }
    };

    const registerBlockListener = message => {
        unblock = history.block(location => {
            const {appName} = splitPath(location.pathname);
            if (appName !== Constants.appName) {
                return message;
            }
        });
    };

    const unRegisterBlockListener = () => {
        if (unblock) {
            unblock();
        }
    };

    return {redirect, exit, registerBlockListener, unRegisterBlockListener, hasHistory};
};
// eslint-disable-next-line
const buildContentEditorURL = (appName, mode, language, uuid, rest) => {
    return `/${appName}/${language}/${mode}/${uuid}${rest}`;
};
