import React from 'react';
import PropTypes from 'prop-types';
import {FieldPropTypes} from '~/ContentEditor.proptypes';
import {Dropdown, toIconComponent} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
import {DisplayAction} from '@jahia/ui-extender';
import {getButtonRenderer} from '~/utils';

const ButtonRenderer = getButtonRenderer({labelStyle: 'none', defaultButtonProps: {variant: 'ghost'}});

const getIconOfField = (field, value) => {
    return field.valueConstraints
        .find(item => item.value.string === value)
        ?.properties
        ?.find(property => property.name === 'iconStart')?.value;
};

const getLabel = (field, value, t) => {
    const valueConstraint = field.valueConstraints.find(item => item.value.string === value);
    if (valueConstraint) {
        return valueConstraint.displayValueKey ? t(valueConstraint.displayValueKey) : valueConstraint.displayValue;
    }

    return '';
};

export const SingleSelect = ({field, value, id, inputContext, onChange, onBlur}) => {
    const {t} = useTranslation();
    inputContext.actionContext = {
        onChange,
        onBlur
    };

    const {readOnly, label, iconName, dropdownData} = React.useMemo(() => ({
        readOnly: field.readOnly || field.valueConstraints.length === 0,
        label: getLabel(field, value, t),
        iconName: getIconOfField(field, value) || '',
        dropdownData: field.valueConstraints.length > 0 ? field.valueConstraints.map(item => {
            const image = item.properties?.find(property => property.name === 'image')?.value;
            const description = item.properties?.find(property => property.name === 'description')?.value;
            const iconStart = item.properties?.find(property => property.name === 'iconStart')?.value;
            const iconEnd = item.properties?.find(property => property.name === 'iconEnd')?.value;
            return {
                label: item.displayValueKey ? t(item.displayValueKey) : item.displayValue,
                value: item.value.string,
                description: t(description),
                iconStart: iconStart && toIconComponent(iconStart),
                iconEnd: iconEnd && toIconComponent(iconEnd),
                image: image && <img src={image} alt={item.displayValue}/>,
                attributes: {
                    'data-value': item.value.string
                }
            };
        }) : [{label: '', value: ''}]
    }), [t, field, value]);

    React.useEffect(() => {
        // Reset value if constraints doesnt contains the actual value.
        if (value && field.valueConstraints.find(v => v.value.string === value) === undefined) {
            onChange(null);
        }
    }, [value, field.valueConstraints, onChange]);

    return (
        <div className="flexFluid flexRow alignCenter">
            <Dropdown
                className="flexFluid"
                name={field.name}
                id={'select-' + id}
                imageSize="small"
                data-sel-content-editor-select-readonly={readOnly}
                isDisabled={readOnly}
                maxWidth="100%"
                variant="outlined"
                size="medium"
                data={dropdownData}
                label={label}
                value={value}
                icon={iconName && toIconComponent(iconName)}
                hasSearch={dropdownData && dropdownData.length >= 5}
                searchEmptyText={t('content-editor:label.contentEditor.global.noResult')}
                onChange={(evt, item) => {
                    if (item.value !== value) {
                        onChange(item.value);
                    }
                }}
                onBlur={onBlur}
            />
            {inputContext.displayActions && (
                <DisplayAction actionKey="content-editor/field/Choicelist"
                               field={field}
                               inputContext={inputContext}
                               render={ButtonRenderer}
                />
            )}
        </div>
    );
};

SingleSelect.defaultProps = {
    value: null
};

SingleSelect.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    field: FieldPropTypes.isRequired,
    inputContext: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired
};

