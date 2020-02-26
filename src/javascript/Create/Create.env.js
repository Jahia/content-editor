import {Constants} from '../ContentEditor.constants';

const envCreateCallbacks = {};
envCreateCallbacks[Constants.env.redux] = (createdNodePath, lang, contentEditorConfigContext) => {
    contentEditorConfigContext.envProps.setUrl({
        language: lang,
        mode: Constants.routes.baseEditRoute,
        path: createdNodePath,
        params: {}
    });
};

envCreateCallbacks[Constants.env.standalone] = (createdNodePath, lang, contentEditorConfigContext) => {
    contentEditorConfigContext.envProps.createCallback(createdNodePath);
};

export default envCreateCallbacks;
