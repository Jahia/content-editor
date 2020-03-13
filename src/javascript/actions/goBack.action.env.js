import {Constants} from '../ContentEditor.constants';

const envBackActions = {};
envBackActions[Constants.env.redux] = context => {
    context.contentEditorConfigContext.envProps.setUrl({
        site: context.contentEditorConfigContext.site,
        language: context.contentEditorConfigContext.lang,
        mode: context.resolveUrlContext.mode,
        path: context.resolveUrlContext.path
    });
};

envBackActions[Constants.env.standalone] = context => {
    context.contentEditorConfigContext.envProps.goBackSaveCallback();
};

export default envBackActions;
