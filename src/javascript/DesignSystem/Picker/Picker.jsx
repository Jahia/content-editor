import React from 'react';
import PropTypes from 'prop-types';
import {Typography} from '@jahia/design-system-kit';

import {withStyles} from '@material-ui/core';

const styles = theme => ({
    add: {
        width: '100%',
        height: theme.spacing.unit * 9,
        backgroundColor: theme.palette.ui.epsilon,
        border: `1px ${theme.palette.ui.zeta} dashed`,
        fontSize: '0.875rem',
        borderRadius: '2px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&:hover': {
            border: `1px solid ${theme.palette.ui.zeta}`,
            cursor: 'pointer'
        },
        '&:focus': {
            outline: 'none',
            border: `1px solid ${theme.palette.brand.alpha}`
        },
        '& svg': {
            margin: theme.spacing.unit,
            color: theme.palette.ui.zeta
        }
    },
    addReadOnly: {
        outline: 'none',
        background: theme.palette.ui.alpha,
        border: `1px solid ${theme.palette.ui.alpha}!important`
    },
    fieldContainer: {
        width: '100%',
        height: theme.spacing.unit * 9,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: `1px ${theme.palette.ui.zeta} solid`,
        boxShadow: '1px 5px 6px rgba(64, 77, 86, 0.1)',
        borderRadius: '2px',
        paddingRight: theme.spacing.unit,
        '& button': {
            color: theme.palette.font.beta
        },
        cursor: 'pointer'
    },
    fieldContainerReadOnly: {
        border: `1px ${theme.palette.ui.omega} solid`,
        boxShadow: 'none'
    },
    fieldFigureContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: `calc(${theme.spacing.unit * 9}px - 2px)`,
        width: theme.spacing.unit * 9,
        overflow: 'hidden',
        backgroundColor: theme.palette.ui.omega
    },
    fieldImage: {
        textAlign: 'center',
        margin: 0,
        maxWidth: theme.spacing.unit * 9,
        maxHeight: `calc(${theme.spacing.unit * 9}px - 2px)`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain'
    },
    fieldSelectedMetadata: {
        flexGrow: 1,
        padding: '1rem 2rem',
        width: 'calc(100% - 144px)',
        '& p': {
            width: '360px',
            padding: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        }
    },
    pickerButtonEmptyContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    }
});

const PickerCmp = ({
    classes,
    readOnly,
    emptyLabel,
    emptyIcon,
    fieldData,
    labelledBy,
    onClick
}) => {
    // If picker have already data
    if (fieldData) {
        return (
            <article
                className={
                    classes.fieldContainer +
                    ' ' +
                    (readOnly ? classes.fieldContainerReadOnly : '')
                }
                data-sel-field-picker="filled"
                data-sel-field-picker-action="openPicker"
                role="button"
                tabIndex="0"
                aria-labelledby={labelledBy}
                onClick={() => {
                    if (readOnly) {
                        return;
                    }

                    onClick(true);
                }}
            >
                <div className={classes.fieldFigureContainer}>
                    <img src={fieldData.url} className={classes.fieldImage}/>
                </div>
                <div className={classes.fieldSelectedMetadata}>
                    <Typography
                        data-sel-field-picker-name
                        variant="zeta"
                        color="alpha"
                    >
                        {fieldData.name}
                    </Typography>
                    <Typography
                        data-sel-field-picker-info
                        variant="omega"
                        color="gamma"
                    >
                        {fieldData.info}
                    </Typography>
                </div>
            </article>
        );
    }

    return (
        <button
            data-sel-media-picker="empty"
            data-sel-field-picker-action="openPicker"
            className={`${classes.add} ${readOnly ? classes.addReadOnly : ''}`}
            type="button"
            aria-disabled={readOnly}
            aria-labelledby={labelledBy}
            onClick={() => {
                if (readOnly) {
                    return;
                }

                onClick(true);
            }}
        >
            {!readOnly &&
            <div className={classes.pickerButtonEmptyContainer}>
                {emptyIcon}
                <Typography variant="omega" color="beta" component="span">
                    {emptyLabel}
                </Typography>
            </div>
            }
        </button>
    );
};

PickerCmp.defaultProps = {
    readOnly: false,
    fieldData: null,
    emptyLabel: '',
    emptyIcon: null,
    onClick: () => {}
};

PickerCmp.propTypes = {
    readOnly: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    onClick: PropTypes.func,
    fieldData: PropTypes.shape({
        url: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        info: PropTypes.string.isRequired
    }),
    emptyLabel: PropTypes.string,
    emptyIcon: PropTypes.element,
    labelledBy: PropTypes.string
};

export const Picker = withStyles(styles)(PickerCmp);

Picker.displayName = 'Picker';
