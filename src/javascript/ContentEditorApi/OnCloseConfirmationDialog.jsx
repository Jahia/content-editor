import React, {useEffect, useState} from 'react';
import {CloseConfirmationDialog} from '~/CloseConfirmationDialog';
import * as PropTypes from 'prop-types';
import {useFormikContext} from 'formik';
import {useContentEditorContext} from '~/contexts/ContentEditor';
import {isDirty} from '~/utils';

export const OnCloseConfirmationDialog = ({setEditorConfig, openDialog}) => {
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
                setEditorConfig(false);
            }
        };
    });

    return confirmationConfig && (
        <CloseConfirmationDialog
            isOpen
            actionCallback={() => setEditorConfig(false)}
            onCloseDialog={() => setConfirmationConfig(false)}
        />
    );
};

OnCloseConfirmationDialog.propTypes = {
    setEditorConfig: PropTypes.func.isRequired,
    openDialog: PropTypes.object.isRequired
};
