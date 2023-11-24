import React from 'react';
import {useTranslation} from 'react-i18next';
import {useNodeInfo} from '@jahia/data-helper';
import {LoaderOverlay} from '~/DesignSystem/LoaderOverlay';
import {
    Selector,
    weakrefContentPropsQuery,
    getDamSelectorConfig,
    getValueNodeTypes,
    getSelectorOptionsTypesTable, getValueChoiceListConfig
} from './components';
import {useQuery} from '@apollo/react-hooks';
import {PickerComponent} from './components';
import PropTypes from 'prop-types';

// Create a dropdown list with by default "jahia", then get from the config the list of DAM to enable <name><selectorType>
export const DamSelector = props => {
    const {value, editorContext, field} = props;
    const {t} = useTranslation();

    // Check modules loaded to prepare the selector
    const siteNodeInfo = useNodeInfo({path: '/sites/' + editorContext.site}, {
        getSiteInstalledModules: true
    });

    const weakNodeInfo = useQuery(weakrefContentPropsQuery, {
        variables: {
            uuid: value
        },
        skip: !value
    });
    const error = siteNodeInfo?.error || weakNodeInfo?.error;
    const loading = siteNodeInfo?.loading || weakNodeInfo?.loading;

    if (error) {
        const message = t(
            'jcontent:label.jcontent.error.queryingContent',
            {details: error.message ? error.message : ''}
        );

        console.warn(message);
    }

    if (loading) {
        return <LoaderOverlay/>;
    }

    const siteNode = siteNodeInfo.node.site;
    const weakNode = weakNodeInfo?.data?.jcr?.result;

    // Get Dam Modules selector config
    const damSelectorConfigs = getDamSelectorConfig(siteNode);
    // Get all the node types associated to the value
    const valueNodeTypes = getValueNodeTypes(weakNode);
    // Get specific node types that should be handled by jahia Picker based on selectorType configuration
    const selectorOptionsTypesTable = getSelectorOptionsTypesTable(field);

    let managedValue;

    // Case 'default' that means jahia picker
    if (damSelectorConfigs.length === 1) {
        // Check if current content is a jnt:file or authorized content based on selectorType configuration
        managedValue = ['jnt:file', ...selectorOptionsTypesTable].filter(type => valueNodeTypes.includes(type)).length > 0 ? value : null;
        // Get jahia picker
        return (
            <PickerComponent {...{
            ...props,
            choiceListConfig: damSelectorConfigs[0],
            value: managedValue
        }}/>
        );
    }

    // More than one dropdown entry, get the damSelector configuration associated to the value/picker selected in the dropdown
    const valueChoiceListConfig = getValueChoiceListConfig({
        damSelectorConfigs,
        selectorOptionsTypesTable,
        valueNodeTypes
    });

    return (
        <Selector {...{
        ...props,
        damSelectorConfigs,
        valueChoiceListConfig
    }}/>
    );
};

DamSelector.propTypes = {
    value: PropTypes.string.isRequired,
    editorContext: PropTypes.shape({
        site: PropTypes.string.isRequired,
        lang: PropTypes.string.isRequired
    }).isRequired,
    field: PropTypes.shape({
        selectorOptions: PropTypes.array
    }).isRequired
};
