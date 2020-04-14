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
    env: {
        redux: 'redux',
        standalone: 'standalone'
    },
    notSupportedEngineTabs: ['content', 'categories'],
    systemFields: {
        OVERRIDE_SUBMIT_CALLBACK: 'OVERRIDE_SUBMIT_CALLBACK'
    },
    systemName: {
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
        ],
        MOVED_TO_CONTENT_FIELDSET_FOR_NODE_TYPES: [
            'jnt:page',
            'jnt:contentFolder',
            'jnt:folder',
            'jnt:file'
        ]
    },
    wip: {
        fieldName: 'WIP::Info',
        status: {
            DISABLED: 'DISABLED',
            ALL_CONTENT: 'ALL_CONTENT',
            LANGUAGES: 'LANGUAGES'
        }
    }
};
