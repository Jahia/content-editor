import React from 'react';
import {useQuery, useApolloClient} from '@apollo/react-hooks';
import {ALL_CHANNELS_QUERY, NODE_CHANNELS_QUERY} from './Channels.gql-queries';
import {UPDATE_CHANNELS, CREATE_CHANNELS, REMOVE_CHANNELS} from './Channels.gql-mutations';
import {Loading} from '@jahia/moonstone';
import {useContentEditorContext} from '~/contexts';
import {MultipleLeftRightSelector} from '../../../SelectorTypes/MultipleLeftRightSelector';

export const Channels = () => {
    const {path, lang} = useContentEditorContext();
    const client = useApolloClient();
    const {data: availableChannels, loading: loadingAll, error: errorAll} = useQuery(ALL_CHANNELS_QUERY);
    const {data: channels, loading: loadingNode, error: errorNode} = useQuery(NODE_CHANNELS_QUERY, {
        variables: {
            path: path,
            language: lang
        }
    });

    const changeHandler = selection => {
        const variables = {
            path: path,
            language: lang,
            includeExclude: 'include',
            selection: selection
        }

        let query = UPDATE_CHANNELS;

        if (!channels.jcr.nodeByPath.hasChannelsMixin) {
            query = CREATE_CHANNELS;
        }

        if (selection.length === 0) {
            query = REMOVE_CHANNELS;
        }

        client.mutate({
            variables,
            mutation: query,
            refetchQueries: [
                {
                    query: NODE_CHANNELS_QUERY,
                    variables: {
                        path: path,
                        language: lang
                    }
                },
            ]
        }).then(data => {
            console.log(data);
        }, error => console.error(error));
    }

    if (errorAll || errorNode) {
        console.error(errorAll, errorNode);
        return 'Error'
    }

    if (loadingAll || loadingNode) {
        return <Loading size="big"/>
    }

    console.log(availableChannels, channels);

    return (
        <div>
            <MultipleLeftRightSelector field={{multiple: true, valueConstraints: availableChannels.channels.map(ch => ({displayValue: ch.displayName, value: {string: ch.identifier}}))}}
                                       value={channels.jcr.nodeByPath?.channels?.values}
                                       onChange={s => changeHandler(s)}
            />
        </div>
    );
}

export default Channels;
