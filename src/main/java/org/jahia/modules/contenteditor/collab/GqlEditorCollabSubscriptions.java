package org.jahia.modules.contenteditor.collab;

import graphql.annotations.annotationTypes.*;
import graphql.schema.DataFetchingEnvironment;
import graphql.servlet.GraphQLContext;
import io.reactivex.BackpressureStrategy;
import io.reactivex.Flowable;
import io.reactivex.FlowableEmitter;
import io.reactivex.Observer;
import io.reactivex.disposables.Disposable;
import io.reactivex.functions.Consumer;
import io.reactivex.schedulers.Schedulers;
import io.reactivex.subjects.PublishSubject;
import org.jahia.bin.filters.jcr.JcrSessionFilter;
import org.jahia.modules.contenteditor.api.forms.EditorFormException;
import org.jahia.modules.contenteditor.api.lock.StaticEditorLockService;
import org.jahia.modules.contenteditor.graphql.api.GqlEditorLockHeartBeat;
import org.jahia.modules.graphql.provider.dxm.DXGraphQLProvider;
import org.jahia.modules.graphql.provider.dxm.node.GqlJcrMutationSupport;
import org.jahia.services.content.JCRSessionFactory;
import org.jahia.services.content.decorator.JCRUserNode;
import org.jahia.services.usermanager.JahiaUser;
import org.reactivestreams.Publisher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;
import javax.servlet.http.HttpServletRequest;
import java.util.Optional;
import java.util.concurrent.TimeUnit;


/**
 * Subscription related to content edition
 */
@GraphQLTypeExtension(DXGraphQLProvider.Subscription.class)
public class GqlEditorCollabSubscriptions extends GqlJcrMutationSupport {

    private static final Logger logger = LoggerFactory.getLogger(GqlEditorCollabSubscriptions.class);

    @GraphQLField
    @GraphQLDescription("TODO")
    public static Publisher<CollaborationData> subscribeToCollaboration(
            DataFetchingEnvironment environment,
            @GraphQLName("nodePath") @GraphQLNonNull @GraphQLDescription("Path of the node") String nodePath) throws RepositoryException {


        Optional<HttpServletRequest> httpServletRequest = ((GraphQLContext) environment.getContext()).getRequest();
        if(!httpServletRequest.isPresent()) {
            return null;
        }

        JCRSessionFactory jcrSessionFactory = JCRSessionFactory.getInstance();
        JCRUserNode userNode = jcrSessionFactory.getCurrentUserSession().getUserNode();
        String userKey = userNode.getUserKey();

        CollaborationData initialCollaborationData = CollaborationService.connectUser(nodePath, userNode);

        return Flowable.create(obs-> {

            // send initialCollaboration
            obs.onNext(initialCollaborationData);

            // listen on collaboration data changes
            Disposable disposable = CollaborationService.subscribeToCollaboration(nodePath, collaborationData -> {
                if (collaborationData.isUserConnected(userKey)) {
                    // user still connected, send changes
                    obs.onNext(collaborationData);
                } else {
                    // user not connected anymore, disconnect
                    obs.onComplete();
                }
            });

            obs.setCancellable(()-> {
                // clear and cancel currrent processs
                logger.debug("Connection lost or closed");
                if (!disposable.isDisposed()) {
                    disposable.dispose();
                }
            });
        }, BackpressureStrategy.BUFFER);
    }
}
