import React, {useState, Fragment} from 'react';

import {Typography} from '@jahia/design-system-kit';
import {useContentEditorContext} from '~/ContentEditor.context';
import {useTranslation} from 'react-i18next';

import classes from './ChildrenContainer.scss';

import {DropableSpace, DraggableReference} from './DragDrop';

export const ChildrenContainer = () => {
    const context = useContentEditorContext();
    const {t} = useTranslation();

    // TODO BACKLOG-12544 remove this states
    const [nodes, setNodes] = useState(context.nodeData.children.nodes);

    const handleReorder = (droppedName, index) => {
        const droppedChild = nodes.find(child => child.name === droppedName);
        const childrenWithoutDropped = nodes.filter(child => child.name !== droppedName);

        setNodes([
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
                    childDown={nodes[0]}
                    classes={classes}
                    index={0}
                    onReorder={handleReorder}
                    />
                {nodes.map((child, i) => {
                    return (
                        <Fragment key={`${child.name}-grid`}>
                            <DraggableReference child={child}/>
                            <DropableSpace
                                childUp={child}
                                childDown={nodes[i + 1]}
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
