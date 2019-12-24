import pickerConfigs from './Picker.configs';

export const getSiteNodes = (data, allSitesLabel) => {
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

export const allSitesEntry = label => {
    return {name: 'allSites', displayName: label, allSites: true};
};

export const extractConfigs = (field, editorContext, t) => {
    // Resolve picker configuration
    const pickerConfig = pickerConfigs.resolveConfig(
        field.selectorOptions,
        field
    );

    // Build tree configs
    const nodeTreeConfigs = pickerConfig.treeConfigs.map(treeConfig => {
        return {
            treeConfig,
            rootPath: treeConfig.rootPath(editorContext.site),
            selectableTypes: treeConfig.selectableTypes,
            type: treeConfig.type,
            openableTypes: treeConfig.openableTypes,
            rootLabel: t(treeConfig.rootLabelKey, {
                siteName: editorContext.siteDisplayableName
            }),
            key: `browse-tree-${treeConfig.type}`
        };
    });

    return {pickerConfig, nodeTreeConfigs};
};
