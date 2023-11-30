import React from 'react';
import {useTranslation} from 'react-i18next';
import {Dropdown, toIconComponent, Typography} from '@jahia/moonstone';
import styles from './PickerSelector.scss';
import PropTypes from 'prop-types';
import {configPropType} from '~/SelectorTypes/Picker/configs/configPropType';
import clsx from 'clsx';

// Create a dropdown list with by default "jahia", then get from the config the list of DAM to enable <name><selectorType>
export const PickerSelector = ({
    pickerConfigsEnabled,
    initialOption,
    isOpen,
    onClose,
    initialSelectedItem,
    site,
    pickerConfig,
    lang,
    isMultiple,
    accordionItemProps,
    onItemSelection,
    ...props
}) => {
    const {t} = useTranslation();

    const [currentOption, setCurrentOption] = React.useState({...initialOption});
    // Const [prevSelectedItem, setPrevSelectedItem] = React.useState({[initialOption.config?.key]:initialSelectedItem});

    const {label, iconName, dropdownData} = React.useMemo(() => ({
        label: t(currentOption.pickerDialog.label),
        iconName: currentOption.pickerDialog?.icon || '',
        dropdownData: pickerConfigsEnabled.length > 0 ? pickerConfigsEnabled.map(({key: provider, pickerDialog: {label, description, icon}}) => {
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
    }), [t, currentOption, pickerConfigsEnabled]);

    const handleOnChange = item => {
        if (item.value !== currentOption?.key) {
            const newOption = pickerConfigsEnabled.find(({key: provider}) => provider === item.value);
            // Const configHistoryEntry = currentOption.config && currentOption.config.key ? {[currentOption.config.key]: currentOption.value} : {};

            setCurrentOption({...newOption});

            // PrevSelectedItem({...historicalChoiceListValue, ...histoEntry});
        }

        return true;
    };

    return (
        // Maybe you don't need picker-wrapper
        <div className={clsx('flexCol', styles.picker_wrapper)}>
            <div className={clsx('flexRow_center', 'alignCenter', styles.picker_header)} {...props}>
                <Typography variant="body" weight="bold">{t('content-editor:label.contentEditor.selectorTypes.picker.dialog.dropdown.label')}</Typography>
                <Dropdown
                    className={clsx(styles.picker_header_selector)}
                    data={dropdownData}
                    label={label}
                    value={currentOption.key}
                    icon={iconName && toIconComponent(iconName)}
                    onChange={(evt, item) => handleOnChange(item)}
                />
            </div>
            <div className={clsx('flexFluid', styles.picker_body)}>
                {pickerConfigsEnabled.map(({key, pickerDialog: {cmp: Component}}) => {
                    return (
                        <div key={key} className={currentOption.key === key ? 'isVisible' : null}>
                            <Component {...{
                                isOpen,
                                site,
                                pickerConfig,
                                initialSelectedItem: key === 'default' ? initialSelectedItem && initialSelectedItem.map(f => f.path) : initialSelectedItem && initialSelectedItem.map(f => f.uuid),
                                accordionItemProps,
                                lang,
                                isMultiple,
                                onClose,
                                onItemSelection
                            }}/>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const PickerConfigPropsTypes = PropTypes.shape({
    key: PropTypes.string.isRequired,
    pickerDialog: PropTypes.shape({
        cmp: PropTypes.elementType.isRequired,
        label: PropTypes.string.isRequired,
        description: PropTypes.string,
        icon: PropTypes.string
    })
});

PickerSelector.propTypes = {
    pickerConfigsEnabled: PropTypes.arrayOf(PickerConfigPropsTypes),
    initialOption: PickerConfigPropsTypes,
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
