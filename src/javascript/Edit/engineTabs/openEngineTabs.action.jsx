import React, {useState} from 'react';
import {openEngineTab} from './engineTabs.utils';
import {EditPanelDialogConfirmation} from '~/EditPanel/EditPanelDialogConfirmation';
import PropTypes from 'prop-types';
import {useFormikContext} from 'formik';
import {useContentEditorContext} from '~/ContentEditor.context';

export const OpenEngineTabs = ({tabs, render: Render, ...otherProps}) => {
    const [open, setOpen] = useState(false);
    const formik = useFormikContext();
    const {nodeData} = useContentEditorContext();

    return (
        <>
            <EditPanelDialogConfirmation
                isOpen={open}
                actionCallback={({discard}) => {
                    if (discard) {
                        formik.resetForm();
                    }

                    openEngineTab(nodeData, tabs);
                }}
                onCloseDialog={() => setOpen(false)}
            />
            <Render {...otherProps}
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
    tabs: PropTypes.array.isRequired
};

const OpenEngineTabsAction = {
    component: OpenEngineTabs
};

export default OpenEngineTabsAction;
