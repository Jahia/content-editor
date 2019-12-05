const getSiteNodes = (data, allSitesLabel) => {
    const siteNodes = data && data.jcr.result && data.jcr.result.siteNodes
        .filter(node => node.hasPermission)
        .sort((elem1, elem2) => {
            if (elem1.displayName < elem2.displayName) {
                return -1;
            }

            if (elem1.displayName > elem2.displayName) {
                return 1;
            }

            return 0;
        });

    if (siteNodes.length > 1) {
        return [allSitesEntry(allSitesLabel), ...siteNodes];
    }

    return siteNodes;
};

const allSitesEntry = label => {
    return {name: 'allSites', displayName: label, allSites: true};
};

export {getSiteNodes, allSitesEntry};
