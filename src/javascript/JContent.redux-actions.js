import {registry} from '@jahia/ui-extender';

export function cmGoto(data) {
    const jContentActions = registry.get('redux-action', 'jcontentGoto');
    return jContentActions.action(data);
}

export function setLanguage(language) {
    return registry.get('redux-reducer', 'language').actions.setLanguage(language);
}

export function replaceOpenedPath(data) {
    const jContentActions = registry.get('redux-action', 'jcontentReplaceOpenedPath');
    return jContentActions.action(data);
}
