import {connect} from 'react-redux';
import {compose, withApollo} from 'react-apollo';
import {withNotifications} from '@jahia/react-material';
import {withSiteInfo} from '~/SiteData';

import {FormQuery} from './CreateForm/createForm.gql-queries';
import {Create as CreateComponent} from './Create';

import {Constants} from '~/ContentEditor.constants';
import {cmGoto} from '~/ContentManager.redux-actions';

const mapDispatchToProps = dispatch => ({
    setUrl: gotoParams => dispatch(cmGoto(gotoParams))
});

const mapStateToProps = state => {
    const contentEditorUiLang = Constants.supportedLocales.includes(state.uilang) ?
        state.uilang :
        Constants.defaultLocale;

    return {
        path: state.path,
        lang: state.language,
        uilang: state.uilang,
        site: state.site,
        siteDisplayableName: state.siteDisplayableName,
        formQuery: FormQuery,
        formQueryParams: {
            path: state.path,
            parentPath: state.path,
            language: state.language,
            uilang: contentEditorUiLang,
            primaryNodeType: state.params.contentType
        }
    };
};

export const Create = compose(
    connect(mapStateToProps, mapDispatchToProps),
    withApollo,
    withNotifications(),
    withSiteInfo
)(CreateComponent);
Create.displayName = 'CreateContainer';
