import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {Typography} from '@jahia/moonstone';
import {withStyles} from '@material-ui/core';
import {HandleDrag} from '@jahia/moonstone';

const styles = theme => ({
    container: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    add: {
        width: '100%',
        color: 'var(--color-gray_dark60)',
        height: theme.spacing.unit * 9,
        backgroundColor: theme.palette.ui.epsilon,
        border: '1px var(--color-gray40) dashed',
        fontSize: '0.875rem',
        borderRadius: '2px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        '&:hover': {
            border: '1px var(--color-gray40) solid'
        },
        '&:focus': {
            outline: 'none',
            border: '1px var(--color-gray40) solid'
        },
        '& svg': {
            marginBottom: 'var(--spacing-nano)'
        }
    },
    addError: {
        border: '1px var(--color-warning) solid',
        '&:hover': {
            border: '1px var(--color-warning) solid'
        },
        '&:focus': {
            border: '1px var(--color-warning) solid'
        }
    },
    addReadOnly: {
        outline: 'none',
        background: theme.palette.ui.alpha,
        border: '1px var(--color-gray40) solid',
        '&:hover': {
            border: '1px var(--color-gray40) solid'
        },
        '&:focus': {
            border: '1px var(--color-gray40) solid'
        },
        cursor: 'default'
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
        boxShadow: 'none',
        cursor: 'default'
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
    referenceButtonEmptyContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    error: {
        color: 'var(--color-warning)'
    },
    draggableIcon: {
        cursor: 'grab'
    }
});

const ReferenceCardCmp = ({
    classes,
    isReadOnly,
    isError,
    emptyLabel,
    emptyIcon,
    fieldData,
    labelledBy,
    onClick,
    isDraggable
}) => {
    // If card have already data
    if (fieldData) {
        const nameId = `${labelledBy}-name`;
        return (
            <div className={classes.container}>
                {isDraggable &&
                <div className={classes.draggableIcon}>
                    <HandleDrag size="big"/>
                </div>}

                <article
                    className={clsx(
                        classes.fieldContainer,
                        (isReadOnly ? classes.fieldContainerReadOnly : ''),
                        (isDraggable ? classes.draggableIcon : '')
                    )}
                    data-sel-field-picker="filled"
                    data-sel-field-picker-action="openPicker"
                    role="button"
                    tabIndex="0"
                    aria-labelledby={labelledBy}
                    onClick={() => {
                        if (isReadOnly) {
                            return;
                        }

                        onClick(true);
                    }}
                >
                    <div className={classes.fieldFigureContainer}>
                        <img src={fieldData.url} className={classes.fieldImage} aria-labelledby={nameId} alt=""/>
                    </div>
                    <div className={classes.fieldSelectedMetadata}>
                        <Typography data-sel-field-picker-name variant="caption" id={nameId}>
                            {fieldData.name}
                        </Typography>
                        <Typography data-sel-field-picker-info variant="body">
                            {fieldData.info}
                        </Typography>
                    </div>
                </article>
            </div>
        );
    }

    return (
        <button
            data-sel-media-picker="empty"
            data-sel-field-picker-action="openPicker"
            className={clsx(classes.add, isReadOnly && classes.addReadOnly, isError && classes.addError)}
            type="button"
            aria-disabled={isReadOnly}
            aria-labelledby={labelledBy}
            onClick={() => {
                if (isReadOnly) {
                    return;
                }

                onClick(true);
            }}
        >
            {!isReadOnly &&
            <div className={clsx(classes.referenceButtonEmptyContainer, isError && classes.error)}>
                {emptyIcon}
                <Typography variant="body" component="span">
                    {emptyLabel}
                </Typography>
            </div>}
        </button>
    );
};

ReferenceCardCmp.defaultProps = {
    isDraggable: false,
    isReadOnly: false,
    fieldData: null,
    emptyLabel: '',
    emptyIcon: null,
    onClick: () => {}
};

ReferenceCardCmp.propTypes = {
    isReadOnly: PropTypes.bool,
    isError: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    onClick: PropTypes.func,
    fieldData: PropTypes.shape({
        url: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        info: PropTypes.string.isRequired
    }),
    isDraggable: PropTypes.bool,
    emptyLabel: PropTypes.string,
    emptyIcon: PropTypes.element,
    labelledBy: PropTypes.string
};

export const ReferenceCard = withStyles(styles)(ReferenceCardCmp);

ReferenceCard.displayName = 'ReferenceCard';
