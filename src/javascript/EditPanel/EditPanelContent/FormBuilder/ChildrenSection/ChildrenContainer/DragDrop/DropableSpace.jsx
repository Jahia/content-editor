import React from 'react';
import PropTypes from 'prop-types';
import {useDrop} from 'react-dnd';
import classes from './DropableSpace.scss';

export const DropableSpace = ({childDown, childUp, index, onReorder}) => {
    const [{isDropping}, drop] = useDrop({
        accept: 'REFERENCE_CARD',
        drop: item => onReorder(item.name, index),
        collect: monitor => {
            return {
                isDropping: monitor.isOver() &&
                        monitor.canDrop() &&
                        monitor.getItem().name !== (childUp && childUp.name) &&
                        monitor.getItem().name !== (childDown && childDown.name)
            };
        }
    });

    return (
        <div ref={drop} className={classes.dropable}>
            <div className={`${classes.referenceDropGhostHidden} ${isDropping ? classes.referenceDropGhost : ''}`}/>
        </div>
    );
};

DropableSpace.defaultProps = {
    childUp: null,
    childDown: null
};

DropableSpace.propTypes = {
    childUp: PropTypes.object,
    childDown: PropTypes.object,
    index: PropTypes.number.isRequired,
    onReorder: PropTypes.func.isRequired
};
