import React from 'react';
import {ProgressOverlay} from '@jahia/react-material';
import * as PropTypes from 'prop-types';
import {useQuery} from 'react-apollo-hooks';
import {translate} from 'react-i18next';
import {ImageList} from '../../../../../../../DesignSystem/ImageList';
import {encodeJCRPath} from '../../../../../EditPanel.utils';
import {MediaPickerImages} from './ImageListQuery.gql-queries';

const ImageListQueryCmp = ({t, field, setSelectedItem, selectedPath, formik}) => {
    const {data, error, loading} = useQuery(MediaPickerImages, {
        variables: {
            typeFilter: ['jmix:image'],
            path: selectedPath
        }
    });

    if (error) {
        const message = t('content-media-manager:label.contentManager.error.queryingContent', {details: (error.message ? error.message : '')});
        return (<>{message}</>);
    }

    if (loading) {
        return (<ProgressOverlay/>);
    }

    const images = data.jcr.result.children.nodes.map(rawImg => {
        return {
            uuid: rawImg.uuid,
            path: `${window.contextJsParameters.contextPath}/files/default${encodeJCRPath(rawImg.path)}`,
            name: rawImg.fileName.value,
            type: rawImg.children.nodes[0].mimeType.value.replace('image/', ''),
            width: rawImg.width ? rawImg.width.value : null,
            height: rawImg.height ? rawImg.height.value : null
        };
    });

    return (
        <ImageList
            images={images}
            error={error}
            onImageSelection={setSelectedItem}
            onImageDoubleClick={image => {
                formik.setFieldValue(field.formDefinition.name, image.uuid, true);
            }}
        />
    );
};

ImageListQueryCmp.propTypes = {
    t: PropTypes.func.isRequired,
    field: PropTypes.object.isRequired,
    setSelectedItem: PropTypes.func.isRequired,
    selectedPath: PropTypes.string.isRequired,
    formik: PropTypes.object.isRequired
};

export const ImageListQuery = translate()(ImageListQueryCmp);
