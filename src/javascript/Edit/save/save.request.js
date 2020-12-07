import {SavePropertiesMutation} from './save.gql-mutation';
import {getChildrenOrder, getDataToMutate} from '~/EditPanel/EditPanel.utils';
import {NodeQuery} from '~/Edit/EditForm.gql-queries';
import {refetchPreview} from '~/EditPanel/EditPanel.refetches';
import {getPreviewPath} from '~/EditPanel/EditPanelContent/Preview/Preview.utils';
import {PublicationInfoQuery} from '~/PublicationInfo/PublicationInfo.gql-queries';
import {adaptSaveRequest} from '../Edit.adapter';
import {Constants} from '~/ContentEditor.constants';
import {onServerError} from '~/Validation/validation.utils';
import {registry} from '@jahia/ui-extender';

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
    let variables = adaptSaveRequest(nodeData, {
        uuid: nodeData.uuid,
        propertiesToSave: dataToMutate.propsToSave,
        propertiesToDelete: dataToMutate.propsToDelete,
        mixinsToAdd: dataToMutate.mixinsToAdd,
        mixinsToDelete: dataToMutate.mixinsToDelete,
        language,
        shouldModifyChildren,
        childrenOrder,
        wipInfo
    });

    // Hooks on content to be edited
    const onEdits = registry.find({type: 'contentEditor.onEdit'});
    variables = onEdits?.reduce((updatedVariables, registeredOnEdit) => {
        try {
            return registeredOnEdit.onEdit(updatedVariables, nodeData) || updatedVariables;
        } catch (e) {
            console.error('An error occurred while executing onEdit', registeredOnEdit, variables, e);
        }

        return updatedVariables;
    }, variables);
    client.mutate({
        variables,
        mutation: SavePropertiesMutation,
        refetchQueries: [
            {
                query: NodeQuery,
                variables: {
                    uuid: nodeData.uuid,
                    language,
                    uilang: uilang,
                    writePermission: `jcr:modifyProperties_default_${language}`,
                    childrenFilterTypes: Constants.childrenFilterTypes
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
    }).then(mutation => {
        const mutateNode = mutation.data.jcr.mutateNode;
        if (editCallback) {
            editCallback(nodeData, mutateNode);
        }

        notificationContext.notify(t('content-editor:label.contentEditor.edit.action.save.success'), ['closeButton']);
        actions.setSubmitting(false);
        client.cache.flushNodeEntryById(nodeData.uuid);
        refetchPreview(getPreviewPath(mutateNode.node), language);
    }, error => {
        onServerError(error, actions, notificationContext, t, dataToMutate.propFieldNameMapping, 'content-editor:label.contentEditor.edit.action.save.error');
    });
};
