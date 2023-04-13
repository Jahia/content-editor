import {PublishNodeMutation} from './publish.gql-mutation';

export const publishNode = ({
    client,
    t,
    notificationContext,
    data: {
        nodeData,
        language
    },
    successCallback
}) => {
    return client.mutate({
        variables: {
            uuid: nodeData.uuid,
            language: language
        },
        mutation: PublishNodeMutation
    })
        .then(() => {
            notificationContext.notify(t('content-editor:label.contentEditor.edit.action.publish.success'), ['closeButton'], {autoHideDuration: 3000});
            if (successCallback) {
                successCallback();
            }
        }, error => {
            console.error(error);
            notificationContext.notify(t('content-editor:label.contentEditor.edit.action.publish.error'), ['closeButton']);
        });
};
