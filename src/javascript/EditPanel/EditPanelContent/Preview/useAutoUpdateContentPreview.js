import {AUTO_UPDATE_CONTENT_PREVIEW_MUTATION} from './useAutoUpdateContentPreview.gql-queries';
import {getChildrenOrder, getDataToMutate} from '~/EditPanel/EditPanel.utils';
import {adaptSaveRequest} from '~/Edit/Edit.adapter';
import {Constants} from '~/ContentEditor.constants';
import {useMutation} from '@apollo/react-hooks';

export const useRefreshPreview = ({
    templateType,
    view,
    contextConfiguration,
    requestAttributes,
    data: {
        nodeData,
        sections,
        values,
        language
    }
}) => {
    const dataToMutate = getDataToMutate({nodeData, formValues: values, sections, lang: language});
    const {childrenOrder, shouldModifyChildren} = getChildrenOrder(values, nodeData);
    const wipInfo = values[Constants.wip.fieldName];

    return useMutation(AUTO_UPDATE_CONTENT_PREVIEW_MUTATION, {
        variables: adaptSaveRequest(nodeData, {
            uuid: nodeData.uuid,
            propertiesToSave: dataToMutate.propsToSave,
            propertiesToDelete: dataToMutate.propsToDelete,
            mixinsToAdd: dataToMutate.mixinsToAdd,
            mixinsToDelete: dataToMutate.mixinsToDelete,
            templateType: templateType,
            view: view,
            contextConfiguration: contextConfiguration,
            requestAttributes: requestAttributes,
            language,
            shouldModifyChildren,
            childrenOrder,
            wipInfo
        })
    });
};
