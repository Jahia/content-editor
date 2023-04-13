import React from 'react';
import PropTypes from 'prop-types';
import {EditPanelFullscreen} from './EditPanelFullscreen';
import {useContentEditorConfigContext} from '../../contexts';
import {I18nContextHandler} from './I18nContextHandler';

export const EditPanel = React.memo(props => {
    const {envProps} = useContentEditorConfigContext();
    const Layout = envProps.layout || EditPanelFullscreen;
    return (
        <>
            <Layout {...props}/>
            {envProps.confirmationDialog}
            <I18nContextHandler/>
        </>
    );
});

EditPanel.propTypes = {
    title: PropTypes.string.isRequired
};
