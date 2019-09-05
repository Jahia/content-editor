import {connect} from 'react-redux';

import {FormQuery} from './EditForm.gql-queries';
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
            language: state.language,
            uiLang: contentEditorUiLang
        }
    };
};

export const Edit = connect(mapStateToProps)(EditPanelContainer);
Edit.displayName = 'EditContainer';
