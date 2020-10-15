import React, {useState} from 'react';
import {EditPanelDialogConfirmation} from '~/EditPanel/EditPanelDialogConfirmation';
import {useContentEditorConfigContext} from '~/ContentEditor.context';
import * as PropTypes from 'prop-types';

const GoBack = ({render: Render, isDirty, formik, uuid, operator, componentProps, ...otherProps}) => {
    const {envProps} = useContentEditorConfigContext();
    const [open, setOpen] = useState(false);
    const executeGoBackAction = overridedStoredLocation => {
        if (envProps.unregisterListeners) {
            envProps.unregisterListeners();
        }

        envProps.back(uuid, operator, overridedStoredLocation);
    };

    return (
        <>
            <EditPanelDialogConfirmation
                open={open}
                titleKey="content-editor:label.contentEditor.edit.action.goBack.title"
                formik={formik}
                actionCallback={overridedStoredLocation => executeGoBackAction(overridedStoredLocation)}
                onCloseDialog={() => setOpen(false)}
            />
            <Render
                {...otherProps}
                componentProps={{
                    ...componentProps,
                    disabled: envProps.disabledBack()
                }}
                onClick={() => {
                    if (formik) {
                        if (isDirty) {
                            setOpen(true);
                        } else {
                            executeGoBackAction();
                        }
                    }
                }}/>
        </>
    );
};

GoBack.propTypes = {
    actionContext: PropTypes.object.isRequired,
    componentProps: PropTypes.object.isRequired,
    formik: PropTypes.object.isRequired,
    operator: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
    isDirty: PropTypes.bool.isRequired,
    render: PropTypes.func.isRequired
};

const goBackAction = {
    component: GoBack
};

export default goBackAction;
