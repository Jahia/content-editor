import React, {useState} from 'react';
import {ProgressOverlay} from '@jahia/react-material';
import * as PropTypes from 'prop-types';
import {translate} from 'react-i18next';
import {Picker} from '../../../../../../../../DesignSystem/Picker';
import {encodeJCRPath} from '../../../../../../EditPanel.utils';
import {MediaPickerFilledQuery} from './MediaPickerFilled.gql-queries';
import {MediaPickerDialog} from '../MediaPickerDialog';
import {useQuery} from 'react-apollo-hooks';

const MediaPickerFilledCmp = ({t, field, id, uuid, editorContext, formik, setActionContext}) => {
    const [isOpen, setIsOpen] = useState(false);

    const {data, error, loading} = useQuery(MediaPickerFilledQuery, {
        variables: {
            uuid: uuid
        }
    });

    if (error) {
        const message = t(
            'content-media-manager:label.contentManager.error.queryingContent',
            {details: error.message ? error.message : ''}
        );
        return <>{message}</>;
    }

    if (loading) {
        return <ProgressOverlay/>;
    }

    const imageData = data.jcr.result;
    const fieldData = {
        url: `${window.contextJsParameters.contextPath}/files/default${encodeJCRPath(imageData.path)}`,
        name: imageData.name,
        info: `${imageData.children.nodes[0].mimeType.value} - ${parseInt(
            imageData.height.value,
            10
        )}x${parseInt(imageData.width.value, 10)}px - 1.2mb`
    };

    setActionContext({
        open: setIsOpen
    });

    return (
        <>
            <Picker readOnly={field.formDefinition && field.formDefinition.readOnly}
                    field={field}
                    fieldData={fieldData}
                    selectedId={uuid}
                    id={id}
                    onClick={() => setIsOpen(!isOpen)}
            />

            <MediaPickerDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                editorContext={editorContext}
                initialSelectedItem={imageData.path}
                id={id}
                t={t}
                formik={formik}
                field={field}
            />
        </>
    );
};

MediaPickerFilledCmp.propTypes = {
    t: PropTypes.func.isRequired,
    field: PropTypes.object.isRequired,
    uuid: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    formik: PropTypes.object.isRequired,
    editorContext: PropTypes.object.isRequired,
    setActionContext: PropTypes.func.isRequired
};

export const MediaPickerFilled = translate()(MediaPickerFilledCmp);
