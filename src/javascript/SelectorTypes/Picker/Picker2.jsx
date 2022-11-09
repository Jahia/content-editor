import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {FieldPropTypes} from '~/ContentEditor.proptypes';
import {ReferenceCard} from '~/DesignSystem/ReferenceCard';
import {mergeDeep, set, toArray} from './Picker2.utils';
import {PickerDialog} from './PickerDialog/PickerDialog2';
import {DisplayAction} from '@jahia/ui-extender';
import {getButtonRenderer} from '~/utils';
import {LoaderOverlay} from '~/DesignSystem/LoaderOverlay';
import styles from './Picker2.scss';
import {Button} from '@jahia/moonstone';
import {FieldContextProvider} from '~/contexts/FieldContext';
import {DefaultPickerConfig} from '~/SelectorTypes/Picker/configs/DefaultPickerConfig';
import {useFormikContext} from 'formik';
import {OrderableValue} from '~/DesignSystem/OrderableValue/OrderableValue';

const ButtonRenderer = getButtonRenderer({labelStyle: 'none', defaultButtonProps: {variant: 'ghost'}});

export const Picker2 = ({field, value, editorContext, inputContext, onChange, onBlur}) => {
    const {t} = useTranslation('content-editor');
    const parsedOptions = {};
    field.selectorOptions.forEach(option => {
        set(parsedOptions, option.name, option.value || option.values);
    });

    // Handle value constraints if they are available, note that this overrides default config of each picker.
    if (field.valueConstraints.length) {
        inputContext.selectorType.pickerConfig = {
            ...inputContext.selectorType.pickerConfig,
            selectableTypesTable: field.valueConstraints.map(vc => vc.value.string)
        };
    }

    const pickerConfig = mergeDeep({}, DefaultPickerConfig, inputContext.selectorType.pickerConfig, parsedOptions.pickerConfig);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const {setFieldValue, setFieldTouched} = useFormikContext();
    const {
        fieldData, error, loading, notFound
    } = pickerConfig.pickerInput.usePickerInputData(value && toArray(value));

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

    inputContext.actionContext = {
        open: setDialogOpen,
        fieldData,
        editorContext,
        onChange: newValue => onChange(newValue),
        onBlur: onBlur
    };

    const onItemSelection = data => {
        setDialogOpen(false);
        const itemSelectionAdapter = pickerConfig.pickerInput.itemSelectionAdapter || (data => {
            const uuids = (data || []).map(d => d?.uuid);
            return field.multiple ? uuids : uuids[0];
        });
        onChange(itemSelectionAdapter(data));
        setTimeout(() => onBlur(), 0);
    };

    const onFieldRemove = index => {
        let updatedValues = [...fieldData];
        updatedValues.splice(index, 1);
        onItemSelection(updatedValues);
    };

    const onValueReorder = (droppedName, index) => {
        let childrenWithoutDropped = [];
        let droppedChild = null;
        let droppedItemIndex = -1;
        value.forEach((item, index) => {
            if (droppedItemIndex === -1 && droppedName === `${field.name}[${index}]`) {
                droppedChild = item;
                droppedItemIndex = index;
            } else {
                childrenWithoutDropped.push(item);
            }
        });

        if (droppedChild !== null && droppedItemIndex >= 0) {
            // +1 for droppedItemIndex here as index parameter from handleReOrder is starting from 1 instead of 0
            const spliceIndex = ((droppedItemIndex + 1) < index) ? index - 1 : index;
            const newValue = [...childrenWithoutDropped.slice(0, spliceIndex), droppedChild, ...childrenWithoutDropped.slice(spliceIndex, childrenWithoutDropped.length)];
            setFieldValue(field.name, newValue);
            setFieldTouched(field.name, true, false);
        }
    };

    return (
        <div className="flexFluid flexRow_nowrap alignCenter">
            {field.multiple ?
                <div className="flexFluid">
                    {fieldData && fieldData.length > 0 && fieldData.map((fieldVal, index) => {
                        return (
                            <OrderableValue
                                key={`${field.name}_${fieldVal.name}`}
                                field={field}
                                fieldVal={fieldVal}
                                index={index}
                                onValueReorder={onValueReorder}
                                onFieldRemove={onFieldRemove}/>
                        );
                    })}
                    {!field.readOnly &&
                        <Button className={styles.addButton}
                                data-sel-action="addField"
                                variant="outlined"
                                size="big"
                                label={t('content-editor:label.contentEditor.edit.fields.actions.add')}
                                onClick={() => setDialogOpen(!isDialogOpen)}
                        />}
                </div> :
                <>
                    <ReferenceCard
                        isReadOnly={field.readOnly}
                        emptyLabel={t((error || notFound) ? pickerConfig.pickerInput.notFoundLabel : pickerConfig.pickerInput.emptyLabel)}
                        emptyIcon={pickerConfig.pickerInput.emptyIcon}
                        labelledBy={`${field.name}-label`}
                        fieldData={fieldData && fieldData[0]}
                        onClick={() => setDialogOpen(!isDialogOpen)}
                    />
                    {inputContext.displayActions && value && (
                        <DisplayAction
                            actionKey="content-editor/field/Picker"
                            value={value}
                            field={field}
                            inputContext={inputContext}
                            render={ButtonRenderer}
                        />
                    )}
                </>}

            <FieldContextProvider field={field}>
                <PickerDialog
                    isOpen={isDialogOpen}
                    editorContext={editorContext}
                    pickerConfig={pickerConfig}
                    initialSelectedItem={fieldData && fieldData.map(f => f.path)}
                    accordionItemProps={mergeDeep({}, pickerConfig.accordionItem, parsedOptions.accordionItem)}
                    onClose={() => setDialogOpen(false)}
                    onItemSelection={onItemSelection}
                />
            </FieldContextProvider>

        </div>
    );
};

Picker2.propTypes = {
    editorContext: PropTypes.object.isRequired,
    value: PropTypes.string,
    field: FieldPropTypes.isRequired,
    inputContext: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired
};

Picker2.displayName = 'Picker2';
