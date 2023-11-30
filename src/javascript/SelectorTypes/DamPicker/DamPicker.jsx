import {useValueTypes} from '~/SelectorTypes/DamPicker/useValueTypes';
import {useNodeInfo} from '@jahia/data-helper';
import {LoaderOverlay} from '~/DesignSystem/LoaderOverlay';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {getPickerConfiguration} from '~/SelectorTypes/DamPicker/DamPicker.utils';

export const DamPicker = ({value, editorContext, field, ...props}) => {
    const {t} = useTranslation();

    // Check modules loaded to prepare the selector
    const siteNodeInfo = useNodeInfo({path: '/sites/' + editorContext.site}, {
        getSiteInstalledModules: true
    });
    // Get all the nodes types associated to the value
    const valueNodeTypes = useValueTypes(value[0] || value);

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
    // Get Dam Modules selector config
    const pickerConfiguration = getPickerConfiguration(siteNode);

    //TODO check if isDamEnabled: true

    // Case 'default' that means jahia picker
    if(pickerConfiguration.length === 1){

    }

};
