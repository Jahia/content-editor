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
        uilang
    }
}) => {
    return client.mutate({
        variables: {
            uuid: nodeData.uuid,
            languages: [language]
        },
        mutation: UnpublishNodeMutation,
        refetchQueries: [
            {
                query: NodeQuery,
                variables: {
                    uuid: nodeData.uuid,
                    language: language,
                    uilang: uilang
                }
            },
            {
                query: PublicationInfoQuery,
                variables: {
                    uuid: nodeData.uuid,
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
