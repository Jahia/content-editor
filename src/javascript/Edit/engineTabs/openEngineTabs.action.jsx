import React, {useState} from 'react';
import {openEngineTab} from './engineTabs.utils';
import {EditPanelDialogConfirmation} from '~/EditPanel/EditPanelDialogConfirmation';
import PropTypes from 'prop-types';

export const OpenEngineTabs = props => {
    const {nodeData, formik, tabs, render: Render} = props;

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
            <Render {...props}
                    onClick={() => {
                        if (formik.dirty) {
                            setOpen(true);
                        } else {
                            openEngineTab(nodeData, tabs);
                        }
                    }}/>
        </>
    );
};

OpenEngineTabs.propTypes = {
    render: PropTypes.func.isRequired,
    nodeData: PropTypes.object.isRequired,
    formik: PropTypes.object.isRequired,
    tabs: PropTypes.object.isRequired
};

const OpenEngineTabsAction = {
    component: OpenEngineTabs
};

export default OpenEngineTabsAction;
