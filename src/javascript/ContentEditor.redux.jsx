import React from 'react';
import {connect} from 'react-redux';
import {ContentEditor} from './ContentEditor';
import PropTypes from 'prop-types';
import {compose} from '~/utils';
import {Constants} from '~/ContentEditor.constants';
import {useContentEditorHistory} from '~/ContentEditorHistory';
import {useTranslation} from 'react-i18next';

const mapStateToProps = state => {
    return {
        uilang: state.uilang,
        site: state.site
    };
};

const ContentEditorReduxCmp = ({mode, uuid, lang, uilang, site, contentType}) => {
    const {redirect, hasHistory, exit, registerBlockListener, unRegisterBlockListener} = useContentEditorHistory();
    const {t} = useTranslation();
    const envProps = {
        setUrl: (mode, language, uuid, contentType) => redirect({mode, language, uuid, rest: contentType}),
        back: exit,
        disabledBack: () => !hasHistory(),
        setLanguage: language => redirect({language}),
        initCallback: formik => {
            if (formik.dirty) {
                registerBlockListener(t('content-editor:label.contentEditor.edit.action.goBack.alert'));
            }
        },
        closeCallback: () => {
            unRegisterBlockListener();
        }
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
