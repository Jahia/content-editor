import React, {useEffect, useState} from 'react';
import {CloseConfirmationDialog} from '~/CloseConfirmationDialog';
import * as PropTypes from 'prop-types';
import {useFormikContext} from 'formik';
import {useContentEditorContext} from '~/contexts/ContentEditor';
import {isDirty} from '~/utils';

export const OnCloseConfirmationDialog = ({deleteEditorConfig, openDialog}) => {
    const [confirmationConfig, setConfirmationConfig] = useState(false);
    const formik = useFormikContext();
    const {i18nContext} = useContentEditorContext();
    const dirty = isDirty(formik, i18nContext);

    useEffect(() => {
        openDialog.current = () => {
            if (dirty) {
                formik.validateForm();
                setConfirmationConfig(true);
            } else {
                deleteEditorConfig();
            }
        };
    });

    return confirmationConfig && (
        <CloseConfirmationDialog
            isOpen
            actionCallback={() => deleteEditorConfig()}
            onCloseDialog={() => setConfirmationConfig(false)}
        />
    );
};

OnCloseConfirmationDialog.propTypes = {
    deleteEditorConfig: PropTypes.func.isRequired,
    openDialog: PropTypes.object.isRequired
};
