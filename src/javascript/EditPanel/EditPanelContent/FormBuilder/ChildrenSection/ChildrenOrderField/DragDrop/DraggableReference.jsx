import React from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {useDrag} from 'react-dnd';
import {ReferenceCard} from '~/DesignSystem/ReferenceCard';
import {InsertDriveFile} from '@material-ui/icons';
import {encodeJCRPath} from '~/EditPanel/EditPanel.utils';

export const DraggableReference = ({child}) => {
    const {t} = useTranslation();

    const [{isDragging}, drag] = useDrag({
        item: {type: 'REFERENCE_CARD', name: child.name},
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
                emptyIcon={<InsertDriveFile/>}
                labelledBy={`${child.name}-label`}
                fieldData={{
                    name: child.name,
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
