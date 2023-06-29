import React from 'react';
import {useNodeChecks} from '@jahia/data-helper';
import * as PropTypes from 'prop-types';
import {shallowEqual, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useContentEditorApiContext} from '~/contexts/ContentEditorApi/ContentEditorApi.context';
import {RenameLayout} from '~/actions/jcontent/renameContent/RenameLayout';
import {useRenameFormDefinition} from '~/actions/jcontent/renameContent/useRenameFormDefinition';

export const RenameContent = ({path, editCallback, render: Render, loading: Loading, ...otherProps}) => {
    useTranslation('content-editor');
    const api = useContentEditorApiContext();
    const {language, site} = useSelector(state => ({language: state.language, site: state.site}), shallowEqual);
    const res = useNodeChecks(
        {path: path, language: language},
        {...otherProps}
    );

    if (Loading && res.loading) {
        return <Loading {...otherProps}/>;
    }

    return (
        <Render {...otherProps}
                isVisible={res.checksResult}
                onClick={() => {
                    api.edit({
                        uuid: res.node.uuid,
                        site,
                        lang: language,
                        isFullscreen: false,
                        editCallback,
                        dialogProps: {
                            classes: {}
                        },
                        layout: RenameLayout,
                        useFormDefinition: useRenameFormDefinition,
                        useConfirmationDialog: false
                    });
                }}
        />
    );
};

RenameContent.defaultProps = {
    loading: undefined,
    isFullscreen: false,
    editCallback: undefined
};

RenameContent.propTypes = {
    path: PropTypes.string.isRequired,
    isFullscreen: PropTypes.bool,
    editCallback: PropTypes.func,
    render: PropTypes.func.isRequired,
    loading: PropTypes.func
};

export const renameContentAction = {
    component: RenameContent
};
