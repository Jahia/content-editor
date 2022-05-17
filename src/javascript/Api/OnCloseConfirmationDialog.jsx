import React, {useEffect, useState} from 'react';
import EditPanelDialogConfirmation from '~/EditPanel/EditPanelDialogConfirmation/EditPanelDialogConfirmation';
import * as PropTypes from 'prop-types';

export const OnCloseConfirmationDialog = ({setEditorConfig, openDialog, dirtyRef}) => {
    const [confirmationConfig, setConfirmationConfig] = useState(false);

    useEffect(() => {
        openDialog.current = () => (dirtyRef.current) ? setConfirmationConfig(true) : setEditorConfig(false);
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
    openDialog: PropTypes.object.isRequired,
    dirtyRef: PropTypes.object.isRequired
};
