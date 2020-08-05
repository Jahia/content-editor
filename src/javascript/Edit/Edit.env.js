import {Constants} from '../ContentEditor.constants';

const envEditCallbacks = {};
envEditCallbacks[Constants.env.standalone] = (node, mutateNode, contentEditorConfigContext) => {
    contentEditorConfigContext.envProps.editCallback(node.uuid);
};

envEditCallbacks[Constants.env.redux] = (node, mutateNode, contentEditorConfigContext) => {
    contentEditorConfigContext.envProps.renameNode(node, mutateNode);
};

export default envEditCallbacks;
