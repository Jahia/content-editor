import React from 'react';
import PropTypes from 'prop-types';

import close from './close.svg';
import checked from './checked.svg';
import unchecked from './unchecked.svg';
import arrow from './arrow.svg';

import DropdownTreeSelectLib from 'react-dropdown-tree-select';
import {withStyles} from '@material-ui/core';

const icons = {
    close,
    checked,
    unchecked,
    arrow
};

const styles = theme => ({
    container: {
        // Core https://github.com/dowjones/react-dropdown-tree-select/blob/dbcd71eb761a10171667f44c051f7120219eb5b6/src/index.css
        '& .hide:not(.match-in-children)': {
            display: 'none'
        },
        '& .dropdown': {
            position: 'relative',

            paddingLeft: 0,
            borderRadius: '1px',
            background: theme.palette.ui.epsilon,
            border: `1px solid ${theme.palette.ui.omega}`,
            boxSizing: 'border-box',
            fontSize: theme.typography.iota.fontSize,
            transitionDuration: '.3s',
            padding: '3px 0px',
            display: 'flex',
            minHeight: '44px',

            '& .dropdown-trigger': {
                width: '100%',
                display: 'flex',
                alignItems: 'center',

                '&.arrow': {
                    cursor: 'pointer',
                    '&.disabled, &.readOnly': {
                        cursor: 'not-allowed'
                    }
                }
            },

            '& .dropdown-content': {
                position: 'absolute',
                padding: '4px',
                zIndex: 1,
                top: '44px',
                width: '100%',
                background: 'white',
                borderTop: 'rgba(0, 0, 0, 0.05) 1px solid',
                boxShadow: '0 5px 8px rgba(0, 0, 0, 0.15)',

                '& ul': {
                    margin: 0,
                    padding: 0
                }
            }
        },

        '& .dropdown:hover': {
            border: `1px solid ${theme.palette.ui.zeta}`
        },
        '&.disabled .dropdown': {
            background: theme.palette.ui.epsilon,
            border: `1px solid ${theme.palette.ui.zeta}`,
            color: theme.palette.font.gamma
        },
        '&.readOnly .dropdown': {
            background: theme.palette.ui.alpha,
            border: `1px solid ${theme.palette.ui.alpha}`
        },

        // TAGS https://github.com/dowjones/react-dropdown-tree-select/blob/96ff9c91d7b3d96f414af1b28f621905ecfb6cca/src/tag/index.css
        '& .tag': {
            backgroundColor: theme.palette.brand.beta,
            color: theme.palette.invert.beta,
            height: '32px',
            display: 'inline-flex',
            outline: 'none',
            fontSize: '0.8125rem',
            transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
            boxSizing: 'border-box',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            verticalAlign: 'middle',
            justifyContent: 'center',
            textDecoration: 'none',
            border: '1px solid #D8DEE3',
            borderRadius: '4px',
            padding: '0 0 0 12px',

            '&:focus-within': {
                backgroundColor: 'rgb(206, 206, 206)',
                borderColor: '#a0a0a0'
            },
            '&.readOnly, &.disabled': {
                display: 'none'
            }
        },
        '& .tag-remove': {
            color: theme.palette.invert.beta,
            cursor: 'pointer',
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '0',
            '&::after': {
                content: `url(${icons.close})`,
                height: '20px',
                width: '20px',
                display: 'block'
            },

            '&:focus': {
                color: '#3c3c3c'
            },
            '&.readOnly, &.disabled': {
                display: 'none'
            }
        },

        // Tree node https://github.com/dowjones/react-dropdown-tree-select/blob/96ff9c91d7b3d96f414af1b28f621905ecfb6cca/src/tree-node/index.css
        '& .node': {
            display: 'flex',
            padding: '4px',
            color: '#565656',

            '&.leaf': {
                marginLeft: '8px',
                '&.collapsed': {
                    display: 'none'
                }
            },

            '&.disabled > *': {
                color: 'gray',
                cursor: 'not-allowed'
            },

            '&.match-in-children': {
                '&.hide': {
                    '.node-label': {
                        opacity: 0.5
                    }
                }
            },

            '&.focused': {
                backgroundColor: '#f4f4f4'
            },

            '& > label': {
                display: 'flex',
                cursor: 'pointer',
                marginLeft: '2px'
            },
            '& > label::before': {
                display: 'inline-block',
                height: '16px',
                width: '16px',
                content: `url(${icons.unchecked})`,
                marginRight: '4px'
            },

            '&.checked > label::before': {
                content: `url(${icons.checked})`
            },

            '& .checkbox-item, & .radio-item': {
                display: 'none'
            }
        },
        '& .toggle': {
            whiteSpace: 'pre',
            marginRight: '4px',
            marginLeft: '4px',
            cursor: 'pointer',
            width: '16px',

            '&::after': {
                content: '""',
                display: 'inline-block'
            },

            '&.collapsed::after': {
                content: `url(${icons.arrow})`
            },

            '&.expanded::after': {
                content: `url(${icons.arrow})`,
                transform: 'rotate(90deg)'
            }
        },
        '& .searchModeOn .toggle': {
            display: 'none'
        },
        '& .searchModeOn .node.leaf': {
            marginLeft: '0'
        },

        // Input
        '& .tag-list': {
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            flexGrow: 1,
            padding: 0,
            margin: 0
        },
        '& .tag-item': {
            display: 'inline-block',
            margin: '4px',

            '& .search': {
                border: 'none',
                outline: 'none'
            }
        },
        '& .tag-item:last-child': {
            marginRight: '4px'
        },
        // ReadOnly and disable handling
        '& .readOnly .tag': {
            backgroundColor: '#828892',
            color: theme.palette.invert.beta,
            paddingRight: '12px'
        },
        '& .disabled .tag': {
            paddingRight: '12px'
        },
        '& .readOnly .search': {
            display: 'none'
        },
        '& .disabled .search': {
            display: 'none'
        }
    }
});

const CustomDropdownTreeSelectCmp = ({classes, readOnly, disabled, noMatchesLabel, ...props}) => {
    return (
        <DropdownTreeSelectLib
            className={`${classes.container} ${readOnly ? 'readOnly' : ''} ${disabled ? 'disabled' : ''}`}
            readOnly={readOnly}
            disabled={readOnly || disabled}
            texts={{
                placeholder: '\t',
                noMatches: noMatchesLabel
            }}
            {...props}
        />
    );
};

CustomDropdownTreeSelectCmp.defaultProps = {
    mode: 'hierarchical',
    readOnly: false,
    disabled: false
};

CustomDropdownTreeSelectCmp.propTypes = {
    classes: PropTypes.object.isRequired,
    mode: PropTypes.string,
    noMatchesLabel: PropTypes.string.isRequired,
    readOnly: PropTypes.bool,
    disabled: PropTypes.bool
};

export const DropdownTreeSelect = withStyles(styles)(CustomDropdownTreeSelectCmp);
