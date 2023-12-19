import React from 'react';
import {useTranslation} from 'react-i18next';
import {Dropdown, toIconComponent, Typography} from '@jahia/moonstone';
import styles from './PickerSelector.scss';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {ExternalPickerConfigPropsTypes} from '../../Picker.propTypes';

// Create a dropdown list with by default "jahia", then get from the config the list of DAM to enable <name><selectorType>
export const PickerSelector = ({
    availableExternalPickerConfigs,
    externalPickerConfig,
    setExternalPickerConfig
}) => {
    const {t} = useTranslation();

    const {label, iconName, dropdownData} = React.useMemo(() => ({
        label: t(externalPickerConfig?.label),
        iconName: externalPickerConfig?.icon || '',
        dropdownData: availableExternalPickerConfigs.length > 0 ? availableExternalPickerConfigs.map(({key: provider, pickerDialog: {label, description, icon}}) => {
            return {
                label: t(label),
                value: provider,
                description: t(description),
                iconStart: icon && toIconComponent(icon),
                attributes: {
                    'data-value': provider
                }
            };
        }) : [{label: '', value: ''}]
    }), [t, externalPickerConfig, availableExternalPickerConfigs]);

    const handleOnChange = item => {
        if (item.value !== externalPickerConfig?.key) {
            const newOption = availableExternalPickerConfigs.find(({key: provider}) => provider === item.value);
            setExternalPickerConfig(newOption);
        }

        return true;
    };

    return (
        <div className={clsx('flexRow_center', 'alignCenter', styles.picker_header)}>
            <Typography variant="body" weight="bold">{t('jcontent:label.contentEditor.selectorTypes.picker.dialog.dropdown.label')}</Typography>
            <Dropdown
                className={clsx(styles.picker_header_selector)}
                data={dropdownData}
                label={label}
                value={externalPickerConfig?.key}
                icon={iconName && toIconComponent(iconName)}
                data-sel-role="picker-selector"
                onChange={(evt, item) => handleOnChange(item)}
            />
        </div>
    );
};

PickerSelector.propTypes = {
    availableExternalPickerConfigs: PropTypes.arrayOf(ExternalPickerConfigPropsTypes),
    externalPickerConfig: ExternalPickerConfigPropsTypes,
    setExternalPickerConfig: PropTypes.func
};
