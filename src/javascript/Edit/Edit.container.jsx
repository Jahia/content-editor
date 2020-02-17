import {connect} from 'react-redux';
import {withApollo} from 'react-apollo';
import {compose} from '~/utils';
import {withNotifications} from '@jahia/react-material';
import {withSiteInfo} from '~/SiteData';

import {FormQuery} from './EditForm.gql-queries';
import {Edit as EditComponent} from './Edit';

import {Constants} from '~/ContentEditor.constants';

const mapStateToProps = state => {
    const contentEditorUiLang = Constants.supportedLocales.includes(state.uilang) ?
        state.uilang :
        Constants.defaultLocale;

    return {
        path: state.jcontent.path,
        lang: state.language,
        uilang: state.uilang,
        site: state.site,
        siteDisplayableName: state.siteDisplayableName,
        formQuery: FormQuery,
        formQueryParams: {
            path: state.jcontent.path,
            language: state.language,
            uilang: contentEditorUiLang
        }
    };
};

export const Edit = compose(
    connect(mapStateToProps),
    withApollo,
    withNotifications(),
    withSiteInfo
)(EditComponent);
Edit.displayName = 'EditContainer';
