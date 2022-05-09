import React, {useCallback, useState} from 'react';
import {EditPanelDialogConfirmation} from '~/EditPanel/EditPanelDialogConfirmation';
import {useContentEditorConfigContext} from '~/ContentEditor.context';
import * as PropTypes from 'prop-types';
import {Constants} from '~/ContentEditor.constants';
import {useFormikContext} from 'formik';
import {useKeydownListener} from '~/utils/getKeydownListener';

export const GoBack = ({render: Render, ...otherProps}) => {
    const {envProps} = useContentEditorConfigContext();
    const formik = useFormikContext();
    const [open, setOpen] = useState(false);

    const onCloseDialog = useCallback(() => setOpen(false), [setOpen]);

    useKeydownListener((event, formik) => {
        if (event.keyCode === Constants.keyCodes.esc && !envProps.disabledBack()) {
            goBack(formik);
        }
    });

    const goBack = formik => {
        if (formik.dirty) {
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
                onClick={() => goBack(formik)}
                {...otherProps}
            />
        </>
    );
};

GoBack.propTypes = {
    componentProps: PropTypes.object.isRequired,
    render: PropTypes.func.isRequired
};

const goBackAction = {
    component: GoBack
};

export default goBackAction;
