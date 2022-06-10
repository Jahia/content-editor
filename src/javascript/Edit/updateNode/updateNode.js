import {SavePropertiesMutation} from './updateNode.gql-mutation';
import {getChildrenOrder, getDataToMutate} from '~/EditPanel/EditPanel.utils';
import {NodeQuery} from '../edit.gql-queries';
import {refetchPreview} from '~/EditPanel/EditPanel.refetches';
import {getPreviewPath} from '~/editorTabs/EditPanelContent/Preview/Preview.utils';
import {PublicationInfoQuery} from '~/PublicationInfo/PublicationInfo.gql-queries';
import {Constants} from '~/ContentEditor.constants';
import {registry} from '@jahia/ui-extender';
import {onServerError} from '~/Validation';
import {adaptUpdateRequest} from './adaptUpdateRequest';

export const updateNode = ({
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
        i18nContext,
        uilang
    }
}) => {
    const dataToMutate = getDataToMutate({nodeData, formValues: values, i18nContext, sections, lang: language});
    const {childrenOrder, shouldModifyChildren} = getChildrenOrder(values, nodeData);
    const wipInfo = values[Constants.wip.fieldName];
    let variables = adaptUpdateRequest(nodeData, {
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
    return client.mutate({
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
        const info = {originalNode: nodeData, updatedNode: mutation.data.jcr.mutateNode.node, language};
        if (editCallback) {
            editCallback(info);
        }

        actions.setSubmitting(false);
        // This needs to happen before potential editCallback as it refetches observables?
        client.cache.flushNodeEntryById(nodeData.uuid);
        refetchPreview(getPreviewPath(info.updatedNode), language);
        return info;
    }, error => {
        onServerError(error, actions, notificationContext, t, dataToMutate.propFieldNameMapping, 'content-editor:label.contentEditor.edit.action.save.error');
    });
};
