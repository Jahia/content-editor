import React, {useCallback, useState} from 'react';
import {EditPanelDialogConfirmation} from '~/EditPanel/EditPanelDialogConfirmation';
import {useContentEditorConfigContext, useContentEditorContext} from '~/ContentEditor.context';
import * as PropTypes from 'prop-types';
import {Constants} from '~/ContentEditor.constants';
import {useKeydownListener} from '~/utils/useKeydownListener';
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

    const dirty = formik.dirty || Object.keys(i18nContext).length > 0;

    const goBack = () => {
        if (dirty) {
            setOpen(true);
        } else {
            envProps.back();
        }
    };

    return (
        <>
            <EditPanelDialogConfirmation
                isOpen={open}
                actionCallback={envProps.back}
                onCloseDialog={onCloseDialog}
            />
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

const goBackAction = {
    component: GoBack
};

export default goBackAction;
