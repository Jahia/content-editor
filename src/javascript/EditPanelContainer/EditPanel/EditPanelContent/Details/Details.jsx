import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {ContentEditorContext} from '../../../../ContentEditor.context';
import {InfoPanel} from '../../../../DesignSystem/InfoPanel';
import {withStyles} from '@material-ui/core';
import {compose} from 'react-apollo';
import {translate} from 'react-i18next';

const styles = theme => ({
    container: {
        padding: theme.spacing.unit * 2,
        backgroundColor: theme.palette.ui.alpha,
        overflowY: 'auto'
    }
});

export const DetailsCmp = ({classes, t}) => {
    const editorContext = useContext(ContentEditorContext);

    return (
        <section data-sel-details-section className={classes.container}>
            <InfoPanel panelTitle={t('content-editor:label.contentEditor.details.details')} infos={editorContext.details}/>
            <InfoPanel panelTitle={t('content-editor:label.contentEditor.details.technicalInfo')} variant="oneColumn" infos={editorContext.technicalInfo}/>
        </section>
    );
};

DetailsCmp.propTypes = {
    classes: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired
};

export const Details = compose(
    withStyles(styles),
    translate()
)(DetailsCmp);

Details.displayName = 'Details';
