package org.jahia.modules.contenteditor.graphql.api;

import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import graphql.annotations.annotationTypes.GraphQLName;
import graphql.annotations.annotationTypes.GraphQLNonNull;
import org.apache.commons.lang.LocaleUtils;
import org.jahia.api.Constants;
import org.jahia.exceptions.JahiaRuntimeException;
import org.jahia.modules.contenteditor.api.forms.EditorFormException;
import org.jahia.modules.contenteditor.api.forms.EditorFormService;
import org.jahia.modules.contenteditor.api.forms.impl.EditorFormServiceImpl;
import org.jahia.modules.contenteditor.api.lock.StaticEditorLockService;
import org.jahia.modules.graphql.provider.dxm.DataFetchingException;
import org.jahia.modules.graphql.provider.dxm.osgi.annotations.GraphQLOsgiService;
import org.jahia.osgi.BundleUtils;
import org.jahia.services.content.*;
import org.jahia.services.scheduler.BackgroundJob;
import org.jahia.services.scheduler.SchedulerService;
import org.quartz.JobDataMap;
import org.quartz.JobDetail;
import org.quartz.SchedulerException;

import javax.inject.Inject;
import javax.jcr.RepositoryException;
import java.util.*;
import java.util.stream.Collectors;

/**
 * The root class for the GraphQL form mutations API
 */
public class GqlEditorFormMutations {

    private EditorFormService editorFormService;

    @Inject
    @GraphQLOsgiService
    public void setEditorFormService(EditorFormService editorFormService) {
        this.editorFormService = editorFormService;
    }

    /**
     * Unlock the given node for edition, if the node is locked.
     * In case the node was not locked, it's should not fail.
     *
     * @throws EditorFormException In case of any error during the unlocking
     */
    @GraphQLField
    @GraphQLDescription("Unlock the given node for edition, if the node is locked.")
    @GraphQLName("unlockEditor")
    public boolean unlockEditor(
        @GraphQLName("editorID") @GraphQLNonNull @GraphQLDescription("An ID generated client side used to identify the lock") String editorID
    ) throws EditorFormException {
        try {
            StaticEditorLockService.unlock(editorID);
            return true;
        } catch (RepositoryException e) {
            throw new EditorFormException("Unable to unlock content editor", e);
        }
    }

    @GraphQLField
    @GraphQLDescription("Publish the edited node with the ")
    public boolean publishForm(
        @GraphQLName("uuidOrPath") @GraphQLNonNull @GraphQLDescription("UUID or path of the edited node.") String uuidOrPath,
        @GraphQLName("locale") @GraphQLNonNull @GraphQLDescription("A string representation of a locale, in IETF BCP 47 language tag format, ie en_US, en, fr, fr_CH, ...") String locale
    ) {
        try {
            return editorFormService.publishForm(LocaleUtils.toLocale(locale), uuidOrPath);
        } catch (EditorFormException e) {
            throw new DataFetchingException(e);
        }
    }
}
