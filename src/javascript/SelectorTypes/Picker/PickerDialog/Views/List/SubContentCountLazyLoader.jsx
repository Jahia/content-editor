import {useEffect} from 'react';
import PropTypes from 'prop-types';
import {useQuery} from '@apollo/react-hooks';
import {SubContentsCountQuery} from '../content.gql-queries';

export const SubContentCountLazyLoader = ({updateRow, row}) => {
    // Badge display 99+ in case of more than 99
    const {data} = useQuery(SubContentsCountQuery, {
        variables: {
            path: row.path,
            typeFilter: row.props.selectableTypesTable,
            limit: 100
        }
    });

    useEffect(() => {
        if (data) {
            const count = data.forms.subContentsCount;
            updateRow({
                subContentsCount: count,
                navigateInto: count > 0
            });
        }
    }, [data, updateRow]);

    return null;
};

SubContentCountLazyLoader.propTypes = {
    updateRow: PropTypes.func.isRequired,
    row: PropTypes.object.isRequired
};
