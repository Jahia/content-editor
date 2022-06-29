import {CreateNode} from './createNode.gql-mutation';
import {getDataToMutate} from '~/utils';
import {Constants} from '~/ContentEditor.constants';
import {registry} from '@jahia/ui-extender';
import {onServerError} from '~/validation';
import {adaptCreateRequest} from './adaptCreateRequest';

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
        language,
        i18nContext
    }
}) => {
    const {propsToSave, mixinsToAdd, propFieldNameMapping} = getDataToMutate({formValues: values, i18nContext, sections, lang: language});
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
    return client.mutate({
        variables,
        mutation: CreateNode
    }).then(data => {
        const info = {newNode: data.data.jcr.modifiedNodes[0], language};
        if (createCallback) {
            createCallback(info);
        }

        client.cache.flushNodeEntryById(nodeData.uuid);
        actions.setSubmitting(false);
        return info;
    }, error => {
        onServerError(error, actions, i18nContext, language, notificationContext, t, propFieldNameMapping, 'content-editor:label.contentEditor.create.createButton.error');
    });
};
