import {useHistory} from 'react-router-dom';
import {splitPath} from './ContentEditorHistory.utils';
import {Constants} from '~/ContentEditor.constants';

export const useContentEditorHistory = () => {
    const history = useHistory();
    const currentPath = history.location.pathname;
    const {currentLanguage, currentMode, currentUuid, currentRest} = splitPath(currentPath);
    const redirect = ({mode, language, uuid, rest}) => {
        // Compute rest (end of the path)
        // Keep old rest if mode is the same or not changed
        let oldRest = (!mode || mode === currentMode) ? currentRest : '';
        // Use rest if provided
        let newRest = rest || (rest === '' ? '' : oldRest);
        // Add starting "/" if necessary
        newRest = newRest && (newRest.startsWith('/') ? newRest : ('/' + newRest));
        history.push(buildContentEditorURL(Constants.appName, mode || currentMode, language || currentLanguage, uuid || currentUuid, newRest));
    };

    return {redirect};
};

const buildContentEditorURL = (appName, mode, language, uuid, rest) => {
    return `/${appName}/${language}/${mode}/${uuid}${rest}`;
};
