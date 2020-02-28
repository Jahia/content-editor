import React, {Fragment} from 'react';
import {PropTypes} from 'prop-types';

import {Typography} from '@jahia/design-system-kit';
import {useTranslation} from 'react-i18next';

import classes from './ChildrenOrderField.scss';

import {DropableSpace, DraggableReference} from './DragDrop';

export const ChildrenOrderField = ({value, onChange}) => {
    const {t} = useTranslation();

    const handleReorder = (droppedName, index) => {
        const droppedChild = value.find(child => child.name === droppedName);
        const childrenWithoutDropped = value.filter(child => child.name !== droppedName);

        onChange([
            ...childrenWithoutDropped.slice(0, index),
            droppedChild,
            ...childrenWithoutDropped.slice(index, childrenWithoutDropped.length)
        ]);
    };

    return (
        <article>
            <div className={classes.fieldsetTitleContainer}>
                <Typography component="label" htmlFor={t('content-editor:label.contentEditor.section.listAndOrdering.ordering')} className={classes.fieldSetTitle} color="alpha" variant="zeta">
                    {t('content-editor:label.contentEditor.section.listAndOrdering.ordering')}
                </Typography>
            </div>

            <div className={classes.formControl}>
                <DropableSpace
                    childUp={null}
                    childDown={value[0]}
                    classes={classes}
                    index={0}
                    onReorder={handleReorder}
                    />
                {value.map((child, i) => {
                    return (
                        <Fragment key={`${child.name}-grid`}>
                            <DraggableReference child={child}/>
                            <DropableSpace
                                childUp={child}
                                childDown={value[i + 1]}
                                index={i + 1}
                                onReorder={handleReorder}
                                />
                        </Fragment>
                    );
                })}
            </div>
        </article>
    );
};

ChildrenOrderField.defaultProps = {
    value: []
};

ChildrenOrderField.propTypes = {
    value: PropTypes.array,
    onChange: PropTypes.func.isRequired
};
