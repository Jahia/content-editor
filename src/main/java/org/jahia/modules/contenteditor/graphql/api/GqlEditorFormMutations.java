/*
 * MIT License
 *
 * Copyright (c) 2002 - 2022 Jahia Solutions Group. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
package org.jahia.modules.contenteditor.graphql.api;

import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import graphql.annotations.annotationTypes.GraphQLName;
import graphql.annotations.annotationTypes.GraphQLNonNull;
import org.jahia.modules.contenteditor.api.forms.EditorFormException;
import org.jahia.modules.contenteditor.api.forms.EditorFormService;
import org.jahia.modules.contenteditor.api.forms.PublicationService;
import org.jahia.modules.contenteditor.api.lock.StaticEditorLockService;
import org.jahia.modules.graphql.provider.dxm.DataFetchingException;
import org.jahia.modules.graphql.provider.dxm.osgi.annotations.GraphQLOsgiService;
import org.jahia.utils.LanguageCodeConverters;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import javax.jcr.RepositoryException;

/**
 * The root class for the GraphQL form mutations API
 */
public class GqlEditorFormMutations {
    private static final Logger logger = LoggerFactory.getLogger(GqlEditorFormMutations.class);

    private EditorFormService editorFormService;
    private PublicationService publicationService;

    @Inject
    @GraphQLOsgiService
    public void setEditorFormService(EditorFormService editorFormService) {
        this.editorFormService = editorFormService;
    }

    @Inject
    @GraphQLOsgiService
    public void setPublicationService(PublicationService publicationService) {
        this.publicationService = publicationService;
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
            logger.info("Request for lock release {}", editorID);
            StaticEditorLockService.unlock(editorID);
            return true;
        } catch (RepositoryException e) {
            throw new EditorFormException("Unable to unlock content editor", e);
        }
    }

    @GraphQLField
    @GraphQLDescription("Publish the edited node with the associated technical sub nodes (visibility conditions, vanity urls, ACLs)")
    public boolean publishForm(
        @GraphQLName("uuidOrPath") @GraphQLNonNull @GraphQLDescription("UUID or path of the edited node.") String uuidOrPath,
        @GraphQLName("locale") @GraphQLNonNull @GraphQLDescription("A string representation of a locale, in IETF BCP 47 language tag format, ie en_US, en, fr, fr_CH, ...") String locale
    ) {
        try {
            return publicationService.publish(LanguageCodeConverters.getLocaleFromCode(locale), uuidOrPath);
        } catch (EditorFormException e) {
            throw new DataFetchingException(e);
        }
    }
}
