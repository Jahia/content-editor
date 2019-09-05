import {SelectorTypes, SelectorTypeResolvers} from './SelectorTypes';

export const resolveSelectorType = ({selectorType, selectorOptions}) => {
    let selector;
    if (SelectorTypes[selectorType]) {
        selector = SelectorTypes[selectorType];
    }

    if (!selector && SelectorTypeResolvers[selectorType]) {
        selector = SelectorTypeResolvers[selectorType](selectorOptions);
    }

    return selector;
};
