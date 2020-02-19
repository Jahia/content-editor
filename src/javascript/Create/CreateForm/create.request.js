import {CreateNode} from './createForm.gql-mutation';
import {getDataToMutate} from '~/EditPanel/EditPanel.utils';
import {nodeTypeFormatter} from './create.utils';

export const createNode = ({
    client,
    t,
    notificationContext,
    actions,
    createCallback,
    data: {
        primaryNodeType,
        nodeData,
        sections,
        values,
        language
    }
}) => {
    const {propsToSave, mixinsToAdd} = getDataToMutate({formValues: values, sections, lang: language});
    const nodeName = nodeTypeFormatter(primaryNodeType);
    client.mutate({
        variables: {
            uuid: nodeData.uuid,
            name: nodeName,
            primaryNodeType,
            mixins: mixinsToAdd,
            properties: propsToSave
        },
        mutation: CreateNode
    }).then(data => {
        if (createCallback) {
            createCallback(data.data.jcr.modifiedNodes[0].path);
        }

        notificationContext.notify(t('content-editor:label.contentEditor.create.createButton.success'), ['closeButton']);
        client.cache.flushNodeEntryById(nodeData.uuid);
        actions.setSubmitting(false);
    }, error => {
        console.error(error);
        notificationContext.notify(t('content-editor:label.contentEditor.create.createButton.error'), ['closeButton']);
        actions.setSubmitting(false);
    });
};
