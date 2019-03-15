package org.jahia.modules.contenteditor.api.forms;

/**
 * An exception specific to our service, mostly to stay within our domain model because right now all it does it
 * wrap an Exception.
 */
public class EditorFormException extends Exception {

    public EditorFormException(String message) {
        super(message);
    }

    public EditorFormException(Throwable cause) {
        super(cause);
    }

    public EditorFormException(String message, Throwable cause) {
        super(message, cause);
    }
}
