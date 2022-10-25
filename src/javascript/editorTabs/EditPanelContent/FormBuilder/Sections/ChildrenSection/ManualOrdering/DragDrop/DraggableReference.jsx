import React from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {useDrag} from 'react-dnd';
import {ReferenceCard} from '~/DesignSystem/ReferenceCard';
import {File} from '@jahia/moonstone';
import {encodeJCRPath} from '~/utils';

export const DraggableReference = ({child}) => {
    const {t} = useTranslation('content-editor');

    const [{isDragging}, drag] = useDrag({
        type: 'REFERENCE_CARD',
        item: {name: child.name},
        collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    });

    return (
        <div ref={drag}>
            {!isDragging &&
            <ReferenceCard
                isDraggable
                emptyLabel={t('content-editor:label.contentEditor.edit.fields.imagePicker.addImage')}
                emptyIcon={<File/>}
                labelledBy={`${child.name}-label`}
                fieldData={{
                    name: child.displayName,
                    info: child.primaryNodeType.displayName,
                    url: encodeJCRPath(`${child.primaryNodeType.icon}.png`)
                }}
            />}
        </div>
    );
};

DraggableReference.propTypes = {
    child: PropTypes.object.isRequired
};
