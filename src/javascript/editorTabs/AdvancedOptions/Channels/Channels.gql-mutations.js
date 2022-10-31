import gql from 'graphql-tag';

export const CREATE_CHANNELS = gql`mutation NodeCreateChannels($path: String!, $selection: [String]!, $language: String!, $includeExclude: String!) {
    jcr {
        mutateNode(pathOrId: $path) {
            addMixins(mixins: ["jmix:channelSelection"])
            channelSelection: mutateProperty(name: "j:channelSelection") {
                setValues(language: $language, values: $selection)
            }
            includeExclude: mutateProperty(name: "j:channelIncludeOrExclude") {
                setValue(language: $language, value: $includeExclude)
            }
        }
    }
}`;

export const UPDATE_CHANNELS = gql`mutation NodeUpdateChannels($path: String!, $selection: [String]!, $language: String!, $includeExclude: String!) {
    jcr {
        mutateNode(pathOrId: $path) {
            channelSelection: mutateProperty(name: "j:channelSelection") {
                setValues(language: $language, values: $selection)
            }
            includeExclude: mutateProperty(name: "j:channelIncludeOrExclude") {
                setValue(language: $language, value: $includeExclude)
            } 
        }
    }
}`;

export const REMOVE_CHANNELS = gql`mutation NodeRemoveChannels($path: String!) {
    jcr {
        mutateNode(pathOrId: $path) {
            removeMixins(mixins: ["jmix:channelSelection"])
        }
    }
}`;
