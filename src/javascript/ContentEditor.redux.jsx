import React from 'react';
import {connect} from 'react-redux';
import {ContentEditor} from './ContentEditor';
import PropTypes from 'prop-types';
import {compose} from '~/utils';
import {Constants} from '~/ContentEditor.constants';
import {useContentEditorHistory} from '~/ContentEditorHistory';

const mapStateToProps = state => {
    return {
        uilang: state.uilang,
        site: state.site
    };
};

const ContentEditorReduxCmp = ({mode, uuid, lang, uilang, site, contentType}) => {
    const history = useContentEditorHistory();
    const envProps = {
        setUrl: (mode, language, uuid, contentType) => history.redirect({mode, language, uuid, rest: contentType}),
        setLanguage: language => history.redirect({language})
    };
    return (
        <ContentEditor env={Constants.env.redux}
                       mode={mode}
                       uuid={uuid}
                       lang={lang}
                       uilang={uilang}
                       site={site}
                       contentType={contentType}
                       envProps={envProps}/>
    );
};

ContentEditorReduxCmp.propTypes = {
    mode: PropTypes.oneOf(['create', 'edit']).isRequired,
    uuid: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
    uilang: PropTypes.string.isRequired,
    site: PropTypes.string.isRequired,
    contentType: PropTypes.string
};

export const ContentEditorRedux = compose(
    connect(mapStateToProps)
)(ContentEditorReduxCmp);
ContentEditorRedux.displayName = 'ContentEditorRedux';
export default ContentEditorRedux;
