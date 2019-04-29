import React, {useState} from 'react';
import PropTypes from 'prop-types';
import ImageIcon from '@material-ui/icons/Image';
import {Typography} from '@jahia/ds-mui-theme';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import {Modal} from './modal/modal';

import {compose} from 'react-apollo';
import {withStyles} from '@material-ui/core';
import {translate} from 'react-i18next';

const styles = theme => ({
    addImage: {
        width: '100%',
        height: theme.spacing.unit * 9,
        backgroundColor: theme.palette.ui.omega,
        // TODO border: `1px ${theme.palette.ui.zeta} dashed`,
        border: '1px #C1C8D5 dashed',
        fontSize: '0.875rem',
        borderRadius: '2px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&:hover': {
            // TODO border: `1px ${theme.palette.ui.zeta} dashed`,
            border: '1px #C1C8D5 solid'
        },
        '& svg': {
            marginRight: theme.spacing.unit,
            color: theme.palette.ui.beta
        }
    }
});

function Transition(props) {
    return <Slide direction="up" {...props}/>;
}

export const MediaPickerEmptyCmp = ({classes, t}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button className={classes.addImage} type="button" onClick={() => setIsOpen(true)}>
                <ImageIcon/>
                <Typography variant="omega" color="beta">
                    {t(
                    'content-editor:label.contentEditor.edit.fields.imagePicker.addImage'
                )}
                </Typography>
            </button>
            <Dialog
             fullScreen
             open={isOpen}
             TransitionComponent={Transition}
            >
                <Modal onCloseDialog={() => setIsOpen(false)}/>
            </Dialog>
        </>
    );
};

MediaPickerEmptyCmp.defaultProps = {
    classes: {}
};

MediaPickerEmptyCmp.propTypes = {
    /* Field: PropTypes.shape({
        data: PropTypes.shape({
            value: PropTypes.string
        }),
        imageData: PropTypes.shape({
            url: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            size: PropTypes.arrayOf(PropTypes.number).isRequired,
            weight: PropTypes.number.isRequired,
            type: PropTypes.string.isRequired
        })
    }).isRequired,
    id: PropTypes.string.isRequired, */
    t: PropTypes.func.isRequired,
    classes: PropTypes.object
};

export const MediaPickerEmpty = compose(
    translate(),
    withStyles(styles)
)(MediaPickerEmptyCmp);
