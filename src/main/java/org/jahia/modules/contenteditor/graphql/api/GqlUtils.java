package org.jahia.modules.contenteditor.graphql.api;

import java.util.function.Supplier;

/**
 * Copy of graphql utility class to provide boolean suppliers
 */
public class GqlUtils {
    private GqlUtils() {
    }

    public static class SupplierTrue implements Supplier<Object> {
        public SupplierTrue() {
        }

        public Boolean get() {
            return Boolean.TRUE;
        }
    }

    public static class SupplierFalse implements Supplier<Object> {
        public SupplierFalse() {
        }

        public Boolean get() {
            return Boolean.FALSE;
        }
    }
}
