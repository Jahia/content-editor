import {useTranslation} from 'react-i18next';
import {useDrag, useDrop} from 'react-dnd';
import styles from '~/DesignSystem/OrderableValue/OrderableValue.scss';
import {Button, Close, HandleDrag} from '@jahia/moonstone';
import React from 'react';
import PropTypes from 'prop-types';

export const OrderableValue = ({field, onFieldRemove, onValueReorder, index, component}) => {
    const {t} = useTranslation('content-editor');
    const name = `${field.name}[${index}]`;
    const [{isDropping}, drop] = useDrop({
        accept: `REFERENCE_CARD_${field.name}`, drop: item => onValueReorder(item.name, index), collect: monitor => {
            return {
                isDropping: monitor.isOver() && monitor.canDrop() && monitor.getItem().name !== name
            };
        }
    });
    const [{isDragging}, drag] = useDrag({
        type: `REFERENCE_CARD_${field.name}`, item: {name: name}, collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    });
    return (
        <>
            <div key={name}
                 ref={field.readOnly ? null : drop}
                 className={styles.fieldComponentContainer}
                 data-sel-content-editor-multiple-generic-field={name}
                 data-sel-content-editor-field-readonly={field.readOnly}
            >
                <div className={`${styles.referenceDropGhostHidden} ${isDropping ? styles.referenceDropGhost : ''}`} data-droppable-zone={name}/>
                {(field.readOnly || !component) ? (
                    <div className={styles.draggableCard}>
                        {component}
                    </div>
                ) : (
                    <div className={styles.draggableCard}>
                        {!isDragging &&
                            <>
                                <div ref={drag} className={styles.draggableIcon}>
                                    <HandleDrag size="big"/>
                                </div>
                                {component}
                            </>}
                        {!isDragging && <Button variant="ghost"
                                                data-sel-action={`removeField_${index}`}
                                                aria-label={t('content-editor:label.contentEditor.edit.fields.actions.clear')}
                                                icon={<Close/>}
                                                onClick={() => onFieldRemove(index)}
                        />}
                    </div>
                )}
            </div>
        </>
    );
};

OrderableValue.propTypes = {
    field: PropTypes.object.isRequired,
    onFieldRemove: PropTypes.func,
    onValueReorder: PropTypes.func,
    index: PropTypes.number.isRequired,
    component: PropTypes.object
};
