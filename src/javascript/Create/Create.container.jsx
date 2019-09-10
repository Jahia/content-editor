import {connect} from 'react-redux';

import {FormQuery} from './createForm.gql-queries';
import EditPanelContainer from '../EditPanelContainer';

import EditPanelConstants from '../EditPanelContainer/EditPanel/EditPanelConstants';

const mapStateToProps = state => {
    const contentEditorUiLang = EditPanelConstants.supportedLocales.includes(state.uiLang) ?
        state.uiLang :
        EditPanelConstants.defaultLocale;

    return {
        path: state.path,
        lang: state.language,
        uiLang: state.uiLang,
        site: state.site,
        siteDisplayableName: state.siteDisplayableName,
        formQuery: FormQuery,
        formQueryParams: {
            path: state.path,
            parentPath: state.path,
            language: state.language,
            uiLang: contentEditorUiLang,
            primaryNodeType: state.params.contentType
        }
    };
};

export const Create = connect(mapStateToProps)(EditPanelContainer);
Create.displayName = 'CreateContainer';
