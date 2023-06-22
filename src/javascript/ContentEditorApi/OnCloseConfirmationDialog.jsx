import React, {useEffect, useState} from 'react';
import {CloseConfirmationDialog} from '~/CloseConfirmationDialog';
import * as PropTypes from 'prop-types';
import {useFormikContext} from 'formik';
import {useContentEditorContext} from '~/contexts/ContentEditor';
import {isDirty} from '~/utils';

import rison from 'rison-node';
import {useLocation} from 'react-router-dom';

function decode(hash) {
    let values = {};
    try {
        values = hash ? rison.decode_uri(hash.substring(1)) : {};
    } catch {
        //
    }

    return values;
}

export const OnCloseConfirmationDialog = ({deleteEditorConfig, openDialog}) => {
    const [confirmationConfig, setConfirmationConfig] = useState(false);
    const formik = useFormikContext();
    const {i18nContext} = useContentEditorContext();
    const dirty = isDirty(formik, i18nContext);

    useEffect(() => {
        openDialog.current = () => {
            if (dirty) {
                formik.validateForm();
                setConfirmationConfig(true);
            } else {
                deleteEditorConfig();
            }
        };
    });

    const location = useLocation();
    useEffect(() => {
        // Read hash to set/unset editors
        const {contentEditor} = decode(location.hash);
        if (contentEditor === undefined) {
            if (dirty) {
                formik.validateForm();
                setConfirmationConfig(true);
            } else {
                deleteEditorConfig();
            }
        }
    }, [deleteEditorConfig, dirty, formik, location.hash]);

    return confirmationConfig && (
        <CloseConfirmationDialog
            isOpen
            actionCallback={() => deleteEditorConfig()}
            onCloseDialog={() => setConfirmationConfig(false)}
        />
    );
};

OnCloseConfirmationDialog.propTypes = {
    deleteEditorConfig: PropTypes.func.isRequired,
    openDialog: PropTypes.object.isRequired
};
