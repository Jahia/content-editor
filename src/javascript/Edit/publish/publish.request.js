import {PublishNodeMutation} from './publish.gql-mutation';
import {NodeQuery} from '~/NodeData/NodeData.gql-queries';

export const publishNode = ({
    client,
    t,
    notificationContext,
    data: {
        nodeData,
        language,
        uiLang
    },
    successCallback
}) => {
    return client.mutate({
        variables: {
            path: nodeData.path,
            languages: [language]
        },
        mutation: PublishNodeMutation,
        refetchQueries: [
            {
                query: NodeQuery,
                variables: {
                    path: nodeData.path,
                    language,
                    uiLang: uiLang
                }
            }
        ]
    })
        .then(() => {
            notificationContext.notify(t('content-editor:label.contentEditor.edit.action.publish.success'), ['closeButton']);
            if (successCallback) {
                successCallback();
            }
        }, error => {
            console.error(error);
            notificationContext.notify(t('content-editor:label.contentEditor.edit.action.publish.error'), ['closeButton']);
        });
};
