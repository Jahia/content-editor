import {useQuery} from '@apollo/react-hooks';
import {valueTypesQuery} from './valueTypes.gql-queries';
import {getValueNodeTypes} from './PickersWrapper.utils';

export const useValueTypes = uuid => {
    const {data, error, loading} = useQuery(valueTypesQuery, {
        variables: {
            uuid
        },
        skip: !uuid
    });

    if (loading || error || !data || !data.jcr || !uuid || (!data.jcr.result && uuid)) {
        return {error, loading, notFound: Boolean(uuid)};
    }

    const valueTypes = getValueNodeTypes(data.jcr.result);

    return {valueTypes, error, loading};
};
