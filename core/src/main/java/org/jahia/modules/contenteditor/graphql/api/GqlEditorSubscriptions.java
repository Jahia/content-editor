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

import graphql.annotations.annotationTypes.*;
import io.reactivex.BackpressureStrategy;
import io.reactivex.Flowable;
import org.jahia.bin.filters.jcr.JcrSessionFilter;
import org.jahia.modules.contenteditor.api.forms.EditorFormException;
import org.jahia.modules.contenteditor.api.lock.StaticEditorLockService;
import org.jahia.modules.graphql.provider.dxm.DXGraphQLProvider;
import org.jahia.modules.graphql.provider.dxm.node.GqlJcrMutationSupport;
import org.jahia.services.content.JCRSessionFactory;
import org.jahia.services.usermanager.JahiaUser;
import org.reactivestreams.Publisher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;


/**
 * Subscription related to content edition
 */
@GraphQLTypeExtension(DXGraphQLProvider.Subscription.class)
public class GqlEditorSubscriptions extends GqlJcrMutationSupport {

    private static final Logger logger = LoggerFactory.getLogger(GqlEditorSubscriptions.class);

    @GraphQLField
    @GraphQLDescription("Lock the node for edition and subscribe to hold the lock. " +
        "The node is automatically unlocked when the client disconnect or close the connection")
    public static Publisher<String> subscribeToEditorLock(
            @GraphQLName("nodeId") @GraphQLNonNull @GraphQLDescription("Uuid of the node to be locked.") String uuid,
            @GraphQLName("editorID") @GraphQLNonNull @GraphQLDescription("An ID generated client side used to identify the lock") String editorID) throws EditorFormException {

        JCRSessionFactory jcrSessionFactory = JCRSessionFactory.getInstance();
        JahiaUser currentUser = jcrSessionFactory.getCurrentUser();

        // lock the node
        try {
            if (!StaticEditorLockService.tryLock(uuid, editorID)){
                // lock not supported by the node
                return null;
            }
        } catch (RepositoryException e) {
            throw new EditorFormException("Unable to lock node: " + uuid, e);
        }

        return Flowable.create(obs-> {
            // There is nothing sent by this publisher because only need to listen on the close to do the unlock.
            // Heartbeat is handled by the graphql websocket protocol.

            obs.setCancellable(()-> {
                // clear and cancel current process
                logger.info("Connection lost or closed, unlock the node");
                try {
                    JCRSessionFactory.getInstance().setCurrentUser(currentUser);
                    StaticEditorLockService.unlock(editorID);
                } finally {
                    JcrSessionFilter.endRequest();
                }
            });
        }, BackpressureStrategy.BUFFER);
    }
}
