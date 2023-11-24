import React from 'react';
import {useTranslation} from 'react-i18next';
import {Dropdown, toIconComponent} from '@jahia/moonstone';
import {PickerComponent} from './PickerComponent';
import {withStyles} from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {FieldPropTypes} from '~/ContentEditor.proptypes';
import {DisplayAction} from '@jahia/ui-extender';
import {getButtonRenderer} from '~/utils';
const ButtonRenderer = getButtonRenderer({labelStyle: 'none', defaultButtonProps: {variant: 'ghost'}});

const styles = () => ({
    selector: {
        marginBottom: 'var(--spacing-nano)'
    }
});

// Create a dropdown list with by default "jahia", then get from the config the list of DAM to enable <name><selectorType>
const SelectorCmp = ({classes, ...props}) => {
    const {damSelectorConfigs, valueChoiceListConfig, field, id, inputContext, value, onChange, onBlur} = props;
    const {t} = useTranslation();

    const [managedValue, setManagedValue] = React.useState({config: valueChoiceListConfig, value});

    // Const [historicalChoiceListValue, setHistoricalChoiceListValue] = React.useState((valueChoiceListConfig && valueChoiceListConfig.key) ? {[valueChoiceListConfig.key]:value} : {})
    const [historicalChoiceListValue, setHistoricalChoiceListValue] = React.useState({});

    React.useEffect(() => {
        setManagedValue({config: valueChoiceListConfig, value});
    }, [value, valueChoiceListConfig]);

    React.useEffect(() => {
        // Clear historic
        if (!value) {
            setHistoricalChoiceListValue({});
        }
    }, [value]);

    const {readOnly, label, iconName, dropdownData} = React.useMemo(() => ({
        readOnly: field.readOnly /* || field.valueConstraints.length === 0 */,
        label: t(managedValue.config?.label || 'dam-selector:label.dropDown.emptyLabel'),
        iconName: managedValue.config?.icon || '',
        dropdownData: damSelectorConfigs.length > 0 ? damSelectorConfigs.map(({key: picker, label, icon, description}) => {
            // Const image = item.properties?.find(property => property.name === 'image')?.value;
            // const description = item.properties?.find(property => property.name === 'description')?.value;
            const iconStart = icon;
            // Const iconEnd = item.properties?.find(property => property.name === 'iconEnd')?.value;
            return {
                label: t(label),
                value: picker,
                description: t(description),
                iconStart: iconStart && toIconComponent(iconStart),
                // IconEnd: iconEnd && toIconComponent(iconEnd),
                // image: image && <img src={image} alt={item.displayValue}/>,
                attributes: {
                    'data-value': picker
                }
            };
        }) : [{label: '', value: ''}]
    }), [t, field, managedValue, damSelectorConfigs]);

    const handleChange = item => {
        if (item.value !== managedValue.config?.key) {
            const changedChoiceListConfig = damSelectorConfigs.find(({key: picker}) => picker === item.value);
            const histoEntry = managedValue.config && managedValue.config.key ? {[managedValue.config.key]: managedValue.value} : {};

            setManagedValue({
                config: changedChoiceListConfig,
                value: historicalChoiceListValue[changedChoiceListConfig.key] || null
            });

            setHistoricalChoiceListValue({...historicalChoiceListValue, ...histoEntry});
        }
    };

    return (
        <>
            <div className={clsx('flexFluid flexRow alignCenter', classes.selector)}>
                <Dropdown
                    className="flexFluid"
                    name={field.name}
                    id={'select-' + id}
                    // ImageSize="small"
                    isDisabled={readOnly}
                    maxWidth="100%"
                    variant="outlined"
                    size="medium"
                    data={dropdownData}
                    label={label}
                    value={managedValue.config?.key}
                    icon={iconName && toIconComponent(iconName)}
                    hasSearch={dropdownData && dropdownData.length >= 5}
                    searchEmptyText={t('content-editor:label.contentEditor.global.noResult')}
                    onChange={(evt, item) => handleChange(item)}
                    onBlur={onBlur}
                />
                {inputContext.displayActions && value && (
                <DisplayAction {...{
                    actionKey: 'content-editor/field/DamSelector',
                    value,
                    field,
                    inputContext: {
                        ...inputContext,
                        actionContext: {
                            onChange,
                            onBlur
                        }
                    },
                    render: ButtonRenderer
                }}/>
                )}
            </div>
            <div className="flexFluid flexRow alignCenter">
                <PickerComponent {...{
                    ...props,
                    choiceListConfig: managedValue.config,
                    value: managedValue.value,
                    inputContext: {
                        ...inputContext,
                        displayActions: false
                    }
                }}/>
            </div>
        </>
    );
};

SelectorCmp.propTypes = {
    classes: PropTypes.object.isRequired,
    field: FieldPropTypes.isRequired,
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    inputContext: PropTypes.object.isRequired,
    damSelectorConfigs: PropTypes.array.isRequired,
    valueChoiceListConfig: PropTypes.object.isRequired
};

export const Selector = withStyles(styles)(SelectorCmp);
