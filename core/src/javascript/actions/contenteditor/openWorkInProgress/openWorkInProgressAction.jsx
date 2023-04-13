import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {WorkInProgressDialog} from './WorkInProgressDialog';
import {ComponentRendererContext} from '@jahia/ui-extender';
import {Constants} from '~/ContentEditor.constants';
import {useFormikContext} from 'formik';
import {useContentEditorContext} from '~/contexts/ContentEditor';

export const OpenWorkInProgressModal = ({render: Render, ...otherProps}) => {
    const componentRenderer = useContext(ComponentRendererContext);
    const {nodeData, lang, siteInfo} = useContentEditorContext();
    const formik = useFormikContext();

    const closeDialog = () => {
        componentRenderer.destroy('WorkInProgressDialog');
    };

    const wipInfo = formik.values[Constants.wip.fieldName];
    const singleLanguage = siteInfo.languages.length === 1;
    const isMarkAsWIP = singleLanguage &&
        (wipInfo.status === Constants.wip.status.ALL_CONTENT ||
            wipInfo.status === Constants.wip.status.LANGUAGES);
    const buttonLabelKind = isMarkAsWIP ? 'unmark' : 'mark';
    const buttonLabel = `content-editor:label.contentEditor.edit.action.workInProgress.label.${buttonLabelKind}`;

    const openModal = () => {
        componentRenderer.render(
            'WorkInProgressDialog',
            WorkInProgressDialog,
            {
                wipInfo,
                currentLanguage: lang,
                isOpen: true,
                languages: siteInfo.languages,
                onCloseDialog: closeDialog,
                onApply: newWipInfo => {
                    formik.setFieldValue(Constants.wip.fieldName, newWipInfo);
                    closeDialog();
                }
            });
    };

    const switchButton = () => {
        const status = isMarkAsWIP ? Constants.wip.status.DISABLED : Constants.wip.status.ALL_CONTENT;
        formik.setFieldValue(Constants.wip.fieldName, {status, languages: []});
    };

    return (
        <>
            <Render
                {...otherProps}
                buttonLabel={buttonLabel}
                enabled={!nodeData.lockedAndCannotBeEdited && nodeData.hasWritePermission && !Constants.wip.notAvailableFor.includes(nodeData.primaryNodeType.name)}
                onClick={singleLanguage ? switchButton : openModal}/>
        </>
    );
};

OpenWorkInProgressModal.propTypes = {
    render: PropTypes.func.isRequired
};

export const openWorkInProgressAction = {
    component: OpenWorkInProgressModal
};
