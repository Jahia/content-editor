import React from 'react';
import PropTypes from 'prop-types';
import EditPanelFullscreen from "~/EditPanel/EditPanelFullscreen";
import EditPanelCompact from "~/EditPanel/EditPanelCompact";
import {useContentEditorConfigContext} from "~/ContentEditor.context";

const EditPanel = React.memo(props => {
    const {envProps} = useContentEditorConfigContext()
    return (envProps.isModal && !envProps.isFullscreen) ? <EditPanelCompact {...props}/> : <EditPanelFullscreen {...props}/>
});

EditPanel.propTypes = {
    title: PropTypes.string.isRequired
};

EditPanel.displayName = 'EditPanel';
export default EditPanel;
