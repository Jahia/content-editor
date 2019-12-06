import React, {useEffect} from 'react';
import {ProgressOverlay} from '@jahia/react-material';
import * as PropTypes from 'prop-types';
import {useQuery} from 'react-apollo-hooks';
import {translate} from 'react-i18next';
import {ImageList} from '~/DesignSystem/ImageList';
import {encodeJCRPath} from '../../../../../../../../../EditPanel.utils';
import {MediaPickerImages} from './ImageListQuery.gql-queries';
import {builSearchQuery} from '../../Search/search.gql-queries';
import {registry} from '@jahia/registry';
import {useContentEditorContext} from '~/ContentEditor.context';

const ImageListQueryCmp = ({
    t,
    setSelectedItem,
    onImageDoubleClick,
    selectedPath,
    initialSelection,
    searchTerms
}) => {
    const {lang} = useContentEditorContext();
    const {data, error, loading, refetch} = useQuery(
        searchTerms ? builSearchQuery(['jmix:image']) : MediaPickerImages,
        {
            variables: {
                path: selectedPath,
                searchTerms,
                language: lang
            }
        }
    );

    useEffect(() => {
        registry.add('refetch-image-list', {
            type: 'refetch-upload',
            refetch: refetch
        });
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

    const nodes = searchTerms ? data.jcr.result.nodes : data.jcr.result.children.nodes;

    const images = nodes.map(rawImg => {
        return {
            uuid: rawImg.uuid,
            url: `${
                window.contextJsParameters.contextPath
            }/files/default${encodeJCRPath(rawImg.path)}?lastModified=${rawImg.lastModified.value}&t=thumbnail2`,
            path: rawImg.path,
            name: rawImg.name,
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
            onImageDoubleClick={onImageDoubleClick}
        />
    );
};

ImageListQueryCmp.defaultProps = {
    initialSelection: null,
    searchTerms: ''
};

ImageListQueryCmp.propTypes = {
    t: PropTypes.func.isRequired,
    setSelectedItem: PropTypes.func.isRequired,
    onImageDoubleClick: PropTypes.func.isRequired,
    selectedPath: PropTypes.string.isRequired,
    initialSelection: PropTypes.array,
    searchTerms: PropTypes.string
};

export const ImageListQuery = translate()(ImageListQueryCmp);
