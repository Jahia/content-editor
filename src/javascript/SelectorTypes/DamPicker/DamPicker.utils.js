import {registry} from '@jahia/ui-extender';

export const getPicker = (damSelectorConfig, field) => {
    if (!damSelectorConfig) {
        return null;
    }

    let selectorType = registry.get('selectorType', damSelectorConfig.key);
    if (!selectorType.cmp) {
        selectorType = selectorType.resolver(field.selectorOptions || [], field);
    }

    return selectorType;
};

// Export const getPickerDialogSelectorConfig = siteNode => {
//     const installedModules = siteNode?.installedModulesWithAllDependencies;
//     return registry.find({type: 'pickerDialogSelectorConfiguration'}).filter(({module}) => installedModules.includes(module));
// };

export const getPickerConfiguration = siteNode => {
    const installedModules = siteNode?.installedModulesWithAllDependencies;
    return registry.find({type: 'pickerConfiguration'}).filter(({module}) => installedModules.includes(module));
};

export const getValueNodeTypes = node => {
    const superTypes = node?.primaryNodeType.supertypes?.map(({name}) => name) || [];
    const mixinTypes = node?.mixinTypes.map(({name}) => name) || [];
    const primaryNodeType = node?.primaryNodeType?.name;
    return [primaryNodeType, ...superTypes, ...mixinTypes];
};

// Export const getSelectorOptionsTypesTable = field => {
//     const selectorOptionsTypesObject = field.selectorOptions?.find(({name}) => name === 'pickerConfig.selectableTypesTable');
//     if (!selectorOptionsTypesObject) {
//         return [];
//     }
//
//     return selectorOptionsTypesObject.value ? [selectorOptionsTypesObject.value] : (selectorOptionsTypesObject.values || []);
// };

export const getValueChoiceListConfig = ({damSelectorConfigs, selectorOptionsTypesTable, valueNodeTypes}) => {
    return damSelectorConfigs.find(({types, key}) => {
        let damSelectorConfigNodeTypes = types;
        // Add selector option types only if the picker is the jahia picker
        if (key === 'Picker') {
            damSelectorConfigNodeTypes = [...damSelectorConfigNodeTypes, ...selectorOptionsTypesTable];
        }

        return damSelectorConfigNodeTypes.filter(damSelectorConfigNodeType => valueNodeTypes.includes(damSelectorConfigNodeType)).length;
    });
};
