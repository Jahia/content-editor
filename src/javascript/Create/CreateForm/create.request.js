import {CreateNode} from './createForm.gql-mutation';

import {Constants} from '~/ContentEditor.constants';
import {getDataToMutate} from '~/EditPanelContainer/EditPanel/EditPanel.utils';
import {nodeTypeFormatter} from './create.utils';

export const createNode = ({
    client,
    t,
    notificationContext,
    actions,
    setUrl,
    data: {
        primaryNodeType,
        nodeData,
        sections,
        values,
        language
    }
}) => {
    const {propsToSave, mixinsToAdd} = getDataToMutate({formValues: values, sections, lang: language});
    // Todo generate node name from the title or primary property if any - BACKLOG-11079
    const nodeName = nodeTypeFormatter(primaryNodeType);
    client.mutate({
        variables: {
            parentPathOrId: nodeData.path,
            name: nodeName,
            primaryNodeType,
            mixins: mixinsToAdd,
            properties: propsToSave
        },
        mutation: CreateNode
    }).then(data => {
        const path = data.data.jcr.modifiedNodes[0].path;
        setUrl({
            language,
            mode: Constants.routes.baseEditRoute,
            path: path,
            params: {}
        });
        notificationContext.notify(t('content-editor:label.contentEditor.create.createButton.success'), ['closeButton']);
        actions.setSubmitting(false);
    }, error => {
        console.error(error);
        notificationContext.notify(t('content-editor:label.contentEditor.create.createButton.error'), ['closeButton']);
        actions.setSubmitting(false);
    });
};
