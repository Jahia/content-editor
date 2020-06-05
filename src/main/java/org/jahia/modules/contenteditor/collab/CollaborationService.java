package org.jahia.modules.contenteditor.collab;

import io.reactivex.disposables.Disposable;
import io.reactivex.functions.Consumer;
import io.reactivex.subjects.PublishSubject;
import org.jahia.services.content.decorator.JCRFileNode;
import org.jahia.services.content.decorator.JCRUserNode;

import javax.jcr.RepositoryException;
import java.util.HashMap;
import java.util.Map;

class CollaborationService {
    private static Map<String, CollaborationIntance> collaborationInstances = new HashMap<>();

    static Disposable subscribeToCollaboration(String path, Consumer<CollaborationData> consumer) {
        CollaborationIntance collaboration = getCollaboration(path);
        return collaboration.getSubject().subscribe(consumer);
    }

    static CollaborationData connectUser(String path, JCRUserNode user) throws RepositoryException {
        CollaborationIntance collaboration = getCollaboration(path);

        CollaborationUser collaborationUser = new CollaborationUser(user.getUserKey());
        collaborationUser.setUserName(user.getDisplayableName());
        if (user.hasProperty("j:picture")) {
            collaborationUser.setUserPicture(((JCRFileNode) user.getProperty("j:picture").getNode()).getUrl());
        }

        collaboration.getCollaborationData().addUsers(collaborationUser);
        collaboration.getSubject().onNext(collaboration.getCollaborationData());

        return collaboration.getCollaborationData();
    }

    static void disconnectUser(String path, String user) {
        CollaborationIntance collaboration = getCollaboration(path);

        collaboration.getCollaborationData().removeUsers(user);
        collaboration.getSubject().onNext(collaboration.getCollaborationData());

        if (collaboration.getCollaborationData().getUsers().size() == 0) {
            collaborationInstances.remove(path);
        }
    }

    private static CollaborationIntance getCollaboration(String path) {
        if (!collaborationInstances.containsKey(path)) {
            collaborationInstances.put(path, new CollaborationIntance());
        }
        return collaborationInstances.get(path);
    }

    private static class CollaborationIntance {
        CollaborationData collaborationData;
        PublishSubject<CollaborationData> subject;

        CollaborationIntance() {
            collaborationData = new CollaborationData();
            subject = PublishSubject.create();
        }

        CollaborationData getCollaborationData() {
            return collaborationData;
        }

        public PublishSubject<CollaborationData> getSubject() {
            return subject;
        }
    }
}
