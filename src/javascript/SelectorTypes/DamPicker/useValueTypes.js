import {useQuery} from '@apollo/react-hooks';
import {valueTypesQuery} from './valueTypes.gql-queries';
import {getValueNodeTypes} from '~/SelectorTypes/DamPicker';

export const useValueTypes = uuid => {
    const {data, error, loading} = useQuery(valueTypesQuery, {
        variables: {
            uuid: uuid
        },
        skip: !uuid,
        errorPolicy: 'ignore'
    });

    if (loading || error || !data || !data.jcr || !uuid || (!data.jcr.result && uuid)) {
        return {error, loading, notFound: Boolean(uuid)};
    }

    // const fieldTypes = data.jcr.result.map(node => {
    //     return {
    //         [node.uuid]: getValueNodeTypes(node)
    //     };
    // });
    const fieldTypes = getValueNodeTypes(data.jcr.result);

    return {fieldTypes, error, loading};
};
