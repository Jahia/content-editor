import React from 'react';
import {useTranslation} from 'react-i18next';
import {useNodeInfo} from '@jahia/data-helper';
import {LoaderOverlay} from '~/DesignSystem/LoaderOverlay';
import {
    // Selector,
    weakrefContentPropsQuery,
    getPickerDialogSelectorConfig
    // GetValueNodeTypes
    // GetSelectorOptionsTypesTable, getValueChoiceListConfig
} from './';
import {useQuery} from '@apollo/react-hooks';
// Import {PickerComponent} from './components';
import PropTypes from 'prop-types';
// Import {mergeDeep} from "../Picker.utils";
import {PickerDialog} from '../PickerDialog';
import {configPropType} from '~/SelectorTypes/Picker/configs/configPropType';
import styles from './PickerDialogSelector.scss';
import {DialogContent, DialogTitle} from '@material-ui/core';
import {Dialog} from '~/SelectorTypes/Picker/Dialog';
import clsx from 'clsx';

// Create a dropdown list with by default "jahia", then get from the config the list of DAM to enable <name><selectorType>
export const PickerDialogSelector = ({
    isOpen,
    onClose,
    initialSelectedItem,
    site,
    pickerConfig,
    lang,
    isMultiple,
    accordionItemProps,
    onItemSelection
}) => {
    const [{uuid}] = initialSelectedItem;
    // Const {value, editorContext, field} = props;
    const {t} = useTranslation();
    const [isVisible, setIsVisible] = React.useState('');

    // Check modules loaded to prepare the selector
    const siteNodeInfo = useNodeInfo({path: `/sites/${site}`}, {
        getSiteInstalledModules: true
    });

    const weakNodeInfo = useQuery(weakrefContentPropsQuery, {
        variables: {
            uuid
        },
        skip: !uuid
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
    // Const weakNode = weakNodeInfo?.data?.jcr?.result;

    // Get Dam Modules selector config
    const pickerDialogSelectorConfigs = getPickerDialogSelectorConfig(siteNode);
    // Get all the node types associated to the value
    // const valueNodeTypes = getValueNodeTypes(weakNode);
    // Get specific node types that should be handled by jahia Picker based on selectorType configuration
    // const selectorOptionsTypesTable = getSelectorOptionsTypesTable(field);

    // let managedValue;

    // Case 'default' that means jahia picker
    if (pickerDialogSelectorConfigs.length === 1) {
        // Check if current content is a jnt:file or authorized content based on selectorType configuration
        // managedValue = ['jnt:file', ...selectorOptionsTypesTable].filter(type => valueNodeTypes.includes(type)).length > 0 ? value : null;
        // Return jahia picker dialog
        return (
            <PickerDialog {...{
                isOpen,
                site,
                pickerConfig,
                initialSelectedItem: initialSelectedItem && initialSelectedItem.map(f => f.path),
                accordionItemProps,
                lang,
                isMultiple,
                onClose,
                onItemSelection,
                inlineContainer: false
            }}/>
        );
    }

    // More than one dropdown entry, get the damSelector configuration associated to the value/picker selected in the dropdown
    // const valueChoiceListConfig = getValueChoiceListConfig({
    //     pickerDialogSelectorConfigs,
    //     selectorOptionsTypesTable,
    //     valueNodeTypes
    // });

    return (
        <Dialog {...{
            isOpen,
            onClose,
            pickerConfig
        }}
        >
            <DialogTitle id="customized-dialog-title">
                <ul>
                    {pickerDialogSelectorConfigs.map(({key, label}) => (
                        <li key={key}>
                            <a href="#" onClick={() => setIsVisible(key)}>{t(label)}</a>
                        </li>
                        )
                    )}
                </ul>
            </DialogTitle>
            <DialogContent dividers id="PickerWebHook">
                {pickerDialogSelectorConfigs.map(({key, pickerDialog: Component}) => {
                    return (
                        <div key={key} className={clsx({[styles.displayNone]: isVisible !== key})}>
                            <Component {...{
                                isOpen,
                                site,
                                pickerConfig,
                                initialSelectedItem: initialSelectedItem && initialSelectedItem.map(f => f.path),
                                accordionItemProps,
                                lang,
                                isMultiple,
                                onClose,
                                onItemSelection,
                                inlineContainer: true
                            }}/>
                        </div>
                        );
                })}
            </DialogContent>
        </Dialog>
    );
};

PickerDialogSelector.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    site: PropTypes.string.isRequired,
    pickerConfig: configPropType.isRequired,
    initialSelectedItem: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
    accordionItemProps: PropTypes.object,
    lang: PropTypes.string,
    isMultiple: PropTypes.bool,
    onItemSelection: PropTypes.func.isRequired
};
PickerDialogSelector.defaultValues = {
    initialSelectedItem: [],
    inlineContainer: false
};
