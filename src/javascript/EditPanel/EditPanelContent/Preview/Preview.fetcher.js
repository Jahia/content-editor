import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {PreviewViewer} from './PreviewViewers';
import {useContentEditorSectionContext} from '~/ContentEditorSection/ContentEditorSection.context';
import {adaptSaveRequest} from '~/Edit/Edit.adapter';
import {getChildrenOrder, getDataToMutate} from '~/EditPanel/EditPanel.utils';
import {Constants} from '~/ContentEditor.constants';
import {useMutation} from '@apollo/react-hooks';
import {AUTO_UPDATE_CONTENT_PREVIEW_MUTATION} from '~/EditPanel/EditPanelContent/Preview/useAutoUpdateContentPreview.gql-queries';

export const PreviewFetcher = React.memo(({onContentNotFound, values, lang, nodeData, previewContext}) => {
    const [data, setData] = useState({});
    const {sections} = useContentEditorSectionContext();
    const [refreshPreview] = useMutation(AUTO_UPDATE_CONTENT_PREVIEW_MUTATION);
    useEffect(() => {
        const dataToMutate = getDataToMutate({nodeData, formValues: values, sections, lang});
        const {childrenOrder, shouldModifyChildren} = getChildrenOrder(values, nodeData);
        const wipInfo = values[Constants.wip.fieldName];
        refreshPreview({
            variables: adaptSaveRequest(nodeData, {
                uuid: nodeData.uuid,
                propertiesToSave: dataToMutate.propsToSave,
                propertiesToDelete: dataToMutate.propsToDelete,
                mixinsToAdd: dataToMutate.mixinsToAdd,
                mixinsToDelete: dataToMutate.mixinsToDelete,
                templateType: previewContext.templateType,
                view: previewContext.view,
                contextConfiguration: previewContext.contextConfiguration,
                requestAttributes: previewContext.requestAttributes,
                language: lang,
                shouldModifyChildren,
                childrenOrder,
                wipInfo
            })
        }).then(data => setData(data));
    }, [values]);

    return (
        <PreviewViewer
            data={data?.data?.jcr?.node?.node}
            previewContext={previewContext}
            onContentNotFound={onContentNotFound}
        />
    );
});

PreviewFetcher.propTypes = {
    onContentNotFound: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired,
    lang: PropTypes.object.isRequired,
    previewContext: PropTypes.object.isRequired,
    nodeData: PropTypes.object.isRequired
};
