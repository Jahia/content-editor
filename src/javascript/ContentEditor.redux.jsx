import React from 'react';
import {connect} from 'react-redux';
import ContentEditor from './ContentEditor';
import PropTypes from 'prop-types';
import {cmGoto} from '~/JContent.redux-actions';
import {setLanguage} from '~/JContent.redux-actions';
import {compose} from '~/utils';
import {Constants} from '~/ContentEditor.constants';

const mapStateToProps = state => {
    return {
        path: state.jcontent.path,
        lang: state.language,
        uilang: state.uilang,
        site: state.site,
        contentType: state.jcontent.params && state.jcontent.params.contentType ? state.jcontent.params.contentType : undefined
    };
};

const mapDispatchToProps = dispatch => ({
    setLanguage: language => {
        dispatch(setLanguage(language));
    },
    setUrl: gotoParams => dispatch(cmGoto(gotoParams))
});

const ContentEditorReduxCmp = ({mode, path, lang, uilang, site, contentType, setUrl, setLanguage}) => {
    // Redux fcts and specific props
    const envProps = {
        setUrl,
        setLanguage
    };

    return (
        <ContentEditor env={Constants.env.redux} mode={mode} path={path} lang={lang} uilang={uilang} site={site} contentType={contentType} envProps={envProps}/>
    );
};

ContentEditorReduxCmp.propTypes = {
    setUrl: PropTypes.func.isRequired,
    setLanguage: PropTypes.func.isRequired,
    mode: PropTypes.oneOf(['create', 'edit']).isRequired,
    path: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
    uilang: PropTypes.string.isRequired,
    site: PropTypes.string.isRequired,
    contentType: PropTypes.string
};

export const ContentEditorRedux = compose(
    connect(mapStateToProps, mapDispatchToProps)
)(ContentEditorReduxCmp);
ContentEditorRedux.displayName = 'ContentEditorRedux';
export default ContentEditorRedux;
