import {useTranslation} from 'react-i18next';
import {useFormikContext} from 'formik';
import {Constants} from '~/ContentEditor.constants';
import {Button} from '@jahia/moonstone';
import React from 'react';
import * as PropTypes from 'prop-types';

export const SaveButton = ({onCloseDialog, actionCallback}) => {
    const {t} = useTranslation('content-editor');
    const formik = useFormikContext();
    const handleSave = () => {
        onCloseDialog();

        // Override default submit callback to execute the confirmation callback instead
        formik.setFieldValue(Constants.systemFields.OVERRIDE_SUBMIT_CALLBACK, actionCallback, false);
        formik.submitForm()
            .then(() => {
                formik.resetForm({values: formik.values});
            });
    };

    let disabled = false;

    const errors = formik.errors;
    if (errors) {
        disabled = Object.keys(errors).length > 0;
    }

    return (
        <Button
            color="accent"
            size="big"
            isDisabled={disabled}
            label={t('content-editor:label.contentEditor.edit.action.goBack.btnSave')}
            onClick={handleSave}
        />
    );
};

SaveButton.propTypes = {
    actionCallback: PropTypes.func.isRequired,
    onCloseDialog: PropTypes.func.isRequired
};
