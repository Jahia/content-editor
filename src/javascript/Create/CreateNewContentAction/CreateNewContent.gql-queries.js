import gql from 'graphql-tag';

export const getTreeOfContent = gql`
  query getTreeOfContent( $uiLang:String!) {
     jcr {
         base: nodeTypeByName(name: "nt:base") {
             icon
           name
           displayName(language: $uiLang)
         }
         nodeTypeByName(name: "jmix:editorialContent") {
             subTypes {
                 nodes {
                   name
                   displayName(language: $uiLang)
                   mixin
                   icon
                   supertypes {
                     name
                     icon
                     displayName(language: $uiLang)
                     isNodeType(type: {types: "jmix:droppableContent"})
                     mixin
                   }
                 }
             }
         }
     }
  }
`;
