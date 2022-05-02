import React, {useCallback, useState} from 'react';
import {EditPanelDialogConfirmation} from '~/EditPanel/EditPanelDialogConfirmation';
import {useContentEditorConfigContext} from '~/ContentEditor.context';
import * as PropTypes from 'prop-types';
import {Constants} from '~/ContentEditor.constants';
import {useKeydownListener} from '~/utils/getKeydownListener';

export const GoBack = ({render: Render, componentProps, ...otherProps}) => {
    const {envProps} = useContentEditorConfigContext();
    // Const formik = useFormikContext();
    const [open, setOpen] = useState(false);

    const onCloseDialog = useCallback(() => setOpen(false), [setOpen]);

    useKeydownListener(event => {
        if (event.keyCode === Constants.keyCodes.esc && !envProps.disabledBack()) {
            goBack();
        }
    });

    const goBack = () => {
        if (envProps.dirtyRef.current) {
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
                enabled
                {...otherProps}
                componentProps={{
                    ...componentProps,
                    disabled: envProps.disabledBack()
                }}
                onClick={() => goBack()}/>
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
