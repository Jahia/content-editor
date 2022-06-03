import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core';

const styles = theme => ({
    textareaContainer: {
        display: 'flex',
        flexGrow: 1
    },
    textarea: {
        backgroundColor: theme.palette.ui.epsilon,
        border: `1px solid ${theme.palette.ui.omega}`,
        padding: theme.spacing.unit,
        borderRadius: '3px',
        color: theme.palette.font.alpha,
        fontFamily: 'Nunito Sans',
        fontStyle: 'normal',
        fontWeight: 600,
        fontSize: '13px',
        lineHeight: '24px',
        flex: '0 1 100%',
        resize: 'vertical',
        '&:focus:not(:read-only)': {
            outline: 'none',
            border: `1px solid ${theme.palette.brand.beta}`
        },
        '&:hover:not(:focus):not($disabled):not($error):not($readOnly)': {
            border: `1px solid ${theme.palette.ui.zeta}`
        }
    },
    readOnly: {
        outline: 'none',
        background: theme.palette.ui.alpha,
        border: `1px solid ${theme.palette.ui.alpha}`
    },
    disabled: {
        backgroundColor: theme.palette.ui.alpha,
        opacity: 0.54,
        color: theme.palette.font.gamma
    },
});

const TextAreaCmp = ({
    classes,
    classNames,
    rows,
    disabled,
    readOnly,
    ...otherProps
}) => {
    return (
        <div className={`${classes.textareaContainer} ${classNames.container}`}>
            <textarea
                className={`${classes.textarea} 
                            ${disabled ? classes.disabled : ''}
                            ${readOnly ? classes.readOnly : ''}
                            ${classNames.textarea}`}
                rows={rows}
                disabled={disabled}
                readOnly={readOnly}
                {...otherProps}
            />
        </div>
    );
};

TextAreaCmp.defaultProps = {
    value: '',
    classNames: {
        container: '',
        textarea: ''
    },
    rows: 5,
    readOnly: false,
    disabled: false,
};

TextAreaCmp.propTypes = {
    rows: PropTypes.number,
    value: PropTypes.string,
    readOnly: PropTypes.bool,
    disabled: PropTypes.bool,
    classNames: PropTypes.shape({
        container: PropTypes.string,
        textarea: PropTypes.string
    }),
    classes: PropTypes.object.isRequired
};

export const TextArea = withStyles(styles)(TextAreaCmp);
