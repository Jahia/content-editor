import gql from 'graphql-tag';

export const ALL_CHANNELS_QUERY = gql`query Channels {
    channels {
        identifier
        displayName
        visible
    }
}`;

export const NODE_CHANNELS_QUERY = gql`query NodeChannels($path: String!, $language: String!) {
    jcr {
        nodeByPath(path: $path) {
            channels: property(name: "j:channelSelection", language: $language) {
                values
            }
            includeOrExclude: property(name:"j:channelIncludeOrExclude", language: $language) {
                value
            }
            hasChannelsMixin: isNodeType(type:{types:["jmix:channelSelection"]})
        }
    }
}`;
