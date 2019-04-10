import {SavePropertiesMutation, PublishPropertiesMutation} from './NodeData/NodeData.gql-mutation';
import {getPropertiesToSave} from './EditPanel/EditPanel.utils';
import {NodeQuery} from './NodeData/NodeData.gql-queries';

export const publishNode = ({client, nodeData, lang, notificationContext, actions, t}) => {
    return client.mutate({
        variables: {
            path: nodeData.path,
            languages: [lang]
        },
        mutation: PublishPropertiesMutation,
        refetchQueries: [
            {
                query: NodeQuery,
                variables: {
                    path: nodeData.path,
                    language: lang
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

export const saveNode = ({client, nodeData, notificationContext, actions, path, lang, values, fields, t}) => {
    client.mutate({
        variables: {
            path: nodeData.path,
            properties: getPropertiesToSave(values, fields, lang)
        },
        mutation: SavePropertiesMutation,
        refetchQueries: [
            {
                query: NodeQuery,
                variables: {
                    path: path,
                    language: lang
                }
            }
        ]
    }).then(() => {
        notificationContext.notify(t('content-editor:label.contentEditor.edit.action.save.success'), ['closeButton']);
        actions.setSubmitting(false);
    }, error => {
        console.error(error);
        notificationContext.notify(t('content-editor:label.contentEditor.edit.action.save.error'), ['closeButton']);
        actions.setSubmitting(false);
    });
};
