import {registry} from '@jahia/ui-extender';

export const resolveSelectorType = ({selectorType, selectorOptions, displayName, ...field}) => {
    let selector = registry.get('selectorType', selectorType);
    if (selector) {
        if (selector.resolver) {
            return selector.resolver(selectorOptions, field);
        }

        return selector;
    }

    if (selectorType) {
        console.warn(`No renderer component for ${selectorType} selectorType`);
    } else {
        console.error(`Field ${displayName} has no selectorType !`, {selectorOptions, displayName, ...field});
    }

    return registry.get('selectorType', 'Text');
};
