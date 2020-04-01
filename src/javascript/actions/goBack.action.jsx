import React, {useState} from 'react';
import {EditPanelDialogConfirmation} from '~/EditPanel/EditPanelDialogConfirmation';
import {useContentEditorConfigContext} from '~/ContentEditor.context';
import {useLockedEditorContext} from '~/Lock/LockedEditor.context';
import {useContentEditorHistory} from '~/ContentEditorHistory';
import * as PropTypes from 'prop-types';

const GoBack = ({context, render: Render}) => {
    const contentEditorConfigContext = useContentEditorConfigContext();
    const {hasHistory, unRegisterBlockListener} = useContentEditorHistory();
    const lockedEditorContext = useLockedEditorContext();
    const [open, setOpen] = useState(false);
    const executeGoBackAction = () => {
        unRegisterBlockListener();
        if (lockedEditorContext.unlockEditor) {
            lockedEditorContext.unlockEditor(() => {
                contentEditorConfigContext.envProps.back();
            });
        } else {
            contentEditorConfigContext.envProps.back();
        }
    };

    return (
        <>
            <EditPanelDialogConfirmation
                open={open}
                titleKey="content-editor:label.contentEditor.edit.action.goBack.title"
                formik={context.formik}
                actionCallback={() => executeGoBackAction()}
                onCloseDialog={() => setOpen(false)}
            />
            <Render
                context={{
                    ...context,
                    componentProps: {
                     disabled: !hasHistory()
                    },
                    onClick: () => {
                        if (context.formik) {
                            if (context.formik.dirty) {
                                setOpen(true);
                            } else {
                                executeGoBackAction();
                            }
                        }
                    }
                }}/>
        </>
    );
};

GoBack.propTypes = {
    context: PropTypes.object.isRequired,
    render: PropTypes.func.isRequired
};

const goBackAction = {
    component: GoBack
};

export default goBackAction;
