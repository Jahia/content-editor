import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core';

const styles = () => ({
});

export const ModalCmp = ({onCloseDialog}) => {
    return (
        <>
            <button type="button" onClick={onCloseDialog}>Close the Dialog here !</button>
        </>
    );
};

/* ModalCmp.defaultProps = {
    classes: {}
}; */

ModalCmp.propTypes = {
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
    id: PropTypes.string.isRequired,
    classes: PropTypes.object
 */
    onCloseDialog: PropTypes.func.isRequired
};

export const Modal = withStyles(styles)(ModalCmp);
