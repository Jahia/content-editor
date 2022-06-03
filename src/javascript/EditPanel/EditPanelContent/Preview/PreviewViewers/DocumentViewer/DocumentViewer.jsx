import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core';
import {FileIcon} from '@jahia/icons';
import classNames from 'classnames';
import {LoaderOverlay} from '~/DesignSystem/LoaderOverlay';

const styles = theme => ({
    container: {
        paddingTop: (theme.spacing.unit * 3) + 'px',
        paddingBottom: (theme.spacing.unit * 3) + 'px',
        margin: '0 auto',
        '&&&& div': {
            height: 'auto'
        },
        '& video': {
            maxHeight: '100%',
            maxWidth: '550px'
        },
        '& div.document-container': {
            maxWidth: '550px'
        },
        '&$fullScreen': {
            maxWidth: '100%',
            '& video': {
                maxWidth: '100%'
            },
            '& div.document-container': {
                maxWidth: '100%'
            },
            '& $icon': {
                width: '90%',
                margin: 'auto'
            }
        }
    },
    fullScreen: {},
    icon: {
        fontSize: '160px',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.common.white
    }
});

const FileViewer = React.lazy(() => import(/* webpackChunkName: "reactFileViewer" */ 'react-file-viewer'));

export class DocumentViewer extends React.Component {
    constructor(props) {
        super(props);
        this.renderViewer = this.renderViewer.bind(this);
    }

    renderViewer() {
        let {file, type, classes} = this.props;
        switch (type) {
            case 'docx':
            case 'doc':
            case 'avi':
            case 'mp4':
            case 'video':
                return <FileViewer fileType={type} filePath={file}/>;
            default:
                return (
                    <FileIcon filename={file} color="disabled" classes={{root: classes.icon}}/>
                );
        }
    }

    render() {
        let {classes, fullScreen} = this.props;
        return (
            <React.Suspense fallback={<LoaderOverlay/>}>
                <div className={classNames(classes.container, fullScreen && classes.fullScreen)}>
                    {this.renderViewer()}
                </div>
            </React.Suspense>
        );
    }
}

DocumentViewer.propTypes = {
    classes: PropTypes.object.isRequired,
    file: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    // eslint-disable-next-line react/boolean-prop-naming
    fullScreen: PropTypes.bool
};

DocumentViewer.defaultProps = {
    fullScreen: false
};

export default withStyles(styles)(DocumentViewer);
