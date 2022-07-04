import {registry} from '@jahia/ui-extender';
import {Constants} from './Picker2.constants';

export const extractConfigs = field => {
    // Resolve picker configuration
    const pickerConfig = _resolveConfig(
        field.selectorOptions,
        field
    );

    return {
        pickerConfig: {
            ...pickerConfig,
            displayTree: pickerConfig.displayTree !== false,
            pickerType: _getPickerType(field.selectorOptions)
        }
    };
};

export const getPathWithoutFile = fullPath => {
    return fullPath && fullPath.split('/').slice(0, -1).join('/');
};

export const getSite = fullPath => {
    return fullPath && fullPath
        .split('/')
        .slice(0, 3)
        .join('/');
};

export const getDetailedPathArray = fullPath => {
    return fullPath ?
        fullPath
            .split('/')
            .slice(1)
            .reduce((prev, current, currentIndex) => {
                return [
                    ...prev,
                    prev[currentIndex - 1] ? `${prev[currentIndex - 1]}/${current}` : `/${current}`
                ];
            }, [])
            .slice(2) :
        [];
};

export const getAccordionMode = fullPath => {
    const split = fullPath.split('/');
    const modeIndex = 3;

    switch (split[modeIndex]) {
        case 'files': return Constants.ACCORDION_ITEM_TYPES.MEDIA;
        case 'pages': return Constants.ACCORDION_ITEM_TYPES.PAGES;
        case 'content-folders': return Constants.ACCORDION_ITEM_TYPES.CONTENT_FOLDERS;
        default: return Constants.ACCORDION_ITEM_TYPES.PAGES;
    }
};

const _getPickerType = options => {
    const pickerOption = options && options.find(option => option.name === 'type' && registry.get('pickerConfiguration', option.value));
    return (pickerOption && pickerOption.value) || 'editorial';
};

export const _resolveConfig = (options, field) => {
    const config = Object.assign({}, registry.get('pickerConfiguration', _getPickerType(options)).cmp);
    if (field && field.valueConstraints) {
        const constraints = field.valueConstraints.map(constraint => constraint.value.string);
        if (constraints && constraints.length > 0) {
            config.selectableTypesTable = constraints;
        }
    }

    return config;
};

export const getPickerSelectorType = options => {
    return registry.get('pickerConfiguration', _getPickerType(options)).cmp.picker;
};

