import React, {useState} from 'react';
import {openEngineTab} from './engineTabs.utils';
import {CloseConfirmationDialog} from '~/CloseConfirmationDialog';
import PropTypes from 'prop-types';
import {useFormikContext} from 'formik';
import {useContentEditorContext} from '~/contexts/ContentEditor';
import {isDirty} from '~/utils';

export const OpenEngineTabs = ({tabs, render: Render, ...otherProps}) => {
    const [open, setOpen] = useState(false);
    const formik = useFormikContext();
    const {nodeData, i18nContext, resetI18nContext} = useContentEditorContext();

    const dirty = isDirty(formik, i18nContext);

    return (
        <>
            <CloseConfirmationDialog
                isOpen={open}
                actionCallback={({discard}) => {
                    if (discard) {
                        resetI18nContext();
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

export const openEngineTabsAction = {
    component: OpenEngineTabs
};
