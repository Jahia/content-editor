import {FastField} from 'formik';
import React, {Fragment} from 'react';
import {DraggableReference, DropableSpace} from './DragDrop';

export const ManualOrdering = () => {
    return (
        <FastField name="Children::Order">
            {({field, form: {setFieldValue, setFieldTouched}}) => {
                if (field.value === undefined) {
                    // Field has no children
                    return null;
                }

                const handleReorder = (droppedName, index) => {
                    let childrenWithoutDropped = [];
                    let droppedChild = null;
                    let droppedItemIndex = -1;
                    field.value.forEach((item, index) => {
                        if (droppedItemIndex === -1 && item.name === droppedName) {
                            droppedChild = item;
                            droppedItemIndex = index;
                        } else {
                            childrenWithoutDropped.push(item);
                        }
                    });

                    if (droppedChild !== null && droppedItemIndex >= 0) {
                        // +1 for droppedItemIndex here as index parameter from handleReOrder is starting from 1 instead of 0
                        const spliceIndex = ((droppedItemIndex + 1) < index) ? index - 1 : index;
                        setFieldValue(field.name, [
                            ...childrenWithoutDropped.slice(0, spliceIndex),
                            droppedChild,
                            ...childrenWithoutDropped.slice(spliceIndex, childrenWithoutDropped.length)
                        ]);
                        setFieldTouched(field.name, true, false);
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
