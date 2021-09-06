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
                logger.debug("Connection lost or closed, unlock the node");
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
