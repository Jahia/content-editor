import React from 'react';
import PropTypes from 'prop-types';
import {EditPanelFullscreen} from '~/EditPanel/EditPanelFullscreen';
import {EditPanelCompact} from '~/EditPanel/EditPanelCompact';
import {useContentEditorConfigContext} from '~/ContentEditor.context';
import {I18nContextHandler} from '~/EditPanel/I18nContextHandler';

export const EditPanel = React.memo(props => {
    const {envProps} = useContentEditorConfigContext();
    return (
        <>
            {(envProps.isModal && !envProps.isFullscreen) ? <EditPanelCompact {...props}/> : <EditPanelFullscreen {...props}/>}
            {envProps.confirmationDialog}
            <I18nContextHandler/>
        </>
    );
});

EditPanel.propTypes = {
    title: PropTypes.string.isRequired
};

