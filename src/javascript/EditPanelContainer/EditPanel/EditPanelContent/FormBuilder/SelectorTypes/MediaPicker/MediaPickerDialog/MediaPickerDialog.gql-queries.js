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
            typeFilter: ['jnt:file'],
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
                path: `${window.contextJsParameters.contextPath}/files/default${rawImg.path}`,
                name: rawImg.fileName.value,
                type: rawImg.children.nodes[0].mimeType.value.replace('image/', ''),
                width: rawImg.width.value,
                height: rawImg.height.value
            };
        }),
        error,
        loading
    };
};
