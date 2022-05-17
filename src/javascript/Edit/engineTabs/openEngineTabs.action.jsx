import React, {useState} from 'react';
import {openEngineTab} from './engineTabs.utils';
import {EditPanelDialogConfirmation} from '~/EditPanel/EditPanelDialogConfirmation';
import PropTypes from 'prop-types';
import {useFormikContext} from 'formik';
import {useContentEditorContext} from '~/ContentEditor.context';

export const OpenEngineTabs = ({tabs, render: Render, ...otherProps}) => {
    const [open, setOpen] = useState(false);
    const formik = useFormikContext();
    const {nodeData, i18nContext, setI18nContext} = useContentEditorContext();

    const dirty = formik.dirty || Object.keys(i18nContext).length > 0;

    return (
        <>
            <EditPanelDialogConfirmation
                isOpen={open}
                actionCallback={({discard}) => {
                    if (discard) {
                        setI18nContext({});
                        formik.resetForm();
                    }

                    openEngineTab(nodeData, tabs);
                }}
                onCloseDialog={() => setOpen(false)}
            />
            <Render {...otherProps}
                    onClick={() => {
                        if (dirty) {
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
    tabs: PropTypes.array.isRequired
};

const OpenEngineTabsAction = {
    component: OpenEngineTabs
};

export default OpenEngineTabsAction;
