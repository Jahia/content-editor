import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import WorkInProgressDialog from './WorkInProgressDialog/WorkInProgressDialog';
import {ComponentRendererContext} from '@jahia/ui-extender';
import {Constants} from '~/ContentEditor.constants';

export const OpenWorkInProgressModal = ({context, render: Render, ...props}) => {
    const componentRenderer = useContext(ComponentRendererContext);

    const {siteInfo} = context;
    const closeDialog = () => {
        componentRenderer.destroy('WorkInProgressDialog');
    };

    return (
        <>
            <Render
                {...props}
                {...(context.displayActionProps || {})}
                context={{
                    ...context,
                    onClick: () => {
                        if (siteInfo.languages.length > 1) {
                            componentRenderer.render(
                                'WorkInProgressDialog',
                                WorkInProgressDialog,
                                {
                                    language: context.language,
                                    isOpen: true,
                                    languages: siteInfo.languages,
                                    onCloseDialog: closeDialog,
                                    wipInfo: context.formik.values[Constants.wip.fieldName],
                                    onApply: newWipInfo => {
                                        context.formik.setFieldValue(Constants.wip.fieldName, newWipInfo);
                                        closeDialog();
                                    }
                                });
                        } else {
                            context.formik.setFieldValue({status: Constants.wip.status.ALL_CONTENT});
                        }
                    }
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
