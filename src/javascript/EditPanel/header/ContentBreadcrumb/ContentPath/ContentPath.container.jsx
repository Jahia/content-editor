import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import {useQuery} from '@apollo/react-hooks';

import {cmGoto} from '~/JContent.redux-actions';
import {GetContentPath} from './ContentPath.gql-queries';
import ContentPath from './ContentPath';

const ContentPathContainer = ({path}) => {
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
        dispatch(cmGoto({
            mode: mode || 'content-folders',
            path
        }));
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
