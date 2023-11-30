import {registry} from '@jahia/ui-extender';

export const getValueNodeTypes = weakNode => {
    const superTypes = weakNode?.primaryNodeType.supertypes?.map(({name}) => name) || [];
    const mixinTypes = weakNode?.mixinTypes.map(({name}) => name) || [];
    const primaryNodeType = weakNode?.primaryNodeType?.name;
    return [primaryNodeType, ...superTypes, ...mixinTypes];
};

export const getPickerConfigsEnabled = siteNode => {
    const installedModules = siteNode?.installedModulesWithAllDependencies;
    return registry.find({type: 'pickerConfiguration'}).filter(({module}) => installedModules.includes(module));
};

export const getInitialOption = ({pickerConfigsEnabled, valueTypes}) => {
    return pickerConfigsEnabled.find(({selectableTypes}) => selectableTypes.filter(selectableType => valueTypes.includes(selectableType)).length);
};
