import React, {useCallback, useState} from 'react';
import {CloseConfirmationDialog} from '~/CloseConfirmationDialog';
import {useContentEditorConfigContext, useContentEditorContext} from '~/contexts';
import * as PropTypes from 'prop-types';
import {Constants} from '~/ContentEditor.constants';
import {isDirty, useKeydownListener} from '~/utils';
import {useFormikContext} from 'formik';

export const GoBack = ({render: Render, ...otherProps}) => {
    const {confirmationDialog, updateEditorConfig} = useContentEditorConfigContext();
    const [open, setOpen] = useState(false);
    const formik = useFormikContext();
    const {i18nContext} = useContentEditorContext();
    const onCloseDialog = useCallback(() => setOpen(false), [setOpen]);

    useKeydownListener(event => {
        if (event.keyCode === Constants.keyCodes.esc) {
            goBack();
        }
    });

    const dirty = isDirty(formik, i18nContext);

    const goBack = () => {
        if (dirty && confirmationDialog) {
            formik.validateForm();
            setOpen(true);
        } else {
            updateEditorConfig({closed: true});
        }
    };

    return (
        <>
            { confirmationDialog && (
                <CloseConfirmationDialog
                    isOpen={open}
                    actionCallback={() => updateEditorConfig({closed: true})}
                    onCloseDialog={onCloseDialog}
                />
            )}
            <Render
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
