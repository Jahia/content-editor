import {Constants} from '../../ContentEditor.constants';

const envSwitchLanguages = {};
envSwitchLanguages[Constants.env.redux] = (language, contentEditorConfigContext, createdNodeUuid) => {
    if (contentEditorConfigContext.mode === Constants.routes.baseCreateRoute && createdNodeUuid) {
        contentEditorConfigContext.envProps.setUrl(Constants.routes.baseEditRoute, language, createdNodeUuid, '');
    } else {
        contentEditorConfigContext.envProps.setLanguage(language);
    }
};

envSwitchLanguages[Constants.env.standalone] = (language, contentEditorConfigContext, createdNodeUuid) => {
    if (contentEditorConfigContext.mode === Constants.routes.baseCreateRoute && createdNodeUuid) {
        contentEditorConfigContext.envProps.createCallback(createdNodeUuid, language);
    } else {
        contentEditorConfigContext.envProps.setLanguage(language);
    }
};

export default envSwitchLanguages;
