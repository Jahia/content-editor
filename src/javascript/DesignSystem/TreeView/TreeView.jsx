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
        padding: 0,
        margin: '0.25rem 0',
        width: '100%',
        textAlign: 'left',
        display: 'flex',
        background: 'transparent'
    },
    nodeWithChildArrow: {
        color: theme.palette.ui.gamma
    },
    simpleNode: {
        margin: '0.5rem 0 0.5rem 20px',
        width: '100%',
        textAlign: 'left'
    },
    childContainer: {
        marginLeft: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
    }
});

const TreeViewCmp = ({tree, onNodeClick, classes}) => {
    // By default everything is closed
    const [openedNodes, setOpenedNode] = useState([]);

    function generateLevelJSX(level) {
        return level.map(node => {
            const nodeIsOpen = Boolean(openedNodes.includes(node));

            const handleNodeClick = e => {
                if (nodeIsOpen) {
                    setOpenedNode(openedNodes.filter(n => n !== node));
                } else {
                    setOpenedNode([...openedNodes, node]);
                }

                onNodeClick(node, e);
            };

            if (node.childs && node.childs.length !== 0) {
                const Arrow = nodeIsOpen || node.opened ? ArrowDropDown : ArrowRight;
                const Childs = nodeIsOpen || node.opened ? generateLevelJSX(node.childs) : <></>;

                return (
                    <Fragment key={level.id + node.id}>
                        <button type="button" className={classes.nodeWithChild} onClick={handleNodeClick}>
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
                     className={classes.simpleNode}
                     onKeyPress={event => {
                         if (event.key === 'Enter') {
                             handleNodeClick(event);
                         }
                     }}
                     onClick={handleNodeClick}
                >
                    <IconLabel label={node.label} iconURL={node.iconURL}/>
                </div>
            );
        });
    }

    return (
        <div className={classes.container}>
            {generateLevelJSX(tree)}
        </div>
    );
};

TreeViewCmp.defaultProps = {
    onNodeClick: () => {}
};

TreeViewCmp.propTypes = {
    tree: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string,
        iconURL: PropTypes.string,
        childs: PropTypes.arrayOf(PropTypes.object)
    })).isRequired,
    onNodeClick: PropTypes.func,
    classes: PropTypes.object.isRequired
};

export const TreeView = withStyles(style)(TreeViewCmp);

TreeView.displayName = 'TreeView';
