import React, {useCallback, useState} from 'react';
import {CloseConfirmationDialog} from '../../CloseConfirmationDialog';
import {useContentEditorConfigContext, useContentEditorContext} from '../../contexts';
import * as PropTypes from 'prop-types';
import {Constants} from '../../ContentEditor.constants';
import {isDirty, useKeydownListener} from '../../utils';
import {useFormikContext} from 'formik';

export const GoBack = ({render: Render, ...otherProps}) => {
    const {envProps} = useContentEditorConfigContext();
    const [open, setOpen] = useState(false);
    const formik = useFormikContext();
    const {i18nContext} = useContentEditorContext();
    const onCloseDialog = useCallback(() => setOpen(false), [setOpen]);

    useKeydownListener(event => {
        if (event.keyCode === Constants.keyCodes.esc && !envProps.disabledBack()) {
            goBack();
        }
    });

    const dirty = isDirty(formik, i18nContext);

    const goBack = () => {
        if (dirty && envProps.confirmationDialog) {
            formik.validateForm();
            setOpen(true);
        } else {
            envProps.back();
        }
    };

    return (
        <>
            { envProps.confirmationDialog && (
                <CloseConfirmationDialog
                    isOpen={open}
                    actionCallback={envProps.back}
                    onCloseDialog={onCloseDialog}
                />
            )}
            <Render
                enabled={!envProps.disabledBack()}
                onClick={() => goBack()}
                {...otherProps}
            />
        </>
    );
};

GoBack.propTypes = {
    render: PropTypes.func.isRequired
};

export const goBackAction = {
    component: GoBack
};
