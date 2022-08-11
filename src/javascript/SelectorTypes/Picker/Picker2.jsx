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
import {
    cePickerClearSelection, cePickerMode,
    cePickerPreSearchModeMemo,
    cePickerSetSearchTerm
} from '~/SelectorTypes/Picker/Picker2.redux';
import {useDispatch} from 'react-redux';
import styles from './Picker2.scss';
import {Button, Close} from '@jahia/moonstone';
import {FieldContextProvider} from '~/contexts/FieldContext';
import {batchActions} from 'redux-batched-actions';

const ButtonRenderer = getButtonRenderer({labelStyle: 'none', defaultButtonProps: {variant: 'ghost'}});

export const Picker2 = ({field, value, editorContext, inputContext, onChange, onBlur}) => {
    const {t} = useTranslation('content-editor');
    const dispatch = useDispatch();
    const parsedOptions = {};
    field.selectorOptions.forEach(option => {
        set(parsedOptions, option.name, option.value || option.values);
    });

    // Handle value constraints if they are available, note that this overrides default config of each picker.
    field.valueConstraints.forEach((vc, index) => {
        if (index === 0) {
            inputContext.selectorType.pickerConfig.selectableTypesTable = [];
        }

        inputContext.selectorType.pickerConfig.selectableTypesTable.push(vc.value.string);
    });

    const pickerConfig = parsedOptions.pickerConfig ?
        mergeDeep({}, inputContext.selectorType.pickerConfig, parsedOptions.pickerConfig) :
        inputContext.selectorType.pickerConfig;
    const [isDialogOpen, setDialogOpen] = useState(false);
    const {
        fieldData,
        error,
        loading,
        notFound
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

    const toggleOpen = open => {
        if (!open) {
            dispatch(batchActions([
                cePickerClearSelection(),
                cePickerSetSearchTerm('')
            ]));
        }

        setDialogOpen(open);
    };

    return (
        <div className="flexFluid flexRow_nowrap alignCenter">
            {field.multiple ?
                <div className="flexFluid">
                    {
                        fieldData && fieldData.length > 0 && fieldData.map((fieldVal, index) => {
                            const name = `${field.name}[${index}]`;
                            return (
                                <div key={name}
                                     className={styles.fieldComponentContainer}
                                     data-sel-content-editor-multiple-generic-field={name}
                                     data-sel-content-editor-field-readonly={field.readOnly}
                                >
                                    <ReferenceCard isReadOnly="true" labelledBy={`${name}-label`} fieldData={fieldVal}/>
                                    {!field.readOnly &&
                                        <Button variant="ghost"
                                                data-sel-action={`removeField_${index}`}
                                                aria-label={t('content-editor:label.contentEditor.edit.fields.actions.clear')}
                                                icon={<Close/>}
                                                onClick={() => onFieldRemove(index)}
                                        />}
                                </div>
                            );
                        })
                    }
                    {!field.readOnly &&
                        <Button className={styles.addButton}
                                data-sel-action="addField"
                                variant="outlined"
                                size="big"
                                label={t('content-editor:label.contentEditor.edit.fields.actions.add')}
                                onClick={() => toggleOpen(!isDialogOpen)}
                        />}
                </div> :
                <>
                    <ReferenceCard
                        isReadOnly={field.readOnly}
                        emptyLabel={t((error || notFound) ? pickerConfig.pickerInput.notFoundLabel : pickerConfig.pickerInput.emptyLabel)}
                        emptyIcon={pickerConfig.pickerInput.emptyIcon}
                        labelledBy={`${field.name}-label`}
                        fieldData={fieldData && fieldData[0]}
                        onClick={() => toggleOpen(!isDialogOpen)}
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
                    accordionItemProps={parsedOptions.accordionItem}
                    onClose={() => toggleOpen(false)}
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
