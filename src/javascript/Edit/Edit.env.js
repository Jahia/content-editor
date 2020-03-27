import {Constants} from '../ContentEditor.constants';

const envEditCallbacks = {};
envEditCallbacks[Constants.env.standalone] = (nodeUuid, contentEditorConfigContext) => {
    contentEditorConfigContext.envProps.editCallback(nodeUuid);
};

export default envEditCallbacks;
