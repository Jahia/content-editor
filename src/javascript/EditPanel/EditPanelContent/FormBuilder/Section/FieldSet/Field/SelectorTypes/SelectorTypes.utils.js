import {registry} from '@jahia/ui-extender';

export const resolveSelectorType = ({selectorType, selectorOptions}) => {
    let selector = registry.get('selectorType', selectorType);
    if (selector) {
        if (selector.resolver) {
            return selector.resolver(selectorOptions);
        }

        selector.key = selectorType;
        return selector;
    }
};
