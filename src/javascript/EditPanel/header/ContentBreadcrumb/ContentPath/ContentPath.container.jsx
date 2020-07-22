import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import {useQuery} from '@apollo/react-hooks';

import {useContentEditorConfigContext} from '~/ContentEditor.context';
import {cmGoto} from '~/JContent.redux-actions';
import {GetContentPath} from './ContentPath.gql-queries';
import ContentPath from './ContentPath';

const ContentPathContainer = ({path}) => {
    const {envProps, site} = useContentEditorConfigContext();
    const dispatch = useDispatch();

    const {mode, language} = useSelector(state => ({
        mode: state.jcontent.mode,
        language: state.language
    }));

    const {data, error} = useQuery(GetContentPath, {
        variables: {
            path: path,
            language
        }
    });

    const handleNavigation = path => {
        let newMode = 'pages';

        if (path.startsWith(`/sites/${site}/files/`)) {
            newMode = 'media';
        } else if (path.startsWith(`/sites/${site}/contents/`)) {
            newMode = 'content-folders';
        }

        dispatch(cmGoto({
            mode: mode || newMode,
            path
        }));

        envProps.back();
    };

    if (error) {
        console.log(error);
    }

    const node = data?.jcr?.node || {};
    const items = useMemo(() => node.ancestors || [], [node]);
    return <ContentPath items={items} onItemClick={handleNavigation}/>;
};

ContentPathContainer.defaultProps = {
    path: ''
};

ContentPathContainer.propTypes = {
    path: PropTypes.string
};

export default ContentPathContainer;
