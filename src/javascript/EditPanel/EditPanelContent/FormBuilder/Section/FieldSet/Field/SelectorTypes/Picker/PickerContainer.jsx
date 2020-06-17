import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'formik';
import {useTranslation} from 'react-i18next';
import {FieldPropTypes} from '~/FormDefinitions/FormData.proptypes';
import {ProgressOverlay} from '@jahia/react-material';
import {ReferenceCard} from '~/DesignSystem/ReferenceCard';
import {extractConfigs} from './Picker.utils';
import {PickerDialog} from './PickerDialog';

const PickerCmp = ({field, value, editorContext, setActionContext, onChange, onInit}) => {
    const {t} = useTranslation();
    const {pickerConfig, nodeTreeConfigs} = extractConfigs(field, editorContext, t);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const {fieldData, error, loading} = pickerConfig.picker.pickerInput.usePickerInputData(value, editorContext);

    // Init data
    useEffect(() => {
        if (fieldData) {
            onInit(_buildOnChangeData(fieldData));
        }

        if (!field.multiple) {
            setActionContext(prevActionContext => ({
                open: setDialogOpen,
                noAction: !value,
                fieldData,
                editorContext,
                contextHasChange:
                    (prevActionContext.fieldData && prevActionContext.fieldData.path) !== (fieldData && fieldData.path),
                onChange: newValue => onChange(newValue)
            }));
        }
    }, [fieldData, setDialogOpen]);

    if (error) {
        const message = t(
            'jcontent:label.jcontent.error.queryingContent',
            {details: error.message ? error.message : ''}
        );
        return <>{message}</>;
    }

    if (loading) {
        return <ProgressOverlay/>;
    }

    const _buildOnChangeData = data => {
        if (data) {
            return {
                path: data.path,
                uuid: data.id ? data.id : data.uuid,
                name: data.name
            };
        }
    };

    const transformOnChangePreviousValue = () => {
        return _buildOnChangeData(fieldData);
    };

    const transformOnChangeCurrentValue = data => {
        return _buildOnChangeData(data);
    };

    const transformBeforeSave = data => {
        return pickerConfig.picker.PickerDialog.itemSelectionAdapter(data);
    };

    const onItemSelection = data => {
        setDialogOpen(false);
        onChange(data, transformOnChangeCurrentValue, transformOnChangePreviousValue, transformBeforeSave);
    };

    return (
        <>
            <ReferenceCard
                readOnly={field.readOnly}
                emptyLabel={t(pickerConfig.picker.pickerInput.emptyLabel)}
                emptyIcon={pickerConfig.picker.pickerInput.emptyIcon}
                labelledBy={`${field.name}-label`}
                fieldData={fieldData}
                onClick={() => setDialogOpen(!isDialogOpen)}
            />
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
        </>
    );
};

PickerCmp.propTypes = {
    editorContext: PropTypes.object.isRequired,
    value: PropTypes.string,
    field: FieldPropTypes.isRequired,
    setActionContext: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onInit: PropTypes.func.isRequired
};

export const Picker = connect(PickerCmp);
Picker.displayName = 'Picker';
