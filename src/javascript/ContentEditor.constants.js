export const Constants = {
    editPanel: {
        submitOperation: {
            SAVE: 'SAVE',
            SAVE_PUBLISH: 'PUBLISH',
            UNPUBLISH: 'UNPUBLISH',
            CREATE: 'CREATE'
        },
        OPERATION_FIELD: 'SYSTEM_SUBMIT_OPERATION',
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
        baseCreateRoute: 'create',
        browseRoute: 'browse',
        browseFilesRoute: 'browse-files'
    }
};
