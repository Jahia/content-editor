import React from 'react';
import PropTypes from 'prop-types';
import {Dialog, Slide} from '@material-ui/core';
import styles from './PickerDialog.scss';
import {configPropType} from '~/SelectorTypes/Picker/configs/configPropType';
import {DamPropsTypes} from '~/SelectorTypes/Picker/PickerWrapper/PickerWrapper.proptypes';
import {
    formatInitialSelectedItem,
    // GetInitialOption,
    // getPickerConfigsEnabled,
    JahiaPicker
} from '~/SelectorTypes/Picker';
// Import {useValueTypes} from '~/SelectorTypes/Picker/PickerWrapper/useValueTypes';
// import {LoaderOverlay} from '~/DesignSystem/LoaderOverlay';
// import {useNodeInfo} from '@jahia/data-helper';
// import {useTranslation} from 'react-i18next';
import {PickerSelector} from '~/SelectorTypes/Picker/PickerDialog/PickerSelector';

const Transition = props => (
    <Slide direction="up"
           {...props}
           onEntered={node => {
               // Remove transform style after transition to fix internal positioning
               node.style = {};
           }}
    />
);

export const PickerDialog = ({
    dam,
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
    const initialSelectedValues = formatInitialSelectedItem(initialSelectedItem);
    // Const [{uuid}] = initialSelectedValues;
    // const {t} = useTranslation();
    const {pickerConfigsEnabled, currentPickerConfiguration} = dam;

    // // Check modules loaded to prepare the selector
    // const siteNodeInfo = useNodeInfo({path: `/sites/${site}`}, {
    //     getSiteInstalledModules: true
    // });
    //
    // // Get all the nodes types associated to the value. Assumption : all the nodes are from the same type
    // const valueNodeTypes = useValueTypes(uuid);
    //
    // const error = siteNodeInfo?.error || valueNodeTypes?.error;
    // const loading = siteNodeInfo?.loading || valueNodeTypes?.loading;
    //
    // if (error) {
    //     const message = t(
    //         'jcontent:label.jcontent.error.queryingContent',
    //         {details: error.message ? error.message : ''}
    //     );
    //
    //     console.warn(message);
    // }
    //
    // if (loading) {
    //     return <LoaderOverlay/>;
    // }
    //
    // const siteNode = siteNodeInfo.node.site;
    // const {valueTypes} = valueNodeTypes;
    // // Get Dam Modules selector config
    // const pickerConfigsEnabled = getPickerConfigsEnabled(siteNode);

    if (pickerConfigsEnabled.length === 1) {
        return (
            <Dialog
                fullWidth
                maxWidth="xl"
                data-sel-role="picker-dialog"
                data-sel-type={pickerConfig.key}
                classes={{paper: styles.paper}}
                open={isOpen}
                TransitionComponent={Transition}
                onClose={onClose}
            >
                <JahiaPicker {...{
                        isOpen,
                        onClose,
                        site,
                        pickerConfig,
                        initialSelectedItem: initialSelectedValues && initialSelectedValues.map(f => f.path),
                        accordionItemProps,
                        lang,
                        isMultiple,
                        onItemSelection}}/>

            </Dialog>
        );
    }

    return (
        <Dialog
            fullWidth
            maxWidth="xl"
            data-sel-role="picker-dialog"
            data-sel-type={pickerConfig.key}
            classes={{paper: styles.pickerDam}}
            open={isOpen}
            TransitionComponent={Transition}
            onClose={onClose}
        >
            <PickerSelector {...{
                pickerConfigsEnabled,
                initialOption: currentPickerConfiguration, // GetInitialOption({pickerConfigsEnabled, valueTypes}),
                isOpen,
                onClose,
                site,
                pickerConfig,
                initialSelectedItem: initialSelectedValues,
                accordionItemProps,
                lang,
                isMultiple,
                onItemSelection}}/>
        </Dialog>
    );
};

PickerDialog.propTypes = {
    dam: DamPropsTypes,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    site: PropTypes.string.isRequired,
    pickerConfig: configPropType.isRequired,
    initialSelectedItem: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    accordionItemProps: PropTypes.object,
    lang: PropTypes.string,
    isMultiple: PropTypes.bool,
    onItemSelection: PropTypes.func.isRequired
};

PickerDialog.defaultValues = {
    initialSelectedItem: []
};
