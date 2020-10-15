import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import WorkInProgressDialog from './WorkInProgressDialog/WorkInProgressDialog';
import {ComponentRendererContext} from '@jahia/ui-extender';
import {Constants} from '~/ContentEditor.constants';

export const OpenWorkInProgressModal = ({siteInfo, nodeData, formik, language, render: Render, ...otherProps}) => {
    const componentRenderer = useContext(ComponentRendererContext);

    const closeDialog = () => {
        componentRenderer.destroy('WorkInProgressDialog');
    };

    const wipInfo = formik.values[Constants.wip.fieldName];
    const singleLanguage = siteInfo.languages.length === 1;
    const isMarkAsWIP = singleLanguage && wipInfo.status === Constants.wip.status.ALL_CONTENT;
    const buttonLabelKind = isMarkAsWIP ? 'unmark' : 'mark';
    const buttonLabel = `content-editor:label.contentEditor.edit.action.workInProgress.label.${buttonLabelKind}`;

    const openModal = () => {
        componentRenderer.render(
            'WorkInProgressDialog',
            WorkInProgressDialog,
            {
                wipInfo,
                currentLanguage: language,
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
                enabled={nodeData.hasWritePermission && !Constants.wip.notAvailableFor.includes(nodeData.primaryNodeType.name)}
                onClick={singleLanguage ? switchButton : openModal}/>
        </>
    );
};

OpenWorkInProgressModal.propTypes = {
    siteInfo: PropTypes.object.isRequired,
    nodeData: PropTypes.object.isRequired,
    language: PropTypes.string.isRequired,
    formik: PropTypes.object.isRequired,
    render: PropTypes.func.isRequired
};

const OpenWorkInProgressModalAction = {
    component: OpenWorkInProgressModal
};

export default OpenWorkInProgressModalAction;
