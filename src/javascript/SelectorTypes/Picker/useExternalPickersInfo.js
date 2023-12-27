import {useQuery} from '@apollo/react-hooks';
import {valueTypesByPathQuery, valueTypesQuery} from './useExternalPickersInfo.gql-queries';
import {useNodeInfo} from '@jahia/data-helper';
import {registry} from '@jahia/ui-extender';

const useValueTypes = values => {
    const useQueryByUuid = values.every(f => f.uuid);
    const useQueryByPath = values.every(f => f.path);
    let skip = values.length === 0 || (!useQueryByPath && !useQueryByUuid);

    const {data, error, loading} = useQuery(useQueryByUuid ? valueTypesQuery : valueTypesByPathQuery, {
        variables: {
            uuids: values.map(v => v.uuid),
            paths: values.map(v => v.path)
        },
        skip
    });

    if (skip) {
        return {valueTypes: new Set(), loading: false};
    }

    if (loading || error) {
        return {error, loading};
    }

    let node = data?.jcr?.result;

    const superTypes = node?.flatMap(n => n.primaryNodeType.supertypes?.map(({name}) => name)) || [];
    const mixinTypes = node?.flatMap(n => n.mixinTypes.map(({name}) => name)) || [];
    const primaryNodeType = node?.flatMap(n => n.primaryNodeType?.name);
    const valueTypes = new Set([...primaryNodeType, ...superTypes, ...mixinTypes]);

    return {valueTypes, error, loading};
};

export const useExternalPickersInfo = (site, values, pickerConfig) => {
    const allConfigs = registry.find({type: 'externalPickerConfiguration'});
    const nodeInfo = useNodeInfo({path: '/sites/' + site}, {getSiteInstalledModules: true});

    // Get all the nodes types associated to the values
    const valueNodeTypes = useValueTypes(values);

    if (nodeInfo.loading || valueNodeTypes.loading) {
        return {loading: true};
    }

    const availableExternalPickerConfigs = allConfigs
        .filter(({requireModuleInstalledOnSite}) => !requireModuleInstalledOnSite || nodeInfo.node.site.installedModulesWithAllDependencies?.includes?.(requireModuleInstalledOnSite))
        .filter(({pickerConfigs}) => !pickerConfigs || pickerConfigs.indexOf(pickerConfig.key) > -1);

    // Get Dam Modules selector config.
    // Todo: cleanup how the pickers detect they can handle the file.
    // This is currently done by specific code, either checking the selectableTypes (if values are nodes identified by uuid or path, so based on  valueNodeTypes)
    // Or by checking if "keyUrlPath" is part of the url (if values are only identified by url)
    const externalPickerConfig =
        availableExternalPickerConfigs.find(({selectableTypes}) => selectableTypes && selectableTypes.find(selectableType => valueNodeTypes.valueTypes.has(selectableType))) ||
        availableExternalPickerConfigs.find(({keyUrlPath}) => keyUrlPath && values.find(v => v.fileUrl?.host && v.fileUrl.host.indexOf(keyUrlPath) > -1)) ||
        registry.get('externalPickerConfiguration', 'default');

    return {availableExternalPickerConfigs, externalPickerConfig, loading: false, error: nodeInfo.error || valueNodeTypes.error};
};
