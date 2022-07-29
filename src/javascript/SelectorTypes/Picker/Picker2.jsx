import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {FieldPropTypes} from '~/ContentEditor.proptypes';
import {ReferenceCard} from '~/DesignSystem/ReferenceCard';
import {mergeDeep, set} from './Picker2.utils';
import {PickerDialog} from './PickerDialog/PickerDialog2';
import {DisplayAction} from '@jahia/ui-extender';
import {getButtonRenderer} from '~/utils';
import {LoaderOverlay} from '~/DesignSystem/LoaderOverlay';
import {cePickerClearSelection} from '~/SelectorTypes/Picker/Picker2.redux';
import {useDispatch} from 'react-redux';

const ButtonRenderer = getButtonRenderer({labelStyle: 'none', defaultButtonProps: {variant: 'ghost'}});

export const Picker2 = ({field, value, editorContext, inputContext, onChange, onBlur}) => {
    const {t} = useTranslation('content-editor');
    const dispatch = useDispatch();
    const parsedOptions = {};
    field.selectorOptions.forEach(option => {
        set(parsedOptions, option.name, option.value || option.values);
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
    } = pickerConfig.pickerInput.usePickerInputData(value, editorContext);

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

    const onItemSelection = path => {
        setDialogOpen(false);
        onChange(path);
        onBlur();
    };

    const toggleOpen = open => {
        if (!open) {
            dispatch(cePickerClearSelection());
        }

        setDialogOpen(open);
    };

    return (
        <div className="flexFluid flexRow_nowrap alignCenter">
            <ReferenceCard
                isReadOnly={field.readOnly}
                emptyLabel={t((error || notFound) ? pickerConfig.pickerInput.notFoundLabel : pickerConfig.pickerInput.emptyLabel)}
                emptyIcon={pickerConfig.pickerInput.emptyIcon}
                labelledBy={`${field.name}-label`}
                fieldData={fieldData}
                onClick={() => toggleOpen(!isDialogOpen)}
            />
            {inputContext.displayActions && value && (
                <DisplayAction
                    actionKey={field.multiple ? 'content-editor/field/MultiplePicker' : 'content-editor/field/Picker'}
                    value={value}
                    field={field}
                    inputContext={inputContext}
                    render={ButtonRenderer}
                />
            )}
            <PickerDialog
                isOpen={isDialogOpen}
                editorContext={editorContext}
                inputContext={inputContext}
                pickerConfig={pickerConfig}
                initialSelectedItem={fieldData && fieldData.path}
                accordionItemProps={parsedOptions.accordionItem}
                onClose={() => toggleOpen(false)}
                onItemSelection={onItemSelection}
            />
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
