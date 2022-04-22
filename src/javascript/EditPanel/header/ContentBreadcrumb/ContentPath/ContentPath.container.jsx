import React, {useCallback, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import {useQuery} from '@apollo/react-hooks';
import {push} from 'connected-react-router';

import {useContentEditorConfigContext} from '~/ContentEditor.context';
import {cmGoto} from '~/JContent.redux-actions';
import EditPanelDialogConfirmation from '~/EditPanel/EditPanelDialogConfirmation/EditPanelDialogConfirmation';
import {GetContentPath} from './ContentPath.gql-queries';
import ContentPath from './ContentPath';
import {Constants} from '~/ContentEditor.constants';
import {useFormikContext} from 'formik';

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

const ContentPathContainer = ({path, uuid, operator}) => {
    const [open, setOpen] = useState(false);
    const {envProps, site, mode} = useContentEditorConfigContext();
    const dispatch = useDispatch();
    const formik = useFormikContext();
    const {language} = useSelector(state => ({
        language: state.language
    }));

    const {data, error} = useQuery(GetContentPath, {
        variables: {
            path: path,
            language
        }
    });

    const handleNavigation = path => {
        if (formik.dirty) {
            setOpen(true);
        } else {
            if (path.startsWith('/sites/systemsite/categories/') || path === '/sites/systemsite/categories') {
                dispatch(push('/category-manager'));
            } else {
                let mode = 'pages';

                if (path.startsWith(`/sites/${site}/files/`) || path === `/sites/${site}/files`) {
                    mode = 'media';
                } else if (path.startsWith(`/sites/${site}/contents/`) || path === `/sites/${site}/contents`) {
                    mode = 'content-folders';
                }

                dispatch(cmGoto({
                    mode: mode,
                    path
                }));
            }

            if (envProps.shouldRedirectBreadcrumb()) {
                envProps.back();
            }
        }
    };

    const node = data?.jcr?.node;
    const items = useMemo(() => getItems(mode, node), [mode, node]);

    let onCloseDialog = useCallback(() => setOpen(false), [setOpen]);
    let actionCallback = useCallback(() => envProps.back(uuid, operator), [envProps, uuid, operator]);

    if (error) {
        return <>{error.message}</>;
    }

    return (
        <>
            <EditPanelDialogConfirmation
                isOpen={open}
                actionCallback={actionCallback}
                onCloseDialog={onCloseDialog}
            />

            <ContentPath items={items} onItemClick={handleNavigation}/>
        </>
    );
};

ContentPathContainer.defaultProps = {
    path: '',
    uuid: null,
    operator: null
};

ContentPathContainer.propTypes = {
    path: PropTypes.string,
    uuid: PropTypes.object,
    operator: PropTypes.object
};

export default ContentPathContainer;
