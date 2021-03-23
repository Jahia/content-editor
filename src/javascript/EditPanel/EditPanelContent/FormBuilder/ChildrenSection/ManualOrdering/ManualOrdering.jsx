import {FastField} from 'formik';
import React, {Fragment} from 'react';
import {DropableSpace, DraggableReference} from './DragDrop';

export const ManualOrdering = () => {
    return (
        <FastField name="Children::Order">
            {({field, form: {setFieldValue, setFieldTouched}}) => {
                const handleReorder = (droppedName, index) => {
                    const droppedChild = field.value.find(child => child.name === droppedName);
                    const childrenWithoutDropped = field.value.filter(child => child.name !== droppedName);
                    // Need to add a check here as child might be before the index
                    const droppedItemIndex = field.value.findIndex(item => item.name === droppedName);
                    const sliceIndex = ((droppedItemIndex + 1) < index) ? index - 1 : index; // +1 here as index is +1

                    setFieldValue(field.name, [
                        ...childrenWithoutDropped.slice(0, sliceIndex),
                        droppedChild,
                        ...childrenWithoutDropped.slice(sliceIndex, childrenWithoutDropped.length)
                    ]);
                    setFieldTouched(field.name, true);
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
