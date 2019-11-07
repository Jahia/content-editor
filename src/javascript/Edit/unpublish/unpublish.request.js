import {UnpublishNodeMutation} from './unpublish.gql-mutation';
import {NodeQuery} from '~/NodeData/NodeData.gql-queries';
import {PublicationInfoQuery} from '~/PublicationInfo/PublicationInfo.gql-queries';

export const unpublishNode = ({
    client,
    t,
    notificationContext,

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
            },
            {
                query: PublicationInfoQuery,
                variables: {
                    path: nodeData.path,
                    language: language
                }
            }
        ]
    })
        .then(() => {
            notificationContext.notify(t('content-editor:label.contentEditor.edit.action.unpublish.success'), ['closeButton']);
        }, error => {
            console.error(error);
            notificationContext.notify(t('content-editor:label.contentEditor.edit.action.unpublish.error'), ['closeButton']);
        });
};
