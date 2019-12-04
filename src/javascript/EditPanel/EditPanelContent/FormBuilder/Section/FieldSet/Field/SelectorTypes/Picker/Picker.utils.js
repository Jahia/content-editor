const getSiteNodes = (data, allSitesLabel) => {
    const siteNodes = [];

    if (data && data.jcr.result) {
        for (const siteNode of data.jcr.result.siteNodes) {
            if (siteNode.hasPermission) {
                siteNodes.push(siteNode);
            }
        }
    }

    siteNodes.sort((elem1, elem2) => {
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
