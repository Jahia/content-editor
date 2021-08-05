package org.jahia.modules.contenteditor.graphql.api;

import graphql.annotations.annotationTypes.*;
import graphql.kickstart.servlet.context.GraphQLServletContext;
import graphql.schema.DataFetchingEnvironment;
import io.reactivex.BackpressureStrategy;
import io.reactivex.Flowable;
import io.reactivex.FlowableEmitter;
import io.reactivex.disposables.Disposable;
import io.reactivex.schedulers.Schedulers;
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
import javax.servlet.http.HttpServletRequest;
import java.util.concurrent.TimeUnit;


/**
 * Subscription related to content edition
 */
@GraphQLTypeExtension(DXGraphQLProvider.Subscription.class)
public class GqlEditorSubscriptions extends GqlJcrMutationSupport {

    private static final Logger logger = LoggerFactory.getLogger(GqlEditorSubscriptions.class);

    private static final int HEART_BEAT_INTERVAL_IN_SECONDS = 3;

    @GraphQLField
    @GraphQLDescription("Lock the node for edition and subscribe to hold the lock. " +
        "The node is automatically unlocked when the client disconnect or close the connection")
    public static Publisher<GqlEditorLockHeartBeat> subscribeToEditorLock(
            DataFetchingEnvironment environment,
            @GraphQLName("nodePath") @GraphQLNonNull @GraphQLDescription("Path of the node to be locked.") String nodePath,
            @GraphQLName("editorID") @GraphQLNonNull @GraphQLDescription("An ID generated client side used to identify the lock") String editorID) throws EditorFormException {


        HttpServletRequest httpRequest = ((GraphQLServletContext) environment.getContext()).getHttpServletRequest();
        if (httpRequest == null) {
            return null;
        }

        JCRSessionFactory jcrSessionFactory = JCRSessionFactory.getInstance();
        JahiaUser currentUser = jcrSessionFactory.getCurrentUser();

        // lock the node
        try {
            if (!StaticEditorLockService.tryLock(httpRequest, nodePath, editorID)){
                // lock not supported by the node
                return null;
            }
        } catch (RepositoryException e) {
            throw new EditorFormException("Unable to lock node: " + nodePath, e);
        }

        return Flowable.create(obs-> {

            // heartbeat: send empty message to avoid consuming data transfer, it's just an heartbeat to see if client is still here
            Disposable disposable = startHeartBeats(obs, currentUser);

            obs.setCancellable(()-> {
                // clear and cancel currrent processs
                logger.debug("Connection lost or closed, unlock the node");
                try {
                    JCRSessionFactory.getInstance().setCurrentUser(currentUser);
                    StaticEditorLockService.unlock(httpRequest, editorID);
                } finally {
                    JcrSessionFilter.endRequest();
                }

                if (!disposable.isDisposed()) {
                    disposable.dispose();
                }
            });
        }, BackpressureStrategy.BUFFER);
    }

    private static Disposable startHeartBeats(FlowableEmitter<GqlEditorLockHeartBeat> obs, JahiaUser currentUser) {
        return Schedulers.newThread().schedulePeriodicallyDirect(() -> {
            try {
                JCRSessionFactory.getInstance().setCurrentUser(currentUser);
                obs.onNext(new GqlEditorLockHeartBeat());
            } finally {
                JcrSessionFilter.endRequest();
            }
        }, 0, HEART_BEAT_INTERVAL_IN_SECONDS, TimeUnit.SECONDS);
    }
}
