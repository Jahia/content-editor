import {useEffect} from 'react';
import PropTypes from 'prop-types';
import {useQuery} from '@apollo/react-hooks';
import {SubContentsCountQuery} from '../content.gql-queries';

export const SubContentCountLazyLoader = ({updateRow, row}) => {
    // TODO implement queries to get the subContents count
    const {data} = useQuery(SubContentsCountQuery, {
        variables: {
            path: row.path,
            typeFilter: row.props.selectableTypesTable
        }
    });

    useEffect(() => {
        if (data) {
            const count = data.jcr.nodeByPath.descendants.pageInfo.totalCount;
            updateRow({
                subContentsCount: count,
                navigateInto: count > 0
            });
        }
    }, [data]);

    return null;
};

SubContentCountLazyLoader.propTypes = {
    updateRow: PropTypes.func.isRequired,
    updateColumns: PropTypes.func.isRequired
};

SubContentCountLazyLoader.displayName = 'SubContentCountLazyLoader';
export default SubContentCountLazyLoader;
