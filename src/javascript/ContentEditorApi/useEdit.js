import {Constants} from '~/ContentEditor.constants';
import {useCallback} from 'react';

export const useEdit = setEditorConfig => {
    /**
     * Open content editor as a modal to edit the given node
     * @param uuid the uuid of the node to edit
     * @param site the current site
     * @param lang the current lang from url
     * @param uilang the preferred user lang for ui
     */
    return useCallback((uuid, site, lang, uilang, isFullscreen, editCallback, onClosedCallback) => {
        if (typeof uuid === 'object') {
            setEditorConfig({
                mode: Constants.routes.baseEditRoute,
                ...uuid
            });
        } else {
            setEditorConfig({
                uuid,
                site,
                lang,
                uilang,
                mode: Constants.routes.baseEditRoute,
                isFullscreen,
                editCallback,
                onClosedCallback
            });
        }
    }, [setEditorConfig]);
};
