import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {FieldPropTypes} from '~/ContentEditor.proptypes';
import {ReferenceCard} from '~/DesignSystem/ReferenceCard';
import {PickerDialog} from './PickerDialog';
import {DisplayAction} from '@jahia/ui-extender';
import {getButtonRenderer} from '~/utils';
import {LoaderOverlay} from '~/DesignSystem/LoaderOverlay';
import {getNodeTreeConfigs} from './getNodeTreeConfigs';

const ButtonRenderer = getButtonRenderer({labelStyle: 'none', defaultButtonProps: {variant: 'ghost'}});

export const Picker = ({field, value, editorContext, inputContext, onChange, onBlur}) => {
    const {t} = useTranslation('content-editor');
    const pickerConfig = inputContext.selectorType.pickerConfig;
    const nodeTreeConfigs = getNodeTreeConfigs(pickerConfig, editorContext.site, editorContext.siteInfo.displayName, t);

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

    const onItemSelection = data => {
        setDialogOpen(false);
        onChange(pickerConfig.PickerDialog.itemSelectionAdapter(data));
        onBlur();
    };

    return (
        <div className="flexFluid flexRow_nowrap alignCenter">
            <ReferenceCard
                isReadOnly={field.readOnly}
                emptyLabel={t((error || notFound) ? pickerConfig.pickerInput.notFoundLabel : pickerConfig.pickerInput.emptyLabel)}
                emptyIcon={pickerConfig.pickerInput.emptyIcon}
                labelledBy={`${field.name}-label`}
                fieldData={fieldData}
                onClick={() => setDialogOpen(!isDialogOpen)}
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
                setIsOpen={setDialogOpen}
                editorContext={editorContext}
                initialSelectedItem={fieldData && fieldData.path}
                nodeTreeConfigs={nodeTreeConfigs}
                lang={editorContext.lang}
                uilang={editorContext.uilang}
                siteKey={editorContext.site}
                t={t}
                field={field}
                pickerConfig={pickerConfig}
                onItemSelection={onItemSelection}
            />
        </div>
    );
};

Picker.propTypes = {
    editorContext: PropTypes.object.isRequired,
    value: PropTypes.string,
    field: FieldPropTypes.isRequired,
    inputContext: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired
};

Picker.displayName = 'Picker';
