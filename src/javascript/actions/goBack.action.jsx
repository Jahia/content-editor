import React, {useCallback, useState} from 'react';
import {EditPanelDialogConfirmation} from '~/EditPanel/EditPanelDialogConfirmation';
import {useContentEditorConfigContext, useContentEditorContext} from '~/ContentEditor.context';
import * as PropTypes from 'prop-types';
import {Constants} from '~/ContentEditor.constants';
import {useFormikContext} from 'formik';
import {useKeydownListener} from '~/utils/getKeydownListener';

const GoBack = ({render: Render, componentProps, ...otherProps}) => {
    const {nodeData, mode} = useContentEditorContext();
    const {envProps} = useContentEditorConfigContext();
    const formik = useFormikContext();
    const [open, setOpen] = useState(false);
    const executeGoBackAction = useCallback((overridedStoredLocation, byPassEventTriggers) => {
        if (envProps.unregisterListeners) {
            envProps.unregisterListeners();
        }

        const operator = (mode === Constants.routes.baseEditRoute ? Constants.operators.update : Constants.operators.create);

        envProps.back(nodeData.uuid, operator, overridedStoredLocation, byPassEventTriggers);
    }, [envProps, mode, nodeData.uuid]);

    const onCloseDialog = useCallback(() => setOpen(false), [setOpen]);

    useKeydownListener(event => {
        if (event.keyCode === 27) {
            goBack();
        }
    }, formik.dirty);

    const goBack = () => {
        if (formik.dirty) {
            setOpen(true);
        } else {
            executeGoBackAction(undefined, true);
        }
    };

    return (
        <>
            <EditPanelDialogConfirmation
                isOpen={open}
                titleKey="content-editor:label.contentEditor.edit.action.goBack.title"
                actionCallback={executeGoBackAction}
                onCloseDialog={onCloseDialog}
            />
            <Render
                {...otherProps}
                componentProps={{
                    ...componentProps,
                    disabled: envProps.disabledBack()
                }}
                onClick={goBack}/>
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
