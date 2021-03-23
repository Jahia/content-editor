import {FastField} from 'formik';
import React, {Fragment} from 'react';
import {DropableSpace, DraggableReference} from './DragDrop';

export const ManualOrdering = () => {
    return (
        <FastField name="Children::Order">
            {({field, form: {setFieldValue, setFieldTouched}}) => {
                const handleReorder = (droppedName, index) => {
                    let childrenWithoutDropped = [], droppedChild = null, droppedItemIndex = -1;
                    field.value.forEach((item, index) => {
                        if (droppedItemIndex === -1 && item.name === droppedName) { // find first match
                            droppedChild = item;
                            droppedItemIndex = index + 1;
                        } else {
                            childrenWithoutDropped.push(item);
                        }
                    })

                    if (droppedChild !== null && droppedItemIndex >= 0) { // There is a match
                        // +1 here as index is +1
                        const spliceIndex = ((droppedItemIndex + 1) < index) ? index - 1 : index;

                        setFieldValue(field.name, [
                            ...childrenWithoutDropped.splice(spliceIndex, 0, droppedChild)
                        ]);
                        setFieldTouched(field.name, true);
                    }
                };

                return (
                    <>
                        <DropableSpace
                            childUp={null}
                            childDown={field.value[0]}
                            index={0}
                            onReorder={handleReorder}
                        />
                        {field.value.map((child, i) => {
                            return (
                                <Fragment key={`${child.name}-grid`}>
                                    <DraggableReference child={child}/>
                                    <DropableSpace
                                        childUp={child}
                                        childDown={field.value[i + 1]}
                                        index={i + 1}
                                        onReorder={handleReorder}
                                    />
                                </Fragment>
                            );
                        })}
                    </>
                );
            }}
        </FastField>
    );
};
