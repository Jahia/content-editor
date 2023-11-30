import React from 'react';
import PropTypes from 'prop-types';
import {Dialog, Slide} from '@material-ui/core';
import styles from './PickerDialog.scss';
import {configPropType} from '~/SelectorTypes/Picker/configs/configPropType';
import {getInitialOption, getPickerConfigsEnabled, JahiaPicker} from '~/SelectorTypes/Picker';
import {useValueTypes} from '~/SelectorTypes/Picker/PickerDialog/useValueTypes';
import {LoaderOverlay} from '~/DesignSystem/LoaderOverlay';
import {useNodeInfo} from '@jahia/data-helper';
import {useTranslation} from 'react-i18next';
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
    const {t} = useTranslation();

    // Check modules loaded to prepare the selector
    const siteNodeInfo = useNodeInfo({path: `/sites/${site}`}, {
        getSiteInstalledModules: true
    });

    // Get all the nodes types associated to the value. Assumption : all the nodes are from the same type
    const valueNodeTypes = useValueTypes(uuid) || [];

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
                        initialSelectedItem: initialSelectedItem && initialSelectedItem.map(f => f.path),
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
            classes={{paper: styles.paper}}
            open={isOpen}
            TransitionComponent={Transition}
            onClose={onClose}
        >
            <PickerSelector {...{
                pickerConfigsEnabled,
                initialOption: getInitialOption({pickerConfigsEnabled, valueTypes}),
                isOpen,
                onClose,
                site,
                pickerConfig,
                initialSelectedItem,
                accordionItemProps,
                lang,
                isMultiple,
                onItemSelection}}/>
        </Dialog>
    );

    // Return (
    //     <Dialog
    //         fullWidth
    //         maxWidth="xl"
    //         data-sel-role="picker-dialog"
    //         data-sel-type={pickerConfig.key}
    //         classes={{paper: styles.paper}}
    //         open={isOpen}
    //         TransitionComponent={Transition}
    //         onClose={onClose}
    //     >
    //         <DialogTitle id="customized-dialog-title">
    //             <ul>
    //                 {pickerConfigsEnabled.map(({key, pickerDialog: {label}}) => (
    //                     <li key={key}>
    //                         <a href="#" onClick={() => setIsVisible(key)}>{t(label)}</a>
    //                     </li>
    //                     )
    //                 )}
    //             </ul>
    //         </DialogTitle>
    //         <DialogContent dividers id="PickerWebHook">
    //             {pickerConfigsEnabled.map(({key, pickerDialog: {cmp: Component}}) => {
    //                 return (
    //                     <div key={key} className={clsx('flexFluid', 'flexRow_nowrap', styles.navigation, {[styles.displayNone]: isVisible !== key})}>
    //                         <Component {...{
    //                             isOpen,
    //                             site,
    //                             pickerConfig,
    //                             initialSelectedItem: initialSelectedItem && initialSelectedItem.map(f => f.path),
    //                             accordionItemProps,
    //                             lang,
    //                             isMultiple,
    //                             onClose,
    //                             onItemSelection
    //                         }}/>
    //                     </div>
    //                 );
    //             })}
    //         </DialogContent>
    //     </Dialog>
    // );
};

PickerDialog.propTypes = {
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
