import React, {useCallback, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import {useQuery} from '@apollo/react-hooks';
import {push} from 'connected-react-router';

import {useContentEditorConfigContext, useContentEditorContext} from '~/contexts';
import {cmGoto} from '~/redux/JContent.redux-actions';
import {CloseConfirmationDialog} from '~/CloseConfirmationDialog';
import {GetContentPath} from './ContentPath.gql-queries';
import {ContentPathView} from './ContentPathView';
import {Constants} from '~/ContentEditor.constants';
import {useFormikContext} from 'formik';
import {isDirty} from '~/utils';

const findLastIndex = (array, callback) => {
    let lastIndex = -1;
    array.forEach((e, i) => {
        if (callback(e)) {
            lastIndex = i;
        }
    });
    return lastIndex;
};

const getItems = (mode, node) => {
    if (!node) {
        return [];
    }

    let ancestors = node.ancestors || [];

    if (ancestors.length === 0) {
        return Constants.routes.baseCreateRoute ? [node] : ancestors;
    }

    if (mode === Constants.routes.baseCreateRoute) {
        ancestors = [...ancestors, node];
    }

    if (node.isVisibleInContentTree) {
        return ancestors;
    }

    const indexOfLastAncestorInContentTree = findLastIndex(ancestors, a => a.isVisibleInContentTree);
    if (indexOfLastAncestorInContentTree > 0) {
        const lastAncestorInContentTree = ancestors[indexOfLastAncestorInContentTree];
        if (indexOfLastAncestorInContentTree + 1 === ancestors.length) {
            return [lastAncestorInContentTree];
        }

        const remainingAncestors = ancestors.slice(indexOfLastAncestorInContentTree + 1);
        return [lastAncestorInContentTree].concat(remainingAncestors);
    }

    return ancestors;
};

export const ContentPath = ({path}) => {
    const [dialogState, setDialogState] = useState({open: false});
    const {updateEditorConfig, mode} = useContentEditorConfigContext();
    const formik = useFormikContext();
    const {i18nContext} = useContentEditorContext();

    const dispatch = useDispatch();
    const {language} = useSelector(state => ({
        language: state.language
    }));

    const {data, error} = useQuery(GetContentPath, {
        variables: {
            path: path,
            language
        }
    });

    const dirty = isDirty(formik, i18nContext);

    const doRedirect = itemPath => {
        if (itemPath.startsWith('/sites/systemsite/categories/') || itemPath === '/sites/systemsite/categories') {
            const onExited = () => {
                dispatch(push('/category-manager'));
            };

            updateEditorConfig({closed: true, onExited});
        } else {
            let mode = 'pages';
            if (/^\/sites\/[^/]+\/files(\/.*)?$/.test(itemPath)) {
                mode = 'media';
            } else if (/^\/sites\/[^/]+\/contents(\/.*)?$/.test(itemPath)) {
                mode = 'content-folders';
            }

            const onExited = () => {
                dispatch(cmGoto({mode: mode, path: itemPath}));
            };

            updateEditorConfig({closed: true, onExited});
        }
    };

    const handleNavigation = itemPath => {
        if (dirty) {
            setDialogState({open: true, itemPath});
        } else {
            doRedirect(itemPath);
        }
    };

    const node = data?.jcr?.node;
    const items = useMemo(() => getItems(mode, node), [mode, node]);

    let onCloseDialog = useCallback(() => setDialogState({open: false}), [setDialogState]);
    if (error) {
        return <>{error.message}</>;
    }

    return (
        <>
            <CloseConfirmationDialog
                isOpen={dialogState.open}
                actionCallback={() => doRedirect(dialogState.itemPath)}
                onCloseDialog={onCloseDialog}
            />

            <ContentPathView items={items} onItemClick={handleNavigation}/>
        </>
    );
};

ContentPath.defaultProps = {
    path: ''
};

ContentPath.propTypes = {
    path: PropTypes.string
};
