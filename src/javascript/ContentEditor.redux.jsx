import React from 'react';
import {connect} from 'react-redux';
import ContentEditor from './ContentEditor';
import PropTypes from 'prop-types';
import {cmGoto} from '~/JContent.redux-actions';
import {compose} from '~/utils';

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
    setUrl: gotoParams => dispatch(cmGoto(gotoParams))
});

const ContentEditorReduxCmp = ({mode, path, lang, uilang, site, contentType, setUrl}) => {
    return (
        <ContentEditor mode={mode} path={path} lang={lang} uilang={uilang} site={site} contentType={contentType} setUrl={setUrl}/>
    );
};

ContentEditorReduxCmp.propTypes = {
    setUrl: PropTypes.func,
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
