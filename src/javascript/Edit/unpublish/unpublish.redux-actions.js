import {UnpublishNodeMutation} from './unpublish.gql-mutation';
import {NodeQuery} from '../../EditPanelContainer/NodeData/NodeData.gql-queries';

export const unpublishNode = ({client, nodeData, lang, uiLang, notificationContext, actions, t}) => {
    return client.mutate({
        variables: {
            path: nodeData.path,
            languages: [lang]
        },
        mutation: UnpublishNodeMutation,
        refetchQueries: [
            {
                query: NodeQuery,
                variables: {
                    path: nodeData.path,
                    language: lang,
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
