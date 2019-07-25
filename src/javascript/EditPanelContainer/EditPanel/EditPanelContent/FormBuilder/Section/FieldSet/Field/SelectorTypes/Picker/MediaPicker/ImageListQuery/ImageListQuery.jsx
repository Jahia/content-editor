import React from 'react';
import {ProgressOverlay} from '@jahia/react-material';
import * as PropTypes from 'prop-types';
import {useQuery} from 'react-apollo-hooks';
import {translate} from 'react-i18next';
import {ImageList} from '../../../../../../../../../../../DesignSystem/ImageList';
import {encodeJCRPath} from '../../../../../../../../../EditPanel.utils';
import {MediaPickerImages} from './ImageListQuery.gql-queries';
import {FieldPropTypes} from '../../../../../../../../../../FormDefinitions/FormData.proptypes';

const ImageListQueryCmp = ({
    t,
    field,
    setSelectedItem,
    selectedPath,
    initialSelection,
    formik
}) => {
    const {data, error, loading} = useQuery(MediaPickerImages, {
        variables: {
            typeFilter: ['jmix:image'],
            path: selectedPath
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

    const images = data.jcr.result.children.nodes.map(rawImg => {
        return {
            uuid: rawImg.uuid,
            url: `${
                window.contextJsParameters.contextPath
            }/files/default${encodeJCRPath(rawImg.path)}`,
            path: rawImg.path,
            name: rawImg.fileName.value,
            type: rawImg.children.nodes[0].mimeType.value.replace('image/', ''),
            width: rawImg.width ? `${rawImg.width.value}` : null,
            height: rawImg.height ? `${rawImg.height.value}` : null
        };
    });

    return (
        <ImageList
            images={images}
            error={error}
            initialSelection={initialSelection}
            onImageSelection={setSelectedItem}
            onImageDoubleClick={image => {
                formik.setFieldValue(
                    field.name,
                    image.uuid,
                    true
                );
            }}
        />
    );
};

ImageListQueryCmp.defaultProps = {
    initialSelection: null
};

ImageListQueryCmp.propTypes = {
    t: PropTypes.func.isRequired,
    field: FieldPropTypes.isRequired,
    setSelectedItem: PropTypes.func.isRequired,
    selectedPath: PropTypes.string.isRequired,
    formik: PropTypes.object.isRequired,
    initialSelection: PropTypes.array
};

export const ImageListQuery = translate()(ImageListQueryCmp);
