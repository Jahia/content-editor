import React from 'react';
import PropTypes from 'prop-types';

import close from './close.svg';
import checked from './checked.svg';
import unchecked from './unchecked.svg';

import DropdownTreeSelectLib from 'react-dropdown-tree-select';
import {withStyles} from '@material-ui/core/styles';

let icons = {};
if (process.env.STORYBOOK_ENV || process.env.NODE_ENV === 'test') {
    icons = {
        close,
        checked,
        unchecked
    };
} else {
    const path = `${window.contextJsParameters.contextPath}/modules/content-editor/javascript/apps/`;

    icons = {
        close: path + close,
        checked: path + checked,
        unchecked: path + unchecked
    };
}

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

                    '&.bottom::after': {
                        content: '">"',
                        transform: 'rotate(90deg)',
                        display: 'inline-block',
                        verticalAlign: 'middle',
                        color: '#3c3c3c',
                        marginRight: '2px'
                    },

                    '&.top::after': {
                        content: '">"',
                        display: 'inline-block',
                        transform: 'rotate(270deg)',
                        verticalAlign: 'middle',
                        color: '#3c3c3c',
                        marginRight: '2px'
                    },

                    '&.disabled': {
                        cursor: 'not-allowed',

                        '&.bottom::after': {
                            color: 'rgb(185, 185, 185)'
                        }
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
            backgroundColor: theme.palette.brand.alpha,
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
                height: '1rem',
                width: '1rem',
                display: 'block'
            },

            '&.readOnly, &.disabled': {
                cursor: 'not-allowed'
            },

            '&:focus': {
                color: '#3c3c3c'
            }
        },

        // Tree node https://github.com/dowjones/react-dropdown-tree-select/blob/96ff9c91d7b3d96f414af1b28f621905ecfb6cca/src/tree-node/index.css
        '& .node': {
            display: 'flex',
            padding: '4px',

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
            cursor: 'pointer',
            width: '4px',

            '&::after': {
                content: '""',
                display: 'inline-block'
            },

            '&.collapsed::after': {
                content: '">"'
            },

            '&.expanded::after': {
                content: '">"',
                transform: 'rotate(90deg)'
            }
        },
        '& .searchModeOn .toggle': {
            display: 'none'
        },

        // Input
        '& .tag-list': {
            display: 'flex',
            alignItems: 'center',
            flexGrow: 1,
            padding: 0,
            margin: 0
        },
        '& .tag-item': {
            display: 'inline-block',
            margin: '4px',

            '& .search': {
                border: 'none',
                borderBottom: 'solid 1px #ccc',
                outline: 'none'
            }
        },
        '& .tag-item:last-child': {
            marginRight: '4px'
        }
    }
});

const CustomDropdownTreeSelectCmp = ({classes, readOnly, disabled, ...props}) => {
    return (
        <DropdownTreeSelectLib
            className={`${classes.container} ${readOnly ? 'readOnly' : ''} ${disabled ? 'disabled' : ''}`}
            readOnly={readOnly}
            disabled={disabled}
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
    readOnly: PropTypes.bool,
    disabled: PropTypes.bool
};

export const DropdownTreeSelect = withStyles(styles)(CustomDropdownTreeSelectCmp);
