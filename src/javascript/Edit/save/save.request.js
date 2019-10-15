import {SavePropertiesMutation} from './save.gql-mutation';
import {getDataToMutate} from '~/EditPanel/EditPanel.utils';
import {NodeQuery} from '~/NodeData/NodeData.gql-queries';
import {refetchPreview} from '~/EditPanel/EditPanel.refetches';
import {getPreviewPath} from '~/EditPanel/EditPanelContent/PreviewContainer/Preview/Preview.utils';

export const saveNode = ({
    client,
    t,
    notificationContext,
    actions,

    data: {
        path,
        nodeData,
        sections,
        values,
        language,
        uiLang
    }
}) => {
    const dataToMutate = getDataToMutate({nodeData, formValues: values, sections, lang: language});

    client.mutate({
        variables: {
            path: nodeData.path,
            propertiesToSave: dataToMutate.propsToSave,
            propertiesToDelete: dataToMutate.propsToDelete,
            mixinsToAdd: dataToMutate.mixinsToAdd,
            mixinsToDelete: dataToMutate.mixinsToDelete,
            language
        },
        mutation: SavePropertiesMutation,
        refetchQueries: [
            {
                query: NodeQuery,
                variables: {
                    path,
                    language,
                    uiLang: uiLang
                }
            }
        ]
    }).then(() => {
        notificationContext.notify(t('content-editor:label.contentEditor.edit.action.save.success'), ['closeButton']);
        actions.setSubmitting(false);
        refetchPreview(getPreviewPath(nodeData), language);
    }, error => {
        console.error(error);
        notificationContext.notify(t('content-editor:label.contentEditor.edit.action.save.error'), ['closeButton']);
        actions.setSubmitting(false);
    });
};
