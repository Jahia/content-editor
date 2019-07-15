import {SelectorTypes, SelectorTypeResolvers} from './SelectorTypes';

export const resolveSelectorType = ({selectorType, selectorOptions, multiple}) => {
    let selector;
    if (SelectorTypes[selectorType]) {
        selector = SelectorTypes[selectorType];
    }

    if (!selector && SelectorTypeResolvers[selectorType]) {
        selector = SelectorTypeResolvers[selectorType](selectorOptions);
    }

    // Check if selector exist and multiple support
    if (selector && (!multiple || selector.supportMultiple)) {
        return selector;
    }
};
