import React from 'react';
import {LinearProgress, withStyles} from '@material-ui/core';
import {usePublicationInfoContext} from './PublicationInfo.context';
import {compose} from 'react-apollo';
import * as PropTypes from 'prop-types';

const styles = theme => ({
    root: {
        height: 5,
        marginTop: '-5px',
        backgroundColor: theme.palette.ui.zeta
    },
    bar: {
        backgroundColor: theme.palette.brand.beta
    }
});

export const PublicationInfoProgress = ({classes}) => {
    const {publicationInfoPolling} = usePublicationInfoContext();
    return (
        <>
            {publicationInfoPolling && <LinearProgress classes={classes}/>}
        </>
    );
};

PublicationInfoProgress.propTypes = {
    classes: PropTypes.object.isRequired
};

export default compose(
    withStyles(styles)
)(PublicationInfoProgress);
