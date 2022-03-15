import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {FieldPropTypes} from '~/FormDefinitions/FormData.proptypes';
import {ProgressOverlay} from '@jahia/react-material';
import {ReferenceCard} from '~/DesignSystem/ReferenceCard';
import {extractConfigs} from './Picker.utils';
import {PickerDialog} from './PickerDialog';
import {DisplayAction} from '@jahia/ui-extender';
import {getButtonRenderer} from '../../utils/getButtonRenderer';

const ButtonRenderer = getButtonRenderer({labelStyle: 'none', defaultButtonProps: {variant: 'ghost'}});

const PickerCmp = ({field, value, editorContext, inputContext, onChange}) => {
    const {t} = useTranslation('content-editor');
    const {pickerConfig, nodeTreeConfigs} = extractConfigs(field, editorContext, t);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const {
        fieldData,
        error,
        loading,
        notFound
    } = pickerConfig.picker.pickerInput.usePickerInputData(value, editorContext);

    if (error) {
        const message = t(
            'jcontent:label.jcontent.error.queryingContent',
            {details: error.message ? error.message : ''}
        );

        console.warn(message);
    }

    if (loading) {
        return <ProgressOverlay/>;
    }

    inputContext.actionContext = {
        open: setDialogOpen,
        fieldData,
        editorContext,
        onChange: newValue => onChange(newValue)
    };

    const onItemSelection = data => {
        setDialogOpen(false);
        onChange(pickerConfig.picker.PickerDialog.itemSelectionAdapter(data));
    };

    return (
        <div className="flexFluid flexRow alignCenter">
            <ReferenceCard
                isReadOnly={field.readOnly}
                emptyLabel={t((error || notFound) ? pickerConfig.picker.pickerInput.notFoundLabel : pickerConfig.picker.pickerInput.emptyLabel)}
                emptyIcon={pickerConfig.picker.pickerInput.emptyIcon}
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

PickerCmp.propTypes = {
    editorContext: PropTypes.object.isRequired,
    value: PropTypes.string,
    field: FieldPropTypes.isRequired,
    inputContext: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

export const Picker = PickerCmp;
Picker.displayName = 'Picker';
