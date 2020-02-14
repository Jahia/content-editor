import {connect} from 'react-redux';
import {withApollo} from 'react-apollo';
import {compose} from '~/utils';
import {withNotifications} from '@jahia/react-material';
import {withSiteInfo} from '~/SiteData';

import {FormQuery} from './CreateForm/createForm.gql-queries';
import {Create as CreateComponent} from './Create';

import {Constants} from '~/ContentEditor.constants';
import {cmGoto} from '~/JContent.redux-actions';

const mapDispatchToProps = dispatch => ({
    setUrl: gotoParams => dispatch(cmGoto(gotoParams))
});

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
            parentPath: state.jcontent.path,
            language: state.language,
            uilang: contentEditorUiLang,
            primaryNodeType: state.jcontent.params.contentType
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
