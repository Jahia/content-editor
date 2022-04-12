import {registry} from '@jahia/ui-extender';

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

export function getNodeTreeConfigs(pickerConfig, site, siteName, t) {
    const nodeTreeConfigs = pickerConfig.treeConfigs.map(treeConfig => {
        return {
            treeConfig,
            rootPath: treeConfig.rootPath(site),
            selectableTypes: treeConfig.selectableTypes,
            type: treeConfig.type,
            openableTypes: treeConfig.openableTypes,
            rootLabel: t(treeConfig.rootLabelKey, {
                siteName: siteName
            }),
            key: `browse-tree-${treeConfig.type}`
        };
    });
    return nodeTreeConfigs;
}

export const extractConfigs = (field, editorContext, t) => {
    // Resolve picker configuration
    const pickerConfig = _resolveConfig(
        field.selectorOptions,
        field
    );

    // Build tree configs
    const nodeTreeConfigs = getNodeTreeConfigs(pickerConfig, editorContext.site, editorContext.siteInfo.displayName, t);

    return {
        pickerConfig: {
            ...pickerConfig,
            displayTree: pickerConfig.displayTree !== false
        },
        nodeTreeConfigs
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

const _getPickerType = options => {
    const pickerOption = options && options.find(option => option.name === 'type' && registry.get('pickerConfiguration', option.value));
    return (pickerOption && pickerOption.value) || 'editorial';
};

export const _resolveConfig = (options, field) => {
    const config = Object.assign({selectorOptions: options}, registry.get('pickerConfiguration', _getPickerType(options)).cmp);
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

