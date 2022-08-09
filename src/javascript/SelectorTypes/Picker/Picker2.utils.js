import {Constants} from './Picker2.constants';

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

export const getAccordionMode = (fullPath, config) => {
    // Todo : Fix getAccordionMode - try to get an accordion matching path
    if (config.accordionMode) {
        return config.accordionMode;
    }

    const split = fullPath.split('/');
    const modeIndex = 3;

    switch (split[modeIndex]) {
        case 'files': return 'picker-' + Constants.ACCORDION_ITEM_TYPES.MEDIA;
        case 'contents': return 'picker-' + Constants.ACCORDION_ITEM_TYPES.CONTENT_FOLDERS;
        case 'categories': return 'picker-' + Constants.ACCORDION_ITEM_TYPES.CATEGORY;
        default: return 'picker-' + Constants.ACCORDION_ITEM_TYPES.PAGES;
    }
};

export const set = (target, path, value) => {
    const splitRes = path.split('.');

    let key;
    let current = target;
    while ((splitRes.length > 1) && (key = splitRes.shift())) {
        if (!current[key]) {
            current[key] = {};
        }

        current = current[key];
    }

    current[splitRes.shift()] = value;
};

export const isObject = item => {
    return (item && typeof item === 'object' && !Array.isArray(item));
};

export const mergeDeep = (target, ...sources) => {
    if (!sources.length) {
        return target;
    }

    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) {
                    Object.assign(target, {[key]: {}});
                }

                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, {[key]: source[key]});
            }
        }
    }

    return mergeDeep(target, ...sources);
};

export const arrayValue = value => {
    return (typeof value === 'string') ? value.split(',') : value;
};

export const booleanValue = v => typeof v === 'string' ? v === 'true' : Boolean(v);

export const toArray = value => (Array.isArray(value) ? value : [value]);
