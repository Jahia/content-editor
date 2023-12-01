import React from 'react';
import {useNodeInfo} from '@jahia/data-helper';
import {useValueTypes} from '~/SelectorTypes/Picker/PickerWrapper/useValueTypes';
import {LoaderOverlay} from '~/DesignSystem/LoaderOverlay';
import {getInitialOption, getPickerConfigsEnabled, Picker} from '~/SelectorTypes/Picker';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';

export const PickerWrapper = ({value, editorContext, ...props}) => {
    const {t} = useTranslation();
    // Check modules loaded to prepare the selector
    const siteNodeInfo = useNodeInfo({path: `/sites/${editorContext.site}`}, {
        getSiteInstalledModules: true
    });
    // Get all the nodes types associated to the value. Assumption : all the nodes are from the same type
    const valueNodeTypes = useValueTypes(value);

    const error = siteNodeInfo?.error || valueNodeTypes?.error;
    const loading = siteNodeInfo?.loading || valueNodeTypes?.loading;

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
    const {valueTypes} = valueNodeTypes;
    // Get Dam Modules selector config
    const pickerConfigsEnabled = getPickerConfigsEnabled(siteNode);
    const currentPickerConfiguration = getInitialOption({pickerConfigsEnabled, valueTypes});

    const dam = {
        pickerConfigsEnabled,
        currentPickerConfiguration
        // ValueTypes
    };

    return (
        <Picker
            dam={dam}
            value={value}
            editorContext={editorContext}
            {...props}/>
    );
};

PickerWrapper.propTypes = {
    editorContext: PropTypes.object.isRequired,
    value: PropTypes.string
};

PickerWrapper.displayName = 'PickerWrapper';
