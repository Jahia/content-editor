import React, {useState} from 'react';
import {openEngineTab} from './engineTabs.utils';
import {EditPanelDialogConfirmation} from '~/EditPanel/EditPanelDialogConfirmation';
import PropTypes from 'prop-types';

export const OpenEngineTabs = ({context, render: Render}) => {
    const {nodeData, formik, tabs} = context;

    const [open, setOpen] = useState(false);

    return (
        <>
            <EditPanelDialogConfirmation
                open={open}
                titleKey="content-editor:label.contentEditor.edit.action.goBack.title"
                formik={formik}
                actionCallback={() => {
                    formik.resetForm(formik.values);
                    formik.dirty = false;
                    openEngineTab(nodeData, tabs);
                }}
                onCloseDialog={() => setOpen(false)}
            />
            <Render context={{
                ...context,
                onClick: () => {
                    if (formik.dirty) {
                        setOpen(true);
                    } else {
                        openEngineTab(nodeData, tabs);
                    }
                }
            }}/>
        </>
    );
};

OpenEngineTabs.propTypes = {
    context: PropTypes.object.isRequired,
    render: PropTypes.func.isRequired
};

const OpenEngineTabsAction = {
    component: OpenEngineTabs
};

export default OpenEngineTabsAction;
