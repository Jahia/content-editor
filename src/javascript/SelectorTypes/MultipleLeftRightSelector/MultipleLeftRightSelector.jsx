import React, {useEffect, useState, useCallback, useRef} from 'react';
import PropTypes from 'prop-types';
import ValueList from '~/SelectorTypes/MultipleLeftRightSelector/ValueList';
import {ChevronDoubleLeft, ChevronDoubleRight, Button, Input} from '@jahia/moonstone';
import {FieldPropTypes} from '~/ContentEditor.proptypes';
import styles from './MultipleLeftRightSlector.scss';

const toArray = value => (Array.isArray(value) ? value : [value]);

const DATA_TYPES = {
    MLRS_DRAG_TO_REORDER: 'MLRS_DRAG_TO_REORDER',
    MLRS_DRAG_TO_MOVE: 'MLRS_DRAG_TO_MOVE',
}

export const MultipleLeftRightSelector = ({field, onChange, value}) => {
    const [filterLeft, setFilterLeft] = useState(null);
    const [filterRight, setFilterRight] = useState(null);
    const dnd = useRef({
        dragging: null
    });

    const arrayValue = value ? toArray(value) : [];

    // Reset selection if previously selected option no longer available
    useEffect(() => {
        if (arrayValue && arrayValue.length > 0) {
            const availableValues = field.valueConstraints.map(valueConstraint => valueConstraint.value.string);
            const actualValues = arrayValue.filter(v => availableValues.includes(v));
            if (actualValues.length !== arrayValue.length) {
                onChange(actualValues);
            }
        }
    }, [value, onChange]); // eslint-disable-line

    const options = field.valueConstraints.map(constraint => ({
        label: constraint.displayValue,
        value: constraint.value.string
    }));

    const readOnly = field.readOnly || field.valueConstraints.length === 0;

    const leftListIconStartProps = useCallback(value => ({
        draggable: true,
        onDragStart: e => {
            const ct = e.currentTarget;
            setTimeout(() => {
                ct.parentNode.parentNode.style.opacity = '0';
            }, 10);
            e.dataTransfer.setData(DATA_TYPES.MLRS_DRAG_TO_MOVE, JSON.stringify({type: DATA_TYPES.MLRS_DRAG_TO_MOVE, value: value}));
            e.dataTransfer.setDragImage(e.currentTarget.parentNode.parentNode, 10, 10);
            dnd.current.dragging = value;
        },
        onDragEnd: e => {
            e.currentTarget.parentNode.parentNode.style.opacity = '1';

            // Did not drop on required target, restore original state
            if (e.dataTransfer.types.includes(DATA_TYPES.MLRS_DRAG_TO_MOVE.toLowerCase()) && dnd.current.dragging !== null && dnd.current.dragging.originalIndex) {
                arrayValue.splice(dnd.current.dragging.index, 1);
                onChange([...arrayValue]);
            }

            dnd.current.dragging = null;
        }
    }), [arrayValue]);

    const rightListIconStartProps = useCallback(value => ({
       draggable: true,
       onDragStart: e => {
           const ct = e.currentTarget;
           setTimeout(() => {
               ct.parentNode.parentNode.style.opacity = '0';
           }, 10);
           e.dataTransfer.setData(DATA_TYPES.MLRS_DRAG_TO_REORDER, JSON.stringify({type: DATA_TYPES.MLRS_DRAG_TO_REORDER, value: value}));
           e.dataTransfer.setDragImage(e.currentTarget.parentNode.parentNode, 10, 10);
           dnd.current.dragging = value;
       },
        onDragEnd: e => {
            e.currentTarget.parentNode.parentNode.style.opacity = '1';
            // Did not drop on required target, restore original state
            if (e.dataTransfer.types.includes(DATA_TYPES.MLRS_DRAG_TO_REORDER.toLowerCase()) && dnd.current.dragging !== null && dnd.current.dragging.originalIndex) {
                const current = arrayValue[dnd.current.dragging.index];
                arrayValue.splice(dnd.current.dragging.index, 1);
                arrayValue.splice(dnd.current.dragging.originalIndex, 0, current);
                dnd.current.dragging = null;
                onChange([...arrayValue]);
            }

            // Did not drop on required target, restore original state
            if (e.dataTransfer.types.includes(DATA_TYPES.MLRS_DRAG_TO_MOVE.toLowerCase()) && dnd.current.dragging !== null && dnd.current.dragging.originalIndex) {
                arrayValue.splice(dnd.current.dragging.index, 1);
                dnd.current.dragging = null;
                onChange([...arrayValue]);
            }
        }
    }), [arrayValue]); //TODO make ref?

    const rightListListItemProps = useCallback(value => ({
        onDragOver: e => {
            // Perform actual move of the item
           if (e.dataTransfer.types.includes(DATA_TYPES.MLRS_DRAG_TO_REORDER.toLowerCase()) || (e.dataTransfer.types.includes(DATA_TYPES.MLRS_DRAG_TO_MOVE.toLowerCase()) && dnd.current.dragging.moved)) {
               e.preventDefault();
               if (dnd.current.dragging && dnd.current.dragging.index !== value.index) {
                   const rect = e.currentTarget.getBoundingClientRect();
                   const clientOffset = {x: e.clientX, y: e.clientY};
                   const targetMidPointY = rect.y + (rect.height / 2);

                   // Avoid triggering change for adjacent target
                   if (clientOffset.y < targetMidPointY && value.index > dnd.current.dragging.index) {
                       return;
                   }

                   // Avoid triggering change for adjacent target
                   if (clientOffset.y > targetMidPointY && value.index < dnd.current.dragging.index) {
                       return;
                   }

                   const m = arrayValue[value.index];

                   if (!dnd.current.dragging.originalIndex) {
                       dnd.current.dragging.originalIndex = dnd.current.dragging.index;
                   }

                   arrayValue[value.index] = arrayValue[dnd.current.dragging.index];
                   arrayValue[dnd.current.dragging.index] = m;
                   dnd.current.dragging.index = value.index;
                   onChange([...arrayValue]);
               }
           }

            if (e.dataTransfer.types.includes(DATA_TYPES.MLRS_DRAG_TO_MOVE.toLowerCase())) {
                e.preventDefault();
                // Add moved item to list
                if (dnd.current.dragging && dnd.current.dragging.value !== value.value && !dnd.current.dragging.moved) {
                    arrayValue.splice(value.index, 0, dnd.current.dragging.value);
                    dnd.current.dragging.index = value.index;
                    dnd.current.dragging.originalIndex = value.index;
                    dnd.current.dragging.moved = true;
                    onChange([...arrayValue]);
                }

            }
       },
       onDrop: e => {
            // Confirms drop and prevents reordering onDragEnd
            if ((e.dataTransfer.types.includes(DATA_TYPES.MLRS_DRAG_TO_REORDER.toLowerCase()) || e.dataTransfer.types.includes(DATA_TYPES.MLRS_DRAG_TO_MOVE.toLowerCase())) && value.value === dnd.current.dragging.value) {
                e.preventDefault();
                dnd.current.dragging = null;
            }
       }
    }), [arrayValue]); //TODO Make it a ref?



    return (
        <div className={styles.multipleSelector}>
            <div className={styles.listHolder}>
                <Input variant="search"
                       onChange={e => setFilterLeft(e.target.value.trim())}
                />
                <ValueList orientation="left"
                           filter={filterLeft}
                           values={options.filter(o => !arrayValue.includes(o.value))}
                           onMove={v => onChange(arrayValue.concat(v))}
                           iconStartProps={arrayValue.length > 0 ? leftListIconStartProps : null}
                />
            </div>
            <div className={styles.buttonSection}>
                <div className={styles.buttons}>
                    <Button title="Add all"
                            isDisabled={readOnly || !field.multiple}
                            icon={<ChevronDoubleRight/>}
                            onClick={() => onChange(options.map(o => o.value))}
                    />
                    <Button title="Remove all"
                            isDisabled={readOnly || !field.multiple}
                            icon={<ChevronDoubleLeft/>}
                            onClick={() => onChange([])}
                    />
                </div>
            </div>
            <div className={styles.listHolder}>
                <Input variant="search"
                       onChange={e => setFilterRight(e.target.value.trim())}
                />
                <ValueList orientation="right"
                           values={arrayValue.map(v => options.find(o => o.value === v))}
                           filter={filterRight}
                           onMove={v => onChange(arrayValue.filter(val => !v.includes(val)))}
                           iconStartProps={rightListIconStartProps}
                           listItemProps={rightListListItemProps}
                />
            </div>
        </div>
    );
};

MultipleLeftRightSelector.propTypes = {
    field: FieldPropTypes.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.oneOf([PropTypes.string, PropTypes.array])
};

export default MultipleLeftRightSelector;
