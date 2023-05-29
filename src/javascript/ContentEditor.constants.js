export const Constants = {
    appName: 'content-editor',
    editPanel: {
        publicationStatus: {
            NOT_PUBLISHED: 'NOT_PUBLISHED',
            PUBLISHED: 'PUBLISHED',
            MODIFIED: 'MODIFIED',
            UNPUBLISHED: 'UNPUBLISHED',
            MANDATORY_LANGUAGE_UNPUBLISHABLE: 'MANDATORY_LANGUAGE_UNPUBLISHABLE',
            LIVE_MODIFIED: 'LIVE_MODIFIED',
            LIVE_ONLY: 'LIVE_ONLY',
            CONFLICT: 'CONFLICT',
            MANDATORY_LANGUAGE_VALID: 'MANDATORY_LANGUAGE_VALID',
            DELETED: 'DELETED',
            MARKED_FOR_DELETION: 'MARKED_FOR_DELETION'
        },
        editTab: 'EDIT'
    },
    field: {
        selectorType: {
            CHOICELIST: 'Choicelist'
        }
    },
    supportedLocales: ['en', 'fr', 'de'],
    defaultLocale: 'en',
    routes: {
        baseEditRoute: 'edit',
        baseCreateRoute: 'create'
    },
    operators: {
        update: 'update',
        create: 'create'
    },
    notSupportedEngineTabs: ['content', 'categories'],
    systemName: {
        name: 'nt:base_ce:systemName',
        propertyName: 'ce:systemName',
        READONLY_FOR_NODE_TYPES: [
            'jnt:group',
            'jnt:groupsFolder',
            'jnt:mounts',
            'jnt:remotePublications',
            'jnt:modules',
            'jnt:module',
            'jnt:moduleVersion',
            'jnt:templateSets',
            'jnt:user',
            'jnt:usersFolder',
            'jnt:virtualsite',
            'jnt:virtualsitesFolder'
        ]
    },
    wip: {
        fieldName: 'WIP::Info',
        status: {
            DISABLED: 'DISABLED',
            ALL_CONTENT: 'ALL_CONTENT',
            LANGUAGES: 'LANGUAGES'
        },
        notAvailableFor: ['jnt:virtualsite']
    },
    ordering: {
        childrenKey: 'Children::Order',
        automaticOrdering: {
            section: 'listOrdering',
            mixin: 'jmix:orderedList'
        }
    },
    permissions: {
        canSeeAdvancedOptionsTab: 'canSeeAdvancedOptionsTab',
        setContentLimitsOnAreas: 'setContentLimitsOnAreas'
    },
    childrenFilterTypes: ['jnt:content', 'jmix:manuallyOrderable', 'jnt:page', 'jmix:navMenuItem'],
    color: {
        hexColorRegexp: /^#([a-f0-9]{3,4}|[a-f0-9]{4}(?:[a-f0-9]{2}){1,2})\b$/i,
        errorCode: 'invalidColor',
        selectorType: 'Color'
    },
    keyCodes: {
        s: 83,
        esc: 27
    }
};
