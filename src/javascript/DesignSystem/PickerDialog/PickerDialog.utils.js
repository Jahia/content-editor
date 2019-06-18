export const getPathWithoutFile = fullPath => {
    return fullPath && fullPath.split('/').slice(0, -1).join('/');
};

export const getSite = fullPath => {
    return fullPath && fullPath
        .split('/')
        .slice(0, 3)
        .join('/');
};

export const getDetailedPathArray = (fullPath, site) => {
    return fullPath ?
        fullPath
            .split('/')
            .slice(3, -2) // Remove site and path to have the correct number of element to return
            .reduce((openPaths, slug, i, init) => {
                return [
                    ...openPaths,
                    `${site}/${init.slice(0, i + 1).join('/')}`
                ];
            }, [site]) :
        [];
};
