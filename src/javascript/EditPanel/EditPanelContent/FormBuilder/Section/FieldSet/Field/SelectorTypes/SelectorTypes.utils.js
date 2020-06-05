import {SelectorTypes, SelectorTypeResolvers} from './SelectorTypes';

export const resolveSelectorType = ({selectorType, selectorOptions}) => {
    let selector;
    if (SelectorTypes[selectorType]) {
        if (selectorType === 'RichText') {
            selector = selectorOptions && selectorOptions.length > 0 && selectorOptions[0].name === 'markdown' ?
                SelectorTypes[selectorType].markdown :
                SelectorTypes[selectorType].default;
        } else {
            selector = SelectorTypes[selectorType];
        }
    }

    if (!selector && SelectorTypeResolvers[selectorType]) {
        selector = SelectorTypeResolvers[selectorType](selectorOptions);
    }

    return selector;
};
