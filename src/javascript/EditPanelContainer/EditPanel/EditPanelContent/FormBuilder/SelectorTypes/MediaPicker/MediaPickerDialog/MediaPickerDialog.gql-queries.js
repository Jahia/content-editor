import gql from 'graphql-tag';
import {useQuery} from 'react-apollo-hooks';

export const GET_FILES_QUERY = gql`
query ($path: String!, $typeFilter: [String]!) {
  jcr {
    result: nodeByPath(path: $path) {
      children(offset: 0, limit: 50, typesFilter: {types: $typeFilter, multi: ANY}) {
        pageInfo {
          totalCount
        }
        nodes {
            uuid
            path
            width: property(name: "j:width") {
             value
            }
            height: property(name: "j:height") {
             value
            }
            fileName: property(name: "j:nodename") {
             value
            }

            children(names:["jcr:content"]) {
             nodes {
               mimeType: property(name:"jcr:mimeType") {
                 value
               }
             }
            }
        }
      }
    }
  }
}
`;

export const useImagesData = path => {
    const {data, error, loading} = useQuery(GET_FILES_QUERY, {
        variables: {
            typeFilter: ['jmix:image'],
            path: path
        }
    });

    if (error || loading) {
        return {
            error, loading
        };
    }

    return {
        images: data.jcr.result.children.nodes.map(rawImg => {
            return {
                uuid: rawImg.uuid,
                path: `${window.contextJsParameters.contextPath}/files/default${rawImg.path}`,
                name: rawImg.fileName.value,
                type: rawImg.children.nodes[0].mimeType.value.replace('image/', ''),
                width: rawImg.width ? rawImg.width.value : null,
                height: rawImg.height ? rawImg.height.value : null
            };
        }),
        error,
        loading
    };
};
