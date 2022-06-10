import React, {useEffect, useState} from 'react';
import {EditPanelDialogConfirmation} from '~/EditPanelDialogConfirmation';
import * as PropTypes from 'prop-types';
import {useFormikContext} from 'formik';
import {useContentEditorContext} from '~/ContentEditor.context';

export const OnCloseConfirmationDialog = ({setEditorConfig, openDialog}) => {
    const [confirmationConfig, setConfirmationConfig] = useState(false);
    const formik = useFormikContext();
    const {i18nContext} = useContentEditorContext();
    const dirty = formik.dirty || Object.keys(i18nContext).length > 0;

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
        <EditPanelDialogConfirmation
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
