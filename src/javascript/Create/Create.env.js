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

envCreateCallbacks[Constants.env.standalone] = () => {
    // TODO BACKLOG-12172: implement standalone create (should open standalone edit)
};

export default envCreateCallbacks;
