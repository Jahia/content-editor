import {registry} from '@jahia/ui-extender';

export function cmGoto(data) {
    const jContentActions = registry.get('redux-action', 'jcontentGoto');
    return jContentActions.action(data);
}
