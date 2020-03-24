import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import WorkInProgressDialog from './WorkInProgressDialog/WorkInProgressDialog';
import {ComponentRendererContext} from '@jahia/ui-extender';

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
                                isOpen: true,
                                isWipContent: false, // TODO handle in BACKLOG-12845
                                onCloseDialog: closeDialog,
                                onApply: () => { // TODO handle in BACKLOG-12845
                                    closeDialog();
                                }
                            });
                    } else {
                        // TODO BACKLOG-12845 set the content as WIP
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
