import React from 'react';
import PropTypes from 'prop-types';
import {EditPanelFullscreen} from './EditPanelFullscreen';
import {EditPanelCompact} from './EditPanelCompact';
import {useContentEditorConfigContext} from '~/contexts';
import {I18nContextHandler} from './I18nContextHandler';

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

