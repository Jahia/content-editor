import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {connect, FastField} from 'formik';
import {useTranslation} from 'react-i18next';
import {FieldPropTypes} from '~/FormDefinitions/FormData.proptypes';
import {ProgressOverlay} from '@jahia/react-material';
import {ReferenceCard} from '~/DesignSystem/ReferenceCard';
import {extractConfigs} from './Picker.utils';
import {PickerDialog} from './PickerDialog';

const PickerCmp = ({field, value, id, editorContext, setActionContext}) => {
    const {t} = useTranslation();
    const {pickerConfig, nodeTreeConfigs} = extractConfigs(field, editorContext, t);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const {fieldData, error, loading} = pickerConfig.picker.pickerInput.usePickerInputData(value, editorContext);

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

    if (!field.multiple) {
        setActionContext(prevActionContext => ({
            open: setDialogOpen,
            noAction: !value,
            fieldData,
            editorContext,
            contextHasChange:
                (prevActionContext.fieldData && prevActionContext.fieldData.path) !== (fieldData && fieldData.path)
        }));
    }

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
            <FastField shouldUpdate={() => true}
                       render={({form: {setFieldValue, setFieldTouched}}) => {
                           const onItemSelection = data => {
                               setFieldValue(
                                   id,
                                   pickerConfig.picker.PickerDialog.itemSelectionAdapter(data),
                                   true
                               );
                               setDialogOpen(false);
                               setFieldTouched(field.name, field.multiple ? [true] : true);
                           };

                           return (
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
                           );
                       }}
            />
        </>
    );
};

PickerCmp.propTypes = {
    editorContext: PropTypes.object.isRequired,
    value: PropTypes.string,
    field: FieldPropTypes.isRequired,
    id: PropTypes.string.isRequired,
    setActionContext: PropTypes.func.isRequired
};

export const Picker = connect(PickerCmp);
Picker.displayName = 'Picker';
