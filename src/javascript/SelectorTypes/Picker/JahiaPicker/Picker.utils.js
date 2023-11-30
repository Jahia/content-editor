export const getSiteNodes = (data, allSitesLabel) => {
    const siteNodes = data && data.jcr && data.jcr.result ? [...data.jcr.result.siteNodes]
        .sort((elem1, elem2) => {
            if (elem1.displayName < elem2.displayName) {
                return -1;
            }

            if (elem1.displayName > elem2.displayName) {
                return 1;
            }

            return 0;
        }) : [];

    if (siteNodes.length > 1) {
        return [allSitesEntry(allSitesLabel), ...siteNodes];
    }

    return siteNodes;
};

export const allSitesEntry = label => {
    return {name: 'allSites', displayName: label, allSites: true};
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
