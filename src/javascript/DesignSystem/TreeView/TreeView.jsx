import React, {Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core';

import {IconLabel} from './IconLabel/IconLabel';
import {ArrowDropDown, ArrowRight} from '@material-ui/icons';

const style = theme => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    nodeWithChild: {
        border: 'none',
        marginTop: `${theme.spacing.unit / 2}px`,
        padding: `${theme.spacing.unit}px 0`,
        width: '100%',
        textAlign: 'left',
        cursor: 'pointer',
        display: 'flex',
        background: 'transparent',
        '&:hover': {
            background: theme.palette.ui.omega
        },
        '&:focus': {
            outline: 'none',
            background: theme.palette.ui.zeta
        }
    },
    nodeWithChildArrow: {
        color: theme.palette.ui.gamma
    },
    simpleNode: {
        padding: '0.5rem 0 0.5rem 0',
        outline: 'none',
        width: '100%',
        textAlign: 'left',
        cursor: 'pointer',
        '&:hover': {
            background: theme.palette.ui.omega
        },
        '&:focus': {
            outline: 'none',
            backgroundColor: theme.palette.brand.alpha,
            '& span': {
                color: theme.palette.background.paper
            }
        }
    },
    childContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '100%'
    }
});

const TreeViewCmp = ({tree, onNodeClick, onNodeDoubleClick, classes}) => {
    // By default everything is closed
    const [openedNodes, setOpenedNode] = useState([]);

    function generateLevelJSX(level, deep) {
        return level.map(node => {
            const nodeIsOpen = Boolean(openedNodes.includes(node));

            const toggleNode = () => {
                if (nodeIsOpen) {
                    setOpenedNode(openedNodes.filter(n => n !== node));
                } else {
                    setOpenedNode([...openedNodes, node]);
                }
            };

            const handleNodeClick = e => {
                toggleNode();
                onNodeClick(node, e);
            };

            const handleNodeDoubleClick = e => {
                toggleNode();
                onNodeDoubleClick(node, e);
            };

            if (node.children && node.children.length !== 0) {
                const Arrow = nodeIsOpen || node.opened ? ArrowDropDown : ArrowRight;
                const Childs = nodeIsOpen || node.opened ? generateLevelJSX(node.children, deep + 1) : <></>;

                return (
                    <Fragment key={level.id + node.id}>
                        <button
                            type="button"
                            className={classes.nodeWithChild}
                            onClick={handleNodeClick}
                            onDoubleClick={handleNodeDoubleClick}
                        >
                            <Arrow className={classes.nodeWithChildArrow} color="secondary"/>
                            <span>
                                <IconLabel label={node.label} iconURL={node.iconURL}/>
                            </span>
                        </button>
                        <div className={classes.childContainer}>
                            {Childs}
                        </div>
                    </Fragment>
                );
            }

            return (
                <div key={level.id + node.id}
                     tabIndex="0"
                     style={{paddingLeft: `calc(${deep}rem + 20px)`}}
                     className={classes.simpleNode}
                     onKeyPress={event => {
                         if (event.key === 'Enter') {
                             handleNodeClick(event);
                         }
                     }}
                     onClick={handleNodeClick}
                     onDoubleClick={handleNodeDoubleClick}
                >
                    <IconLabel label={node.label} iconURL={node.iconURL}/>
                </div>
            );
        });
    }

    return (
        <div className={classes.container}>
            {generateLevelJSX(tree, 0)}
        </div>
    );
};

TreeViewCmp.defaultProps = {
    onNodeClick: () => {},
    onNodeDoubleClick: () => {}
};

TreeViewCmp.propTypes = {
    tree: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string,
        iconURL: PropTypes.string,
        children: PropTypes.arrayOf(PropTypes.object)
    })).isRequired,
    onNodeClick: PropTypes.func,
    onNodeDoubleClick: PropTypes.func,
    classes: PropTypes.object.isRequired
};

export const TreeView = withStyles(style)(TreeViewCmp);

TreeView.displayName = 'TreeView';
