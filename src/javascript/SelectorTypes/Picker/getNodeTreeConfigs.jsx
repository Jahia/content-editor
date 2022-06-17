export const getNodeTreeConfigs = (pickerConfig, site, siteName, t) => {
    return pickerConfig.treeConfigs.map(treeConfig => {
        return {
            ...treeConfig,
            rootPath: treeConfig.getRootPath && treeConfig.getRootPath(site),
            rootLabel: t(treeConfig.rootLabelKey, {
                siteName: siteName
            }),
            key: `browse-tree-${treeConfig.type}`
        };
    });
};
