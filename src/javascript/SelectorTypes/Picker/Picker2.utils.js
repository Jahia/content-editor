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
