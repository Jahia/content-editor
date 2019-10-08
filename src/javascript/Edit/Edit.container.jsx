import {connect} from 'react-redux';
import {compose, withApollo} from 'react-apollo';
import {withNotifications} from '@jahia/react-material';
import {translate} from 'react-i18next';
import {withSiteInfo} from '~/EditPanelContainer/SiteData';

import {FormQuery} from './EditForm.gql-queries';
import {Edit as EditComponent} from './Edit';

import {Constants} from '~/ContentEditor.constants';

const mapStateToProps = state => {
    const contentEditorUiLang = Constants.supportedLocales.includes(state.uiLang) ?
        state.uiLang :
        Constants.defaultLocale;

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

export const Edit = compose(
    connect(mapStateToProps),
    withApollo,
    withNotifications(),
    translate(),
    withSiteInfo
)(EditComponent);
Edit.displayName = 'EditContainer';
