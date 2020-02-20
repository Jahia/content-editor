import {Constants} from '../../ContentEditor.constants';

const doSwitchLanguage = (language, contentEditorConfigContext) => {
    contentEditorConfigContext.envProps.setLanguage(language);
};

// Redux and standalone use the same syntax
const envSwitchLanguages = {};
envSwitchLanguages[Constants.env.redux] = doSwitchLanguage;
envSwitchLanguages[Constants.env.standalone] = doSwitchLanguage;

export default envSwitchLanguages;
