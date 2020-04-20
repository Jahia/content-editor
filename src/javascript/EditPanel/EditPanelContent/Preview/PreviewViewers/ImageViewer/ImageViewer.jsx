import React from 'react';
import PropTypes from 'prop-types';
import {CardMedia, withStyles} from '@material-ui/core';
import {withTranslation} from 'react-i18next';
import {compose} from 'recompose';
import classNames from 'classnames';

const styles = theme => ({
    container: {
        flex: '1 1 0%',
        backgroundSize: 'contain',
        width: '100%',
        maxWidth: '550px',
        paddingTop: (theme.spacing.unit * 3) + 'px',
        paddingBottom: (theme.spacing.unit * 3) + 'px',
        margin: '0 auto',
        '&$fullScreen': {
            maxWidth: '90%'
        }
    },
    fullScreen: {}
});

export class ImageViewer extends React.Component {
    render() {
        let {classes, file, fullScreen, className} = this.props;

        return (
            <CardMedia className={classNames(classes.container, className, fullScreen && classes.fullScreen)}
                       data-cm-role="preview-image"
                       image={file}
            />
        );
    }
}

ImageViewer.defaultProps = {
    className: '',
    fullScreen: false
};

ImageViewer.propTypes = {
    classes: PropTypes.object.isRequired,
    file: PropTypes.string.isRequired,
    // eslint-disable-next-line react/boolean-prop-naming
    fullScreen: PropTypes.bool,
    className: PropTypes.string
};

export default compose(
    withTranslation(),
    withStyles(styles)
)(ImageViewer);
