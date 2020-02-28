import {Constants} from '../ContentEditor.constants';

const envEditCallbacks = {};
envEditCallbacks[Constants.env.standalone] = contentEditorConfigContext => {
    contentEditorConfigContext.envProps.editCallback();
};

export default envEditCallbacks;
