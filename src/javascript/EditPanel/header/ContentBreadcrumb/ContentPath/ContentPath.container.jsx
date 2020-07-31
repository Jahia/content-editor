import React, {useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import {useQuery} from '@apollo/react-hooks';
import {push} from 'connected-react-router';

import {useContentEditorConfigContext} from '~/ContentEditor.context';
import {cmGoto} from '~/JContent.redux-actions';
import EditPanelDialogConfirmation from '~/EditPanel/EditPanelDialogConfirmation/EditPanelDialogConfirmation';
import {GetContentPath} from './ContentPath.gql-queries';
import ContentPath from './ContentPath';

const findLastIndex = (array, callback) => {
    let lastIndex = -1;
    array.forEach((e, i) => {
        if (callback(e)) {
            lastIndex = i;
        }
    });
    return lastIndex;
};

const getItems = (node = {}) => {
    const ancestors = node.ancestors || [];

    if ((ancestors.length === 0) || node.isVisibleInContentTree) {
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

const ContentPathContainer = ({path, ...context}) => {
    const [open, setOpen] = useState(false);
    const {envProps, site} = useContentEditorConfigContext();
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

    const handleNavigation = path => {
        if (context.formik.dirty) {
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

            if (envProps.shouldRedirectBeadCrumb()) {
                envProps.back();
            }
        }
    };

    if (error) {
        console.log(error);
    }

    const node = data?.jcr?.node || {};
    const items = useMemo(() => getItems(node), [node]);

    return (
        <>
            <EditPanelDialogConfirmation
                open={open}
                titleKey="content-editor:label.contentEditor.edit.action.goBack.title"
                formik={context.formik}
                actionCallback={() => envProps.back(context.uuid, context.operator)}
                onCloseDialog={() => setOpen(false)}
            />

            <ContentPath items={items} onItemClick={handleNavigation}/>
        </>
    );
};

ContentPathContainer.defaultProps = {
    path: '',
    context: null
};

ContentPathContainer.propTypes = {
    path: PropTypes.string,
    context: PropTypes.object
};

export default ContentPathContainer;
