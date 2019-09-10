import {SavePropertiesMutation} from './save.gql-mutation';
import {getDataToMutate} from '../../EditPanelContainer/EditPanel/EditPanel.utils';
import {NodeQuery} from '../../EditPanelContainer/NodeData/NodeData.gql-queries';
import {refetchPreview} from '../../EditPanelContainer/EditPanel.refetches';

export const saveNode = ({sections, client, nodeData, notificationContext, actions, path, lang, uiLang, values, t}) => {
    const dataToMutate = getDataToMutate(nodeData, values, sections, lang);

    client.mutate({
        variables: {
            path: nodeData.path,
            propertiesToSave: dataToMutate.propsToSave,
            propertiesToDelete: dataToMutate.propsToDelete,
            mixinsToAdd: dataToMutate.mixinsToAdd,
            mixinsToDelete: dataToMutate.mixinsToDelete,
            language: lang
        },
        mutation: SavePropertiesMutation,
        refetchQueries: [
            {
                query: NodeQuery,
                variables: {
                    path: path,
                    language: lang,
                    uiLang: uiLang
                }
            }
        ]
    }).then(() => {
        notificationContext.notify(t('content-editor:label.contentEditor.edit.action.save.success'), ['closeButton']);
        actions.setSubmitting(false);
        refetchPreview(path, lang);
    }, error => {
        console.error(error);
        notificationContext.notify(t('content-editor:label.contentEditor.edit.action.save.error'), ['closeButton']);
        actions.setSubmitting(false);
    });
};
