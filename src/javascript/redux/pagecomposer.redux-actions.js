import {registry} from '@jahia/ui-extender';

export const pcNavigateTo = path => registry.get('redux-action', 'pagecomposerNavigateTo').action(path);
