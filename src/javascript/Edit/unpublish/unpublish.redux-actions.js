import {UnpublishNodeMutation} from './unpublish.gql-mutation';
import {NodeQuery} from '../../EditPanelContainer/NodeData/NodeData.gql-queries';

export const unpublishNode = ({
    client,
    t,
    notificationContext,
    actions,

    data: {
        nodeData,
        language,
        uiLang
    }
}) => {
    return client.mutate({
        variables: {
            path: nodeData.path,
            languages: [language]
        },
        mutation: UnpublishNodeMutation,
        refetchQueries: [
            {
                query: NodeQuery,
                variables: {
                    path: nodeData.path,
                    language: language,
                    uiLang: uiLang
                }
            }
        ]
    })
        .then(() => {
            notificationContext.notify(t('content-editor:label.contentEditor.edit.action.unpublish.success'), ['closeButton']);
            actions.setSubmitting(false);
        }, error => {
            console.error(error);
            notificationContext.notify(t('content-editor:label.contentEditor.edit.action.unpublish.error'), ['closeButton']);
            actions.setSubmitting(false);
        });
};
