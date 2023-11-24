import React from 'react';
import {useTranslation} from 'react-i18next';
import {useNodeInfo} from '@jahia/data-helper';
import {LoaderOverlay} from '~/DesignSystem/LoaderOverlay';
import {
    getDamSelectorConfig
} from './utils';

import PropTypes from 'prop-types';
import styles from '../../Picker/PickerDialog/PickerDialog.scss';
import {Dialog, DialogContent, DialogTitle} from '@material-ui/core';

// Create a dropdown list with by default "jahia", then get from the config the list of DAM to enable <name><selectorType>
export const DamPickerDialog = ({
    isOpen,
    onClose,
    site,
    initialSelectedItem,
    lang,
    isMultiple,
    onItemSelection,
    type
}) => {
    const {t} = useTranslation();
    const [isVisible, setIsVisible] = React.useState('');
    // Const api = useContentEditorApiContext();
    // Check modules loaded to prepare the selector
    const siteNodeInfo = useNodeInfo({path: '/sites/' + site}, {
        getSiteInstalledModules: true
    });
    console.log(initialSelectedItem, lang, isMultiple, onItemSelection, type);
    const error = siteNodeInfo?.error;
    const loading = siteNodeInfo?.loading;

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

    // Get Dam Modules selector config
    const damSelectorConfigs = getDamSelectorConfig(siteNodeInfo.node.site);

    // Let managedValue;

    // Case 'default' that means jahia picker
    // if (damSelectorConfigs.length === 1 || type === "editoriallink") {
    //     // Get jahia picker
    //     api.openPicker({
    //         type,
    //         value,
    //         setValue: pickerResult => {
    //             fillCKEditorPicker(setUrl, dialog, type === 'editoriallink', pickerResult.length > 0 && pickerResult[0]);
    //         },
    //         site: editorContext.site,
    //         lang
    //     });
    //     return
    // }

    // More than one dropdown entry, get the damSelector configuration associated to the value/picker selected in the dropdown
    // const valueChoiceListConfig = getValueChoiceListConfig({
    //     damSelectorConfigs,
    //     selectorOptionsTypesTable,
    //     valueNodeTypes
    // });

    return (

        <Dialog
                    fullWidth
                    maxWidth="xl"
                    classes={{paper: styles.paper}}
                    open={isOpen}
                    onClose={onClose}
        >
            <DialogTitle id="customized-dialog-title">
                <ul>
                    {damSelectorConfigs.map(({key, label}) => (
                        <li key={key}>
                            <a href="#" onClick={() => setIsVisible(key)}>{t(label)}</a>
                        </li>
                          )
                            )}
                </ul>
            </DialogTitle>
            <DialogContent dividers>
                {damSelectorConfigs.map(({key, pickerDialog: Component}) => {
                                if (key === 'Picker') {
                                    return (isVisible === key && <div key={key}> Jahia </div>);
                                }

                            return (isVisible === key && <div id={key}><Component/></div>);
                            })}
            </DialogContent>
        </Dialog>

    );
};

DamPickerDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    site: PropTypes.string.isRequired,
    initialSelectedItem: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    lang: PropTypes.string,
    isMultiple: PropTypes.bool,
    onItemSelection: PropTypes.func.isRequired,
    type: PropTypes.string
};

DamPickerDialog.defaultValues = {
    initialSelectedItem: []
};
