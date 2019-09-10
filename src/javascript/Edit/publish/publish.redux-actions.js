import {PublishNodeMutation} from './publish.gql-mutation';
import {NodeQuery} from '../../EditPanelContainer/NodeData/NodeData.gql-queries';

export const publishNode = ({client, nodeData, lang, uiLang, notificationContext, actions, t}) => {
    return client.mutate({
        variables: {
            path: nodeData.path,
            languages: [lang]
        },
        mutation: PublishNodeMutation,
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
            notificationContext.notify(t('content-editor:label.contentEditor.edit.action.publish.success'), ['closeButton']);
            actions.setSubmitting(false);
        }, error => {
            console.error(error);
            notificationContext.notify(t('content-editor:label.contentEditor.edit.action.publish.error'), ['closeButton']);
            actions.setSubmitting(false);
        });
};
