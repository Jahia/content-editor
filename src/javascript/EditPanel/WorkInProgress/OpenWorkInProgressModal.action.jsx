import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import WorkInProgressDialog from './WorkInProgressDialog/WorkInProgressDialog';
import {ComponentRendererContext} from '@jahia/ui-extender';
import {Constants} from '~/ContentEditor.constants';

export const OpenWorkInProgressModal = ({context, render: Render, ...props}) => {
    const componentRenderer = useContext(ComponentRendererContext);

    const {siteInfo, nodeData} = context;

    const closeDialog = () => {
        componentRenderer.destroy('WorkInProgressDialog');
    };

    const wipInfo = context.formik.values[Constants.wip.fieldName];
    const singleLanguage = siteInfo.languages.length === 1;
    const isMarkAsWIP = singleLanguage && wipInfo.status === Constants.wip.status.ALL_CONTENT;
    const buttonLabelKind = isMarkAsWIP ? 'unmark' : 'mark';
    context.buttonLabel = `content-editor:label.contentEditor.edit.action.workInProgress.label.${buttonLabelKind}`;

    const openModal = () => {
        componentRenderer.render(
            'WorkInProgressDialog',
            WorkInProgressDialog,
            {
                wipInfo,
                currentLanguage: context.language,
                isOpen: true,
                languages: siteInfo.languages,
                onCloseDialog: closeDialog,
                onApply: newWipInfo => {
                    context.formik.setFieldValue(Constants.wip.fieldName, newWipInfo);
                    closeDialog();
                }
            });
    };

    const switchButton = () => {
        const status = isMarkAsWIP ? Constants.wip.status.DISABLED : Constants.wip.status.ALL_CONTENT;
        context.formik.setFieldValue(Constants.wip.fieldName, {status, languages: []});
    };

    return (
        <>
            <Render
                {...props}
                {...(context.displayActionProps || {})}
                context={{
                    ...context,
                    enabled: context.nodeData.hasWritePermission && !Constants.wip.notAvailableFor.includes(nodeData.primaryNodeType.name),
                    onClick: singleLanguage ? switchButton : openModal
                }}/>
        </>
    );
};

OpenWorkInProgressModal.propTypes = {
    context: PropTypes.object.isRequired,
    render: PropTypes.func.isRequired
};

const OpenWorkInProgressModalAction = {
    component: OpenWorkInProgressModal
};

export default OpenWorkInProgressModalAction;
