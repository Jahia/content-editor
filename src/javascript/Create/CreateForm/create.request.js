import {CreateNode} from './createForm.gql-mutation';
import {getDataToMutate} from '~/EditPanel/EditPanel.utils';
import {adaptCreateRequest} from '../Create.adapter';
import {Constants} from '~/ContentEditor.constants';
import {onServerError} from '~/Validation/validation.utils';
import {registry} from '@jahia/ui-extender';

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
    const wipInfo = values[Constants.wip.fieldName];
    let variables = adaptCreateRequest({
        uuid: nodeData.uuid,
        name: nodeData.newName,
        primaryNodeType,
        mixins: mixinsToAdd,
        properties: propsToSave,
        wipInfo
    });
    // Hooks on content to be created
    const onCreates = registry.find({type: 'contentEditor.onCreate'});
    variables = onCreates?.reduce((updatedVariables, registeredOnCreate) => {
        try {
            return registeredOnCreate.onCreate(updatedVariables, nodeData) || updatedVariables;
        } catch (e) {
            console.error('An error occurred while executing onCreate', registeredOnCreate, variables, e);
        }

        return updatedVariables;
    }, variables);
    client.mutate({
        variables,
        mutation: CreateNode
    }).then(data => {
        if (createCallback) {
            createCallback(data.data.jcr.modifiedNodes[0].uuid);
        }

        notificationContext.notify(t('content-editor:label.contentEditor.create.createButton.success'), ['closeButton']);
        client.cache.flushNodeEntryById(nodeData.uuid);
        actions.setSubmitting(false);
    }, error => {
        onServerError(error, actions, notificationContext, t, 'content-editor:label.contentEditor.create.createButton.error');
    });
};
