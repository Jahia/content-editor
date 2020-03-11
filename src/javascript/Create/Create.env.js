import {Constants} from '../ContentEditor.constants';

const envCreateCallbacks = {};
envCreateCallbacks[Constants.env.redux] = (createdNodeUuid, lang, contentEditorConfigContext) => {
    contentEditorConfigContext.envProps.setUrl(Constants.routes.baseEditRoute, lang, createdNodeUuid, '');
};

envCreateCallbacks[Constants.env.standalone] = (createdNodeUuid, lang, contentEditorConfigContext) => {
    contentEditorConfigContext.envProps.createCallback(createdNodeUuid);
};

export default envCreateCallbacks;
