import gql from 'graphql-tag';

export const getSuggestionsTagsQuery = gql`query suggestTags(
    $prefix: String!,
    $limit: Long!,
    $startPath: String!,
    $minCount: Long,
    $offset: Long,
    $sortByCount: Boolean) {
        tag {
            suggest(prefix: $prefix,
             limit: $limit,
             startPath: $startPath,
             minCount: $minCount,
             offset: $offset,
             sortByCount: $sortByCount) {
                name
                occurences
        }
    }
}`;
