package org.jahia.modules.contenteditor.collab;

import io.reactivex.disposables.Disposable;
import io.reactivex.functions.Consumer;
import io.reactivex.subjects.PublishSubject;

import java.util.HashMap;
import java.util.Map;

class CollaborationService {
    private static Map<String, CollaborationIntance> collaborationInstances = new HashMap<>();

    static Disposable subscribeToCollaboration(String path, Consumer<CollaborationData> consumer) {
        CollaborationIntance collaboration = getCollaboration(path);
        return collaboration.getSubject().subscribe(consumer);
    }

    static CollaborationData connectUser(String path, String user) {
        CollaborationIntance collaboration = getCollaboration(path);

        collaboration.getCollaborationData().addUsers(user);
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
