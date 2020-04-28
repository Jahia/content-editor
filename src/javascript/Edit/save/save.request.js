import {SavePropertiesMutation} from './save.gql-mutation';
import {getChildrenOrder, getDataToMutate} from '~/EditPanel/EditPanel.utils';
import {NodeQuery} from '~/NodeData/NodeData.gql-queries';
import {refetchPreview} from '~/EditPanel/EditPanel.refetches';
import {getPreviewPath} from '~/EditPanel/EditPanelContent/Preview/Preview.utils';
import {PublicationInfoQuery} from '~/PublicationInfo/PublicationInfo.gql-queries';
import {adaptSaveRequest} from '../Edit.adapter';
import {Constants} from '~/ContentEditor.constants';
import {onServerError} from '~/Validation/validation.utils';

export const saveNode = ({
    client,
    t,
    notificationContext,
    actions,
    editCallback,
    data: {
        nodeData,
        sections,
        values,
        language,
        uilang
    }
}) => {
    const dataToMutate = getDataToMutate({nodeData, formValues: values, sections, lang: language});
    const {childrenOrder, shouldModifyChildren} = getChildrenOrder(values, nodeData);
    const wipInfo = values[Constants.wip.fieldName];

    client.mutate({
        variables: adaptSaveRequest(nodeData, {
            uuid: nodeData.uuid,
            propertiesToSave: dataToMutate.propsToSave,
            propertiesToDelete: dataToMutate.propsToDelete,
            mixinsToAdd: dataToMutate.mixinsToAdd,
            mixinsToDelete: dataToMutate.mixinsToDelete,
            language,
            shouldModifyChildren,
            childrenOrder,
            wipInfo
        }),
        mutation: SavePropertiesMutation,
        refetchQueries: [
            {
                query: NodeQuery,
                variables: {
                    uuid: nodeData.uuid,
                    language,
                    uilang: uilang,
                    writePermission: `jcr:modifyProperties_default_${language}`
                }
            },
            {
                query: PublicationInfoQuery,
                variables: {
                    uuid: nodeData.uuid,
                    language
                }
            }
        ]
    }).then(() => {
        if (editCallback) {
            editCallback(nodeData.uuid);
        }

        notificationContext.notify(t('content-editor:label.contentEditor.edit.action.save.success'), ['closeButton']);
        actions.setSubmitting(false);
        client.cache.flushNodeEntryById(nodeData.uuid);
        refetchPreview(getPreviewPath(nodeData), language);
    }, error => {
        onServerError(error, actions, notificationContext, t, 'content-editor:label.contentEditor.edit.action.save.error');
    });
};
