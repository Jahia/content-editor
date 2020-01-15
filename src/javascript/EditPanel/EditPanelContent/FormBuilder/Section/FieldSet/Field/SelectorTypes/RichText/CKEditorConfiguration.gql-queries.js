import gql from 'graphql-tag';

export const getCKEditorConfigurationPath = gql`
    query getCKEditorConfigurationPath($nodePath: String!) {
        forms {
            ckeditorConfigPath(nodePath: $nodePath)
            ckeditorToolbar(nodePath: $nodePath)
        }
    }
`;
