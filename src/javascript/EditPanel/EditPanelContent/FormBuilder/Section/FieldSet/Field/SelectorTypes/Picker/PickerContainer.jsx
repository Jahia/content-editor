import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'formik';
import {useTranslation} from 'react-i18next';
import {FieldPropTypes} from '~/EditPanel/FormDefinitions/FormData.proptypes';
import {ProgressOverlay} from '@jahia/react-material';
import {Picker as PickerInput} from '~/DesignSystem/Picker';
import {extractConfigs} from './Picker.utils';
import {PickerDialog} from './PickerDialog';

const PickerCmp = ({field, value, id, editorContext, formik, setActionContext}) => {
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
            <PickerInput
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
                id={id}
                nodeTreeConfigs={nodeTreeConfigs}
                t={t}
                formik={formik}
                field={field}
                pickerConfig={pickerConfig}
            />
        </>
    );
};

PickerCmp.propTypes = {
    editorContext: PropTypes.object.isRequired,
    value: PropTypes.string,
    field: FieldPropTypes.isRequired,
    formik: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    setActionContext: PropTypes.func.isRequired
};

export const Picker = connect(PickerCmp);
Picker.displayName = 'Picker';
