import styles from './ErrorHandler.scss';

/**
 * Used to notify when some contents failed to be loaded in pickers due to access denied restrictions
 * @param error the error from graphQL
 * @param notificationContext the notification context
 * @param t the translation engine
 */
export const notifyAccessDenied = (error, notificationContext, t) => {
    if (error.graphQLErrors &&
        error.graphQLErrors.some(graphQLError => graphQLError.errorType === 'GqlAccessDeniedException')) {
        notificationContext.notify(t('content-editor:label.contentEditor.error.accessDenied'), ['closeButton', 'noAutomaticClose'], {
            classes: {
                root: styles.errorNotification
            }
        });
    }
};
